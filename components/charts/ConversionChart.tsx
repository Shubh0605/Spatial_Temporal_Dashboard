'use client'

import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const ConversionChart = () => {
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
            return value
          }
        },
        max: 100,
      },
    },
    elements: {
      bar: {
        borderRadius: 4,
      },
    },
  }

  const labels = ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29']

  const data = {
    labels,
    datasets: [
      {
        label: 'Bounce Rate',
        data: [5, 5, 5, 5, 5],
        backgroundColor: '#10B981',
        borderRadius: 4,
        barThickness: 20,
      },
      {
        label: 'Conversion Rate',
        data: [45, 44, 46, 47, 52],
        backgroundColor: '#EF4444',
        borderRadius: 4,
        barThickness: 20,
      },
    ],
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Conversion & Bounce Rates</h3>
      <div className="h-64">
        <Bar options={options} data={data} />
      </div>
    </div>
  )
}

export default ConversionChart
