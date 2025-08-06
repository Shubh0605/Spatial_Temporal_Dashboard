export interface WeatherData {
  hourly: {
    time: string[]
    temperature_2m: number[]
  }
}

export class WeatherService {
  private static cache = new Map<string, { data: WeatherData; timestamp: number }>()
  private static readonly CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

  static async fetchWeatherData(
    lat: number, 
    lng: number, 
    startDate: Date, 
    endDate: Date
  ): Promise<WeatherData | null> {
    const cacheKey = `${lat},${lng},${startDate.toISOString()},${endDate.toISOString()}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }

    try {
      const start = startDate.toISOString().split('T')[0]
      const end = endDate.toISOString().split('T')[0]
      
      const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${start}&end_date=${end}&hourly=temperature_2m`
      
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      const data = await response.json()
      
      if (data && data.hourly) {
        this.cache.set(cacheKey, { data, timestamp: Date.now() })
        return data
      }
      
      return null
    } catch (error) {
      console.error('Weather API error:', error)
      // Return mock data on error
      return this.getMockData()
    }
  }

  private static getMockData(): WeatherData {
    const hours = Array.from({ length: 24 }, (_, i) => {
      const date = new Date()
      date.setHours(i, 0, 0, 0)
      return date.toISOString()
    })
    
    const temperatures = Array.from({ length: 24 }, () => 
      Math.random() * 30 + 5 // Random temp between 5-35°C
    )

    return {
      hourly: {
        time: hours,
        temperature_2m: temperatures
      }
    }
  }
}
