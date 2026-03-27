<script setup>
import { useWeather } from '../composables/useWeather'
import { useI18n } from '../composables/useI18n'

const props = defineProps({
  city: {
    type: String,
    default: 'Hangzhou',
  },
  isProd: {
    type: Boolean,
    default: false,
  },
})

const { weatherLoading, weatherError, weatherHint, weatherData, loadWeather } = useWeather()
const { t, lang } = useI18n()

loadWeather({ cityName: props.city, isProd: props.isProd })
</script>

<template>
  <article class="card weather-card interactive-card">
    <h2>{{ t('currentWeather', lang) }}</h2>
    <p class="title">{{ weatherData.city }} · {{ weatherData.description }}</p>
    <p class="weather-temp">{{ weatherData.temperature }}°C</p>
    <div class="weather-metrics">
      <p class="meta">{{ t('weatherHum', lang) }}：{{ weatherData.humidity }}%</p>
      <p class="meta">{{ t('weatherWind', lang) }}：{{ weatherData.windSpeed }} km/h</p>
    </div>
    <p v-if="weatherLoading" class="meta">{{ t('weatherLoading', lang) }}</p>
    <p v-else-if="weatherError" class="meta status-error">{{ t(weatherError, lang) }}</p>
    <p v-else-if="weatherHint" class="meta">{{ weatherHint }}</p>
  </article>
</template>
