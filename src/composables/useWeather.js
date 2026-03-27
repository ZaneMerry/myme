import { ref } from 'vue'
import { getCurrentWeather } from '../services/weatherAdapter'

export function useWeather() {
  const weatherLoading = ref(false)
  const weatherError = ref('')
  const weatherHint = ref('')
  const weatherData = ref({
    city: '',
    temperature: '--',
    humidity: '--',
    windSpeed: '--',
    description: '--',
  })

  async function loadWeather({ cityName, isProd }) {
    weatherLoading.value = true
    weatherError.value = ''
    weatherHint.value = ''

    try {
      const result = await getCurrentWeather({ cityName, isProd })
      weatherData.value = result.weather
      weatherHint.value = result.message
    } catch (error) {
      weatherError.value = 'weatherFail'
      weatherData.value = {
        city: cityName,
        temperature: 22,
        humidity: 56,
        windSpeed: 3.4,
        description: '多云',
      }
      if (import.meta.env.DEV) {
        console.error(error)
      }
    } finally {
      weatherLoading.value = false
    }
  }

  return {
    weatherLoading,
    weatherError,
    weatherHint,
    weatherData,
    loadWeather,
  }
}
