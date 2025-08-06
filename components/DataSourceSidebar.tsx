'use client'

import React, { useState } from 'react'
import { Pencil, Trash2, Plus, Settings, Database } from 'lucide-react'
import { Polygon, DataSource, ColorRule } from './Dashboard'

interface DataSourceSidebarProps {
  dataSources: DataSource[]
  onDataSourceUpdate: (dataSources: DataSource[]) => void
  polygons: Polygon[]
  onPolygonDelete: (polygonId: string) => void
  isDrawing: boolean
  onDrawingToggle: () => void
  currentPolygon: [number, number][]
  polygonError: string | null
}

const DataSourceSidebar: React.FC<DataSourceSidebarProps> = ({
  dataSources,
  onDataSourceUpdate,
  polygons,
  onPolygonDelete,
  isDrawing,
  onDrawingToggle,
  currentPolygon,
  polygonError,
}) => {
  const [expandedDataSource, setExpandedDataSource] = useState<string | null>(null)
  const [editingRule, setEditingRule] = useState<{ dataSourceId: string; ruleIndex: number } | null>(null)

  const addColorRule = (dataSourceId: string) => {
    const updatedDataSources = dataSources.map(ds => {
      if (ds.id === dataSourceId) {
        return {
          ...ds,
          colorRules: [
            ...ds.colorRules,
            { operator: '>=', value: 0, color: '#6b7280' }
          ]
        }
      }
      return ds
    })
    onDataSourceUpdate(updatedDataSources)
  }

  const updateColorRule = (dataSourceId: string, ruleIndex: number, updatedRule: ColorRule) => {
    const updatedDataSources = dataSources.map(ds => {
      if (ds.id === dataSourceId) {
        const newRules = [...ds.colorRules]
        newRules[ruleIndex] = updatedRule
        return { ...ds, colorRules: newRules }
      }
      return ds
    })
    onDataSourceUpdate(updatedDataSources)
  }

  const deleteColorRule = (dataSourceId: string, ruleIndex: number) => {
    const updatedDataSources = dataSources.map(ds => {
      if (ds.id === dataSourceId) {
        return {
          ...ds,
          colorRules: ds.colorRules.filter((_, index) => index !== ruleIndex)
        }
      }
      return ds
    })
    onDataSourceUpdate(updatedDataSources)
  }

  const colorOptions = [
    { name: 'Red', value: '#ef4444' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Gray', value: '#6b7280' },
  ]

  return (
    <div className="h-full bg-gray-800 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Controls
        </h2>
      </div>

      {/* Drawing Controls */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Polygon Tools</h3>
        <button
          onClick={onDrawingToggle}
          className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
            isDrawing
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {isDrawing ? 'Cancel Drawing' : 'Draw Polygon'}
        </button>
        
        {isDrawing && (
          <div className="mt-3 space-y-2">
            <div className="text-xs text-gray-400">
              Points added: {currentPolygon.length}/12
            </div>
            {polygonError && (
              <div className="text-xs text-red-400 bg-red-900/20 border border-red-500/30 rounded px-2 py-1">
                {polygonError}
              </div>
            )}
            <div className="text-xs text-gray-400">
              Click on the map to add points (3-12 required). Use the controls on the map to create the polygon.
            </div>
          </div>
        )}
      </div>

      {/* Data Sources */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
          <Database className="w-4 h-4 mr-2" />
          Data Sources
        </h3>
        
        {dataSources.map((dataSource) => (
          <div key={dataSource.id} className="mb-4 bg-gray-900 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-white">{dataSource.name}</h4>
              <button
                onClick={() => setExpandedDataSource(
                  expandedDataSource === dataSource.id ? null : dataSource.id
                )}
                className="text-gray-400 hover:text-white"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-gray-400 mb-2">Field: {dataSource.field}</p>
            
            {expandedDataSource === dataSource.id && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-300">Color Rules</span>
                  <button
                    onClick={() => addColorRule(dataSource.id)}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {dataSource.colorRules.map((rule, ruleIndex) => (
                  <div key={ruleIndex} className="bg-gray-800 rounded p-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <select
                        value={rule.operator}
                        onChange={(e) => updateColorRule(dataSource.id, ruleIndex, {
                          ...rule,
                          operator: e.target.value
                        })}
                        className="bg-gray-700 text-white text-xs rounded px-2 py-1 flex-1"
                      >
                        <option value="<">Less than</option>
                        <option value="<=">Less than or equal</option>
                        <option value="=">Equal to</option>
                        <option value=">=">Greater than or equal</option>
                        <option value=">">Greater than</option>
                      </select>
                      
                      <input
                        type="number"
                        value={rule.value}
                        onChange={(e) => updateColorRule(dataSource.id, ruleIndex, {
                          ...rule,
                          value: parseFloat(e.target.value) || 0
                        })}
                        className="bg-gray-700 text-white text-xs rounded px-2 py-1 w-20"
                      />
                      
                      <button
                        onClick={() => deleteColorRule(dataSource.id, ruleIndex)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">Color:</span>
                      <select
                        value={rule.color}
                        onChange={(e) => updateColorRule(dataSource.id, ruleIndex, {
                          ...rule,
                          color: e.target.value
                        })}
                        className="bg-gray-700 text-white text-xs rounded px-2 py-1 flex-1"
                      >
                        {colorOptions.map((color) => (
                          <option key={color.value} value={color.value}>
                            {color.name}
                          </option>
                        ))}
                      </select>
                      <div
                        className="w-4 h-4 rounded border border-gray-600"
                        style={{ backgroundColor: rule.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Polygons List */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-3">
          Polygons ({polygons.length})
        </h3>
        
        {polygons.length === 0 ? (
          <p className="text-xs text-gray-500">No polygons drawn yet. Click "Draw Polygon" to start.</p>
        ) : (
          <div className="space-y-2">
            {polygons.map((polygon, index) => (
              <div key={polygon.id} className="bg-gray-900 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded border border-gray-600"
                      style={{ backgroundColor: polygon.color }}
                    />
                    <span className="text-sm text-white">Polygon {index + 1}</span>
                  </div>
                  <button
                    onClick={() => onPolygonDelete(polygon.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mt-2 text-xs text-gray-400">
                  <p>Points: {polygon.points.length}</p>
                  <p>Data Source: {dataSources.find(ds => ds.id === polygon.dataSource)?.name || 'Unknown'}</p>
                  {polygon.lastValue !== undefined && (
                    <p>Last Value: {polygon.lastValue.toFixed(1)}°C</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DataSourceSidebar
