'use client'

import React from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const TrafficSourcesChart = () => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#9CA3AF',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
    },
    cutout: '60%',
  }

  const data = {
    labels: ['Organic', 'Paid', 'Social'],
    datasets: [
      {
        data: [42, 32, 25],
        backgroundColor: [
          '#10B981', // Green for Organic
          '#F59E0B', // Amber for Paid
          '#EF4444', // Red for Social
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Traffic Sources</h3>
      <div className="h-64 flex items-center justify-center">
        <div className="w-48 h-48">
          <Doughnut options={options} data={data} />
        </div>
      </div>
    </div>
  )
}

export default TrafficSourcesChart
