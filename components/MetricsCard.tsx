import React from 'react'

interface MetricCardProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  bgColor
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <div className={color}>
            {icon}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold text-white">{value}</span>
        </div>
        <p className="text-xs text-gray-500">{change}</p>
      </div>
    </div>
  )
}

export default MetricCard
