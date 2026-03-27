<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '../composables/useI18n'

const props = defineProps({
  username: {
    type: String,
    default: 'xiao-zhou-study',
  },
  themeMode: {
    type: String,
    default: 'system',
  },
})

const { t, lang } = useI18n()
const contributionChartError = ref(false)

const contributionChartUrl = computed(() => {
  const isDark = props.themeMode === 'dark' ||
    (props.themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  const color = isDark ? '2563eb' : '1d4ed8'
  return `https://ghchart.rshah.org/${color}/${props.username}`
})

function handleContributionChartError() {
  contributionChartError.value = true
}
</script>

<template>
  <section id="github" class="card interactive-card">
    <h2>{{ t('contributionTitle', lang) }}</h2>
    <p class="meta">
      来源：<a href="https://ghchart.rshah.org/" target="_blank" rel="noreferrer">ghchart.rshah.org</a>
      · 用户：{{ username }}
    </p>
    <div v-if="!contributionChartError" class="contribution-chart-wrap">
      <img
        class="contribution-chart"
        :src="contributionChartUrl"
        :alt="`${username} 的 GitHub 贡献图`"
        loading="lazy"
        @error="handleContributionChartError"
      />
    </div>
    <p v-else class="meta status-error">
      {{ t('contributionFail', lang) }}
    </p>
    <p class="footnote">
      {{ t('contributionFootnote', lang) }}
    </p>
  </section>
</template>
