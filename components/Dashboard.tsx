'use client'

import React, { useState, useEffect } from 'react'
import { Globe, BarChart3 } from 'lucide-react'
import dynamic from 'next/dynamic'
import TimelineSlider from './TimelineSliderbar'
import DataSourceSidebar from './DataSourceSidebar'
import { usePolygonManager } from '../hooks/usePolygonManager'

// Dynamically import MapComponent to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>
})

export interface Polygon {
  id: string
  points: [number, number][]
  dataSource: string
  color: string
  lastValue?: number
}

export interface ColorRule {
  operator: string
  value: number
  color: string
}

export interface DataSource {
  id: string
  name: string
  field: string
  colorRules: ColorRule[]
}

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const [timeRange, setTimeRange] = useState<[Date, Date]>([new Date(), new Date()])
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: 'open-meteo',
      name: 'Open-Meteo Temperature',
      field: 'temperature_2m',
      colorRules: [
        { operator: '<', value: 10, color: '#ef4444' },
        { operator: '>=', value: 10, color: '#3b82f6' },
        { operator: '>=', value: 25, color: '#10b981' }
      ]
    }
  ])
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPolygon, setCurrentPolygon] = useState<[number, number][]>([])
  const [polygonError, setPolygonError] = useState<string | null>(null)

  // Use the polygon manager hook
  const { polygons, addPolygon, deletePolygon, isUpdating } = usePolygonManager({
    dataSources,
    currentTime,
    timeRange
  })

  // Initialize time range (15 days before and after today)
  useEffect(() => {
    const now = new Date()
    const start = new Date(now)
    start.setDate(now.getDate() - 15)
    const end = new Date(now)
    end.setDate(now.getDate() + 15)
    setTimeRange([start, end])
    setCurrentTime(now)
  }, [])

  const handleTimeChange = (time: Date | [Date, Date]) => {
    if (Array.isArray(time)) {
      setTimeRange(time)
    } else {
      setCurrentTime(time)
    }
  }

  const handleDataSourceUpdate = (updatedDataSources: DataSource[]) => {
    setDataSources(updatedDataSources)
  }

  const handleCreatePolygon = async () => {
    setPolygonError(null)
    
    if (currentPolygon.length < 3) {
      setPolygonError('A polygon must have at least 3 points')
      return
    }
    
    if (currentPolygon.length > 12) {
      setPolygonError('A polygon cannot have more than 12 points')
      return
    }
    
    try {
      await addPolygon(currentPolygon)
      setCurrentPolygon([])
      setIsDrawing(false)
      setPolygonError(null)
    } catch (error) {
      setPolygonError('Failed to create polygon. Please try again.')
      console.error('Error creating polygon:', error)
    }
  }

  const handleDrawingToggle = () => {
    if (isDrawing) {
      // Cancel drawing
      setIsDrawing(false)
      setCurrentPolygon([])
      setPolygonError(null)
    } else {
      // Start drawing
      setIsDrawing(true)
      setCurrentPolygon([])
      setPolygonError(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="w-8 h-8 text-purple-500" />
              <h1 className="text-2xl font-bold text-white">Spatial-Temporal Dashboard</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Timeline Slider */}
          <div className="p-4 border-b border-gray-800">
            <TimelineSlider
              timeRange={timeRange}
              currentTime={currentTime}
              onTimeChange={handleTimeChange}
            />
          </div>

          {/* Map Container */}
          <div className="flex-1 p-4">
            <div className="h-full bg-gray-800 rounded-lg overflow-hidden">
              <MapComponent
                polygons={polygons}
                onPolygonAdd={addPolygon}
                onPolygonDelete={deletePolygon}
                isDrawing={isDrawing}
                setIsDrawing={setIsDrawing}
                dataSources={dataSources}
                currentTime={currentTime}
                timeRange={timeRange}
                currentPolygon={currentPolygon}
                setCurrentPolygon={setCurrentPolygon}
                onCreatePolygon={handleCreatePolygon}
                polygonError={polygonError}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-gray-800">
          <DataSourceSidebar
            dataSources={dataSources}
            onDataSourceUpdate={handleDataSourceUpdate}
            polygons={polygons}
            onPolygonDelete={deletePolygon}
            isDrawing={isDrawing}
            onDrawingToggle={handleDrawingToggle}
            currentPolygon={currentPolygon}
            polygonError={polygonError}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
