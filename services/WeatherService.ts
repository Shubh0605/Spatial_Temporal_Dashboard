import { Polygon, DataSource } from '../components/Dashboard'

export interface WeatherData {
  hourly: {
    time: string[]
    temperature_2m: number[]
  }
}

export class WeatherService {
  private static readonly BASE_URL = 'https://archive-api.open-meteo.com/v1/archive'
  private cache = new Map<string, WeatherData>()

  private getCacheKey(lat: number, lng: number, startDate: Date, endDate: Date): string {
    const start = startDate.toISOString().split('T')[0]
    const end = endDate.toISOString().split('T')[0]
    return `${lat.toFixed(2)},${lng.toFixed(2)},${start},${end}`
  }

  async fetchWeatherData(lat: number, lng: number, startDate: Date, endDate: Date): Promise<WeatherData | null> {
    const cacheKey = this.getCacheKey(lat, lng, startDate, endDate)
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    try {
      const start = startDate.toISOString().split('T')[0]
      const end = endDate.toISOString().split('T')[0]
      
      const url = `${WeatherService.BASE_URL}?latitude=${lat}&longitude=${lng}&start_date=${start}&end_date=${end}&hourly=temperature_2m`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Cache the result
      this.cache.set(cacheKey, data)
      
      return data
    } catch (error) {
      console.error('Error fetching weather data:', error)
      // Return mock data as fallback
      return this.generateMockData(startDate, endDate)
    }
  }

  private generateMockData(startDate: Date, endDate: Date): WeatherData {
    const hourly: { time: string[]; temperature_2m: number[] } = {
      time: [],
      temperature_2m: []
    }

    const current = new Date(startDate)
    const end = new Date(endDate)

    while (current <= end) {
      hourly.time.push(current.toISOString())
      // Generate realistic temperature data (15-30°C with some variation)
      const baseTemp = 22
      const variation = Math.sin(current.getHours() / 24 * Math.PI * 2) * 8 // Daily cycle
      const randomNoise = (Math.random() - 0.5) * 4
      hourly.temperature_2m.push(baseTemp + variation + randomNoise)
      
      current.setHours(current.getHours() + 1)
    }

    return { hourly }
  }

  calculatePolygonColor(polygon: Polygon, value: number, dataSources: DataSource[]): string {
    const dataSource = dataSources.find(ds => ds.id === polygon.dataSource)
    if (!dataSource) return '#8b5cf6'

    // Sort rules by value in descending order for proper evaluation
    const rules = [...dataSource.colorRules].sort((a, b) => b.value - a.value)
    
    for (const rule of rules) {
      if (this.evaluateRule(value, rule.operator, rule.value)) {
        return rule.color
      }
    }

    return '#8b5cf6' // Default purple color
  }

  private evaluateRule(value: number, operator: string, threshold: number): boolean {
    switch (operator) {
      case '<': return value < threshold
      case '<=': return value <= threshold
      case '=': return Math.abs(value - threshold) < 0.01 // Handle floating point comparison
      case '>=': return value >= threshold
      case '>': return value > threshold
      default: return false
    }
  }

  getValueForTime(weatherData: WeatherData, targetTime: Date): number {
    if (!weatherData.hourly || !weatherData.hourly.time || !weatherData.hourly.temperature_2m) {
      return 20 // Default fallback temperature
    }

    const targetISOString = targetTime.toISOString().substring(0, 13) + ':00:00.000Z'
    
    const index = weatherData.hourly.time.findIndex(time => time.startsWith(targetISOString.substring(0, 13)))
    
    if (index !== -1) {
      return weatherData.hourly.temperature_2m[index]
    }

    // If exact match not found, find closest time
    const targetTimestamp = targetTime.getTime()
    let closestIndex = 0
    let closestDiff = Infinity

    weatherData.hourly.time.forEach((time, i) => {
      const timeStamp = new Date(time).getTime()
      const diff = Math.abs(timeStamp - targetTimestamp)
      if (diff < closestDiff) {
        closestDiff = diff
        closestIndex = i
      }
    })

    return weatherData.hourly.temperature_2m[closestIndex] || 20
  }

  getAverageValueForTimeRange(weatherData: WeatherData, startTime: Date, endTime: Date): number {
    if (!weatherData.hourly || !weatherData.hourly.time || !weatherData.hourly.temperature_2m) {
      return 20 // Default fallback temperature
    }

    const startTimestamp = startTime.getTime()
    const endTimestamp = endTime.getTime()
    
    const relevantValues = weatherData.hourly.time
      .map((time, index) => ({ time: new Date(time).getTime(), value: weatherData.hourly.temperature_2m[index] }))
      .filter(({ time }) => time >= startTimestamp && time <= endTimestamp)
      .map(({ value }) => value)

    if (relevantValues.length === 0) {
      return 20 // Default if no data in range
    }

    return relevantValues.reduce((sum, value) => sum + value, 0) / relevantValues.length
  }
}

export const weatherService = new WeatherService()
