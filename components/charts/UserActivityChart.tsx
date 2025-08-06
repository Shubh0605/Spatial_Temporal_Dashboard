'use client'

import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const UserActivityChart = () => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: '#374151',
        },
        ticks: {
          color: '#9CA3AF',
        },
      },
      y: {
        grid: {
          color: '#374151',
        },
        ticks: {
          color: '#9CA3AF',
          callback: function(value: any) {
            return value + '.0K'
          }
        },
        stacked: true,
      },
    },
    elements: {
      line: {
        tension: 0.3,
      },
      point: {
        radius: 0,
        hoverRadius: 4,
      },
    },
    interaction: {
      intersect: false,
    },
  }

  const labels = ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29']

  const data = {
    labels,
    datasets: [
      {
        label: 'Desktop Users',
        data: [95, 105, 110, 115, 120],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 2,
        fill: true,
      },
      {
        label: 'Mobile Users',
        data: [65, 75, 80, 85, 90],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.3)',
        borderWidth: 2,
        fill: true,
      },
    ],
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">User Activity</h3>
      <div className="h-64">
        <Line options={options} data={data} />
      </div>
    </div>
  )
}

export default UserActivityChart
