<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGithub } from '../composables/useGithub'
import { useTheme } from '../composables/useTheme'

const githubUsername = import.meta.env.VITE_GITHUB_USERNAME || 'xiao-zhou-study'
const profile = {
  github: 'https://github.com/xiao-zhou-study',
}

const isProd = import.meta.env.PROD
const { githubActivities, githubLoading, githubError, githubHint, loadGithubActivities } = useGithub()
const { themeMode } = useTheme()

const contributionChartError = ref(false)

const contributionChartUrl = computed(() => {
  const isDark = themeMode.value === 'dark' ||
    (themeMode.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  const color = isDark ? '2563eb' : '1d4ed8'
  return `https://ghchart.rshah.org/${color}/${githubUsername}`
})

function handleContributionChartError() {
  contributionChartError.value = true
}

function openExternal(url) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

function formatDate(date) {
  return date
}

onMounted(() => {
  loadGithubActivities({ username: githubUsername, isProd })
})
</script>

<template>
  <div class="page-container">
    <header class="page-header">
      <h1>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1.5A10.5 10.5 0 0 0 8.68 22c.53.1.72-.22.72-.5v-1.74c-2.95.64-3.57-1.25-3.57-1.25-.49-1.23-1.18-1.56-1.18-1.56-.97-.66.08-.65.08-.65 1.07.08 1.64 1.1 1.64 1.1.95 1.63 2.5 1.16 3.1.88.1-.69.37-1.16.66-1.43-2.35-.27-4.82-1.18-4.82-5.25 0-1.16.42-2.1 1.1-2.84-.11-.27-.48-1.36.1-2.84 0 0 .9-.29 2.94 1.08a10.18 10.18 0 0 1 5.35 0c2.05-1.37 2.94-1.08 2.94-1.08.58 1.48.21 2.57.1 2.84.68.74 1.1 1.68 1.1 2.84 0 4.08-2.48 4.98-4.84 5.25.38.33.72.97.72 1.95v2.9c0 .28.2.61.72.5A10.5 10.5 0 0 0 12 1.5Z"/>
        </svg>
        GitHub
      </h1>
      <p>贡献图表与最新活动</p>
    </header>

    <section class="github-card">
      <h2>贡献图表</h2>
      <p class="meta">
        来源：<a href="https://ghchart.rshah.org/" target="_blank" rel="noreferrer">ghchart.rshah.org</a>
      </p>
      <div v-if="!contributionChartError" class="contribution-chart-wrap">
        <img
          class="contribution-chart"
          :src="contributionChartUrl"
          :alt="`${githubUsername} 的 GitHub 贡献图`"
          loading="lazy"
          @error="handleContributionChartError"
        />
      </div>
      <p v-else class="error-msg">贡献图加载失败</p>
    </section>

    <section class="github-card">
      <h2>最近活动</h2>
      <p v-if="githubLoading" class="loading">加载中...</p>
      <p v-else-if="githubError" class="error-msg">{{ githubError }}</p>
      <ul v-else class="activity-list">
        <li v-for="activity in githubActivities" :key="activity.date + activity.repo + activity.action">
          <span class="activity-date">{{ activity.date }}</span>
          <p>{{ activity.action }} · <strong>{{ activity.repo }}</strong></p>
        </li>
      </ul>
    </section>

    <div class="github-actions">
      <el-button type="primary" size="large" @click="openExternal(profile.github)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 6px;">
          <path d="M12 1.5A10.5 10.5 0 0 0 8.68 22c.53.1.72-.22.72-.5v-1.74c-2.95.64-3.57-1.25-3.57-1.25-.49-1.23-1.18-1.56-1.18-1.56-.97-.66.08-.65.08-.65 1.07.08 1.64 1.1 1.64 1.1.95 1.63 2.5 1.16 3.1.88.1-.69.37-1.16.66-1.43-2.35-.27-4.82-1.18-4.82-5.25 0-1.16.42-2.1 1.1-2.84-.11-.27-.48-1.36.1-2.84 0 0 .9-.29 2.94 1.08a10.18 10.18 0 0 1 5.35 0c2.05-1.37 2.94-1.08 2.94-1.08.58 1.48.21 2.57.1 2.84.68.74 1.1 1.68 1.1 2.84 0 4.08-2.48 4.98-4.84 5.25.38.33.72.97.72 1.95v2.9c0 .28.2.61.72.5A10.5 10.5 0 0 0 12 1.5Z"/>
        </svg>
        访问 GitHub 主页
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  width: min(900px, 95vw);
  margin: 0 auto;
  padding: var(--space-4) 0;
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-4);
}

.page-header h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: clamp(24px, 4vw, 32px);
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
}

.page-header h1 svg {
  color: var(--text-secondary);
}

.page-header p {
  color: var(--text-secondary);
  font-size: 15px;
}

.github-card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  margin-bottom: var(--space-3);
}

.github-card h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: var(--space-2);
}

.meta {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
}

.meta a {
  color: var(--accent);
}

.contribution-chart-wrap {
  overflow-x: auto;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--space-2);
}

.contribution-chart {
  width: 100%;
  min-width: 720px;
  border-radius: var(--radius-sm);
  display: block;
}

.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-list li {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: var(--space-2);
  padding: 14px 0;
  border-bottom: 1px solid var(--border-default);
}

.activity-list li:last-child {
  border-bottom: none;
}

.activity-date {
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
}

.activity-list p {
  color: var(--text-secondary);
  font-size: 14px;
}

.activity-list strong {
  color: var(--text-primary);
  font-weight: 500;
}

.loading, .error-msg {
  color: var(--text-secondary);
  text-align: center;
  padding: var(--space-3);
  font-size: 14px;
}

.github-actions {
  text-align: center;
}
</style>
