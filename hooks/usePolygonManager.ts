import { useState, useCallback, useEffect } from 'react'
import { Polygon, DataSource } from '../components/Dashboard'
import { weatherService } from '../services/WeatherService'

interface UsePolygonManagerProps {
  dataSources: DataSource[]
  currentTime: Date
  timeRange: [Date, Date]
}

export const usePolygonManager = ({ dataSources, currentTime, timeRange }: UsePolygonManagerProps) => {
  const [polygons, setPolygons] = useState<Polygon[]>([])
  const [isUpdating, setIsUpdating] = useState(false)

  const addPolygon = useCallback(async (points: [number, number][]) => {
    if (points.length < 3 || points.length > 12) return

    // Calculate centroid for weather data
    const centroidLat = points.reduce((sum, point) => sum + point[0], 0) / points.length
    const centroidLng = points.reduce((sum, point) => sum + point[1], 0) / points.length

    const polygonId = `polygon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const defaultDataSource = dataSources[0]?.id || 'open-meteo'

    // Create polygon with default color first
    const newPolygon: Polygon = {
      id: polygonId,
      points,
      dataSource: defaultDataSource,
      color: '#8b5cf6',
    }

    // Add polygon to state immediately
    setPolygons(prev => {
      // Check if polygon with same points already exists to prevent duplicates
      const isDuplicate = prev.some(p => 
        p.points.length === points.length &&
        p.points.every((point, index) => 
          Math.abs(point[0] - points[index][0]) < 0.0001 &&
          Math.abs(point[1] - points[index][1]) < 0.0001
        )
      )
      
      if (isDuplicate) {
        console.warn('Polygon with similar points already exists')
        return prev
      }
      
      return [...prev, newPolygon]
    })

    // Fetch weather data and update color in background
    try {
      const weatherData = await weatherService.fetchWeatherData(
        centroidLat,
        centroidLng,
        new Date(currentTime.getTime() - 24 * 60 * 60 * 1000),
        new Date(currentTime.getTime() + 24 * 60 * 60 * 1000)
      )

      if (weatherData) {
        const temperature = weatherService.getValueForTime(weatherData, currentTime)
        const color = weatherService.calculatePolygonColor(newPolygon, temperature, dataSources)
        
        // Update polygon with actual data and color
        setPolygons(prev => 
          prev.map(p => 
            p.id === polygonId
              ? { ...p, color, lastValue: temperature }
              : p
          )
        )
      }
    } catch (error) {
      console.error('Error updating polygon with weather data:', error)
    }
  }, [dataSources, currentTime])

  const deletePolygon = useCallback((polygonId: string) => {
    setPolygons(prev => prev.filter(p => p.id !== polygonId))
  }, [])

  const updatePolygonDataSource = useCallback((polygonId: string, dataSourceId: string) => {
    setPolygons(prev => 
      prev.map(p => 
        p.id === polygonId
          ? { ...p, dataSource: dataSourceId }
          : p
      )
    )
  }, [])

  // Update all polygons when time changes
  const updatePolygonsForTime = useCallback(async () => {
    if (polygons.length === 0) return

    setIsUpdating(true)

    try {
      const updatePromises = polygons.map(async (polygon) => {
        const centroidLat = polygon.points.reduce((sum, point) => sum + point[0], 0) / polygon.points.length
        const centroidLng = polygon.points.reduce((sum, point) => sum + point[1], 0) / polygon.points.length

        try {
          const weatherData = await weatherService.fetchWeatherData(
            centroidLat,
            centroidLng,
            new Date(currentTime.getTime() - 24 * 60 * 60 * 1000),
            new Date(currentTime.getTime() + 24 * 60 * 60 * 1000)
          )

          if (weatherData) {
            const temperature = weatherService.getValueForTime(weatherData, currentTime)
            const color = weatherService.calculatePolygonColor(polygon, temperature, dataSources)
            
            return {
              ...polygon,
              color,
              lastValue: temperature
            }
          }
        } catch (error) {
          console.error(`Error updating polygon ${polygon.id}:`, error)
        }

        return polygon
      })

      const updatedPolygons = await Promise.all(updatePromises)
      setPolygons(updatedPolygons)
    } catch (error) {
      console.error('Error updating polygons:', error)
    } finally {
      setIsUpdating(false)
    }
  }, [polygons, currentTime, dataSources])

  // Auto-update when time changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updatePolygonsForTime()
    }, 500) // Debounce updates

    return () => clearTimeout(timeoutId)
  }, [currentTime, updatePolygonsForTime])

  return {
    polygons,
    addPolygon,
    deletePolygon,
    updatePolygonDataSource,
    isUpdating
  }
}
