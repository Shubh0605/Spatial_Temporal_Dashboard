'use client'

import React, { useState, useEffect } from 'react'
import { Clock, Calendar } from 'lucide-react'

interface TimelineSliderProps {
  timeRange: [Date, Date]
  currentTime: Date
  onTimeChange: (time: Date | [Date, Date]) => void
}

const TimelineSlider: React.FC<TimelineSliderProps> = ({
  timeRange,
  currentTime,
  onTimeChange,
}) => {
  const [mode, setMode] = useState<'single' | 'range'>('single')
  const [currentValue, setCurrentValue] = useState<number>(0)
  const [rangeStart, setRangeStart] = useState<number>(0)
  const [rangeEnd, setRangeEnd] = useState<number>(720)

  // Convert time to hours from start of range
  const timeToHours = (date: Date) => {
    const diff = date.getTime() - timeRange[0].getTime()
    return Math.floor(diff / (1000 * 60 * 60))
  }

  // Convert hours to date
  const hoursToTime = (hours: number) => {
    const startTime = timeRange[0].getTime()
    return new Date(startTime + hours * 60 * 60 * 1000)
  }

  useEffect(() => {
    const currentHours = timeToHours(currentTime)
    setCurrentValue(Math.max(0, Math.min(720, currentHours)))
  }, [currentTime, timeRange])

  const handleSingleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value)
    setCurrentValue(value)
    const newTime = hoursToTime(value)
    onTimeChange(newTime)
  }

  const handleRangeStartChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value)
    setRangeStart(value)
    const startTime = hoursToTime(value)
    const endTime = hoursToTime(rangeEnd)
    onTimeChange([startTime, endTime])
  }

  const handleRangeEndChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value)
    setRangeEnd(value)
    const startTime = hoursToTime(rangeStart)
    const endTime = hoursToTime(value)
    onTimeChange([startTime, endTime])
  }

  const formatTime = (hours: number) => {
    const date = hoursToTime(hours)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const generateTicks = () => {
    const ticks = []
    for (let i = 0; i <= 720; i += 24) { // Every day
      ticks.push(i)
    }
    return ticks
  }

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium">Timeline Mode:</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setMode('single')}
            className={`px-3 py-1 rounded text-sm ${
              mode === 'single'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Single Point
          </button>
          <button
            onClick={() => setMode('range')}
            className={`px-3 py-1 rounded text-sm ${
              mode === 'range'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Time Range
          </button>
        </div>
      </div>

      {/* Timeline Slider */}
      <div className="space-y-3">
        <div className="px-4">
          {mode === 'single' ? (
            <div className="relative">
              <input
                type="range"
                min={0}
                max={720}
                value={currentValue}
                onChange={handleSingleChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                <label className="text-xs text-gray-400 block mb-1">Start Time</label>
                <input
                  type="range"
                  min={0}
                  max={720}
                  value={rangeStart}
                  onChange={handleRangeStartChange}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <div className="relative">
                <label className="text-xs text-gray-400 block mb-1">End Time</label>
                <input
                  type="range"
                  min={0}
                  max={720}
                  value={rangeEnd}
                  onChange={handleRangeEndChange}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          )}
        </div>

        {/* Time Labels */}
        <div className="flex justify-between text-xs text-gray-400 px-4">
          {mode === 'single' ? (
            <>
              <span>{formatTime(0)}</span>
              <span className="font-medium text-purple-400">
                Current: {formatTime(currentValue)}
              </span>
              <span>{formatTime(720)}</span>
            </>
          ) : (
            <>
              <span>{formatTime(0)}</span>
              <span className="font-medium text-purple-400">
                Range: {formatTime(rangeStart)} - {formatTime(rangeEnd)}
              </span>
              <span>{formatTime(720)}</span>
            </>
          )}
        </div>

        {/* Day Markers */}
        <div className="relative px-4">
          <div className="flex justify-between">
            {generateTicks().map((tick, index) => (
              <div key={tick} className="flex flex-col items-center">
                <div className="w-px h-2 bg-gray-600"></div>
                {index % 3 === 0 && (
                  <span className="text-xs text-gray-500 mt-1">
                    {hoursToTime(tick).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimelineSlider
