'use client'

import React, { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'

interface DateRangePickerProps {
  dateRange: {
    startDate: Date
    endDate: Date
  }
  onDateRangeChange: (range: { startDate: Date; endDate: Date }) => void
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  dateRange,
  onDateRangeChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getWeekInfo = () => {
    const weeks = Math.ceil((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
    return `${weeks} weeks`
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const navigatePrevious = () => {
    const diffTime = dateRange.endDate.getTime() - dateRange.startDate.getTime()
    const newEndDate = new Date(dateRange.startDate.getTime() - 1)
    const newStartDate = new Date(newEndDate.getTime() - diffTime)
    
    onDateRangeChange({
      startDate: newStartDate,
      endDate: newEndDate
    })
  }

  const navigateNext = () => {
    const diffTime = dateRange.endDate.getTime() - dateRange.startDate.getTime()
    const newStartDate = new Date(dateRange.endDate.getTime() + 1)
    const newEndDate = new Date(newStartDate.getTime() + diffTime)
    
    onDateRangeChange({
      startDate: newStartDate,
      endDate: newEndDate
    })
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Calendar className="w-5 h-5 text-purple-500" />
          <span className="text-white font-medium">Time Period</span>
          
          <div className="flex items-center space-x-2 text-white">
            <span>{formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}</span>
            <span className="text-gray-400">|</span>
            <span>{formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}</span>
            <span className="bg-gray-700 px-2 py-1 rounded text-sm">{getWeekInfo()}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={navigatePrevious}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={togglePlayPause}
            className={`p-2 rounded transition-colors ${
              isPlaying 
                ? 'text-white bg-purple-600 hover:bg-purple-700' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <button
            onClick={navigateNext}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <span className="text-gray-500 text-sm ml-2">Paused</span>
        </div>
      </div>

      {/* Timeline Slider */}
      <div className="mt-4">
        <div className="relative">
          <div className="w-full h-2 bg-gray-700 rounded-full">
            <div className="h-2 bg-purple-500 rounded-full relative" style={{ width: '25%' }}>
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Dec 30 - Jan 5</span>
            <span className="text-purple-400">Jan 1 - Jan 7 - Jan 29 - Feb 4</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DateRangePicker
