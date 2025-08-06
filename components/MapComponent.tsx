'use client'

import React, { useRef, useEffect, useState } from 'react'
import { MapContainer, TileLayer, Polygon as LeafletPolygon, useMapEvents, useMap } from 'react-leaflet'
import { LatLng, LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Polygon, DataSource } from './Dashboard'
import { WeatherService } from '../utils/weatherService'

// Fix Leaflet default markers
import L from 'leaflet'
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapComponentProps {
  polygons: Polygon[]
  onPolygonAdd: (points: [number, number][]) => Promise<void>
  onPolygonDelete: (polygonId: string) => void
  isDrawing: boolean
  setIsDrawing: (drawing: boolean) => void
  dataSources: DataSource[]
  currentTime: Date
  timeRange: [Date, Date]
  currentPolygon: [number, number][]
  setCurrentPolygon: React.Dispatch<React.SetStateAction<[number, number][]>>
  onCreatePolygon: () => void
  polygonError: string | null
}

interface PolygonDrawerProps {
  isDrawing: boolean
  onPolygonComplete: (points: [number, number][]) => void
  setIsDrawing: (drawing: boolean) => void
  currentPolygon: [number, number][]
  setCurrentPolygon: React.Dispatch<React.SetStateAction<[number, number][]>>
}

const PolygonDrawer: React.FC<PolygonDrawerProps> = ({ 
  isDrawing, 
  onPolygonComplete, 
  setIsDrawing, 
  currentPolygon, 
  setCurrentPolygon 
}) => {
  const map = useMap()

  useMapEvents({
    click: (e) => {
      if (!isDrawing) return

      const { lat, lng } = e.latlng
      const newPoint: [number, number] = [lat, lng]
      
      setCurrentPolygon((prev: [number, number][]) => {
        const updated = [...prev, newPoint]
        
        // Limit to maximum 12 points
        if (updated.length > 12) {
          return prev // Don't add more than 12 points
        }
        
        return updated
      })
    },
  })

  // Reset polygon when drawing stops
  useEffect(() => {
    if (!isDrawing) {
      setCurrentPolygon([])
    }
  }, [isDrawing, setCurrentPolygon])

  return currentPolygon.length > 0 ? (
    <LeafletPolygon
      positions={currentPolygon as LatLngExpression[]}
      pathOptions={{ 
        color: '#8b5cf6', 
        fillColor: '#8b5cf6', 
        fillOpacity: 0.3,
        dashArray: '5, 5'
      }}
    />
  ) : null
}

const MapComponent: React.FC<MapComponentProps> = ({
  polygons,
  onPolygonAdd,
  onPolygonDelete,
  isDrawing,
  setIsDrawing,
  dataSources,
  currentTime,
  timeRange,
  currentPolygon,
  setCurrentPolygon,
  onCreatePolygon,
  polygonError,
}) => {
  const mapRef = useRef<L.Map>(null)

  const handlePolygonComplete = async (points: [number, number][]) => {
    if (points.length < 3) return

    // Call the parent handler with just the points
    await onPolygonAdd(points)
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[52.520008, 13.404954]} // Berlin coordinates
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Existing Polygons */}
        {polygons.map((polygon) => (
          <LeafletPolygon
            key={polygon.id}
            positions={polygon.points as LatLngExpression[]}
            pathOptions={{
              color: polygon.color,
              fillColor: polygon.color,
              fillOpacity: 0.5,
              weight: 2,
            }}
            eventHandlers={{
              click: () => {
                if (window.confirm('Delete this polygon?')) {
                  onPolygonDelete(polygon.id)
                }
              },
            }}
          />
        ))}

        {/* Polygon Drawing Tool */}
        <PolygonDrawer
          isDrawing={isDrawing}
          onPolygonComplete={handlePolygonComplete}
          setIsDrawing={setIsDrawing}
          currentPolygon={currentPolygon}
          setCurrentPolygon={setCurrentPolygon}
        />
      </MapContainer>

      {/* Polygon Creation Controls */}
      {isDrawing && (
        <div className="absolute top-4 left-4 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg z-[1000]">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Creating Polygon</h3>
              <button
                onClick={() => setIsDrawing(false)}
                className="text-gray-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>
            
            <div className="text-xs text-gray-300">
              Points: {currentPolygon.length}/12
            </div>
            
            {polygonError && (
              <div className="text-xs text-red-400 bg-red-900/20 border border-red-500/30 rounded px-2 py-1">
                {polygonError}
              </div>
            )}
            
            <div className="flex space-x-2">
              <button
                onClick={onCreatePolygon}
                disabled={currentPolygon.length < 3 || currentPolygon.length > 12}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  currentPolygon.length >= 3 && currentPolygon.length <= 12
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Create Polygon
              </button>
              <button
                onClick={() => setCurrentPolygon([])}
                className="px-3 py-1 rounded text-xs font-medium bg-gray-600 hover:bg-gray-700 text-white"
              >
                Clear Points
              </button>
            </div>
            
            <div className="text-xs text-gray-400">
              Click on map to add points (3-12 required)
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapComponent
