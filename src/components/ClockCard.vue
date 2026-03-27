<script setup>
import { useClock } from '../composables/useClock'
import { useI18n } from '../composables/useI18n'

const { currentTime, hourDeg, minuteDeg, secondDeg } = useClock()
const { t, lang } = useI18n()
</script>

<template>
  <article class="card clock-card interactive-card">
    <h2>{{ t('currentTime', lang) }}</h2>
    <div class="clock" role="img" :aria-label="t('beijingTime', lang)">
      <span class="clock-dot"></span>
      <span class="clock-hand hour" :style="{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }"></span>
      <span class="clock-hand minute" :style="{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }"></span>
      <span class="clock-hand second" :style="{ transform: `translateX(-50%) rotate(${secondDeg}deg)` }"></span>
      <span class="mark m12">12</span>
      <span class="mark m3">3</span>
      <span class="mark m6">6</span>
      <span class="mark m9">9</span>
    </div>
    <p class="meta">{{ t('beijingTime', lang) }}</p>
    <p class="clock-digital">{{ currentTime }}</p>
  </article>
</template>
