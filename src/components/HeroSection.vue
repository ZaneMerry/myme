<script setup>
import { computed } from 'vue'
import { Message, Download } from '@element-plus/icons-vue'
import { useI18n } from '../composables/useI18n'

const props = defineProps({
  profile: {
    type: Object,
    required: true,
  },
  isProd: {
    type: Boolean,
    default: false,
  },
  envLabel: {
    type: String,
    default: 'PROD 环境',
  },
})

const { t, lang } = useI18n()

const profileTags = computed(() => props.profile.tags)

function openExternal(url) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

function openEmail(email) {
  window.location.href = `mailto:${email}`
}
</script>

<template>
  <header id="about" class="hero card hero-glow interactive-card">
    <div class="hero-top">
      <h1 class="hero-name">{{ profile.name }}</h1>
      <span :class="['env', isProd ? 'prod' : 'dev']">{{ envLabel }}</span>
    </div>
    <p class="role">{{ t('role', lang) }}</p>
    <p class="slogan">{{ t('slogan', lang) }}</p>
    <p class="intro">{{ t('intro', lang) }}</p>
    <ul class="tags">
      <li v-for="tag in profileTags" :key="tag">{{ tag }}</li>
    </ul>
    <div class="links">
      <el-button class="action-btn primary" type="primary" @click="openExternal(profile.github)">
        <span class="github-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M12 1.5A10.5 10.5 0 0 0 8.68 22c.53.1.72-.22.72-.5v-1.74c-2.95.64-3.57-1.25-3.57-1.25-.49-1.23-1.18-1.56-1.18-1.56-.97-.66.08-.65.08-.65 1.07.08 1.64 1.1 1.64 1.1.95 1.63 2.5 1.16 3.1.88.1-.69.37-1.16.66-1.43-2.35-.27-4.82-1.18-4.82-5.25 0-1.16.42-2.1 1.1-2.84-.11-.27-.48-1.36.1-2.84 0 0 .9-.29 2.94 1.08a10.18 10.18 0 0 1 5.35 0c2.05-1.37 2.94-1.08 2.94-1.08.58 1.48.21 2.57.1 2.84.68.74 1.1 1.68 1.1 2.84 0 4.08-2.48 4.98-4.84 5.25.38.33.72.97.72 1.95v2.9c0 .28.2.61.72.5A10.5 10.5 0 0 0 12 1.5Z" />
          </svg>
        </span>
        {{ t('githubHome', lang) }}
      </el-button>
      <el-button class="action-btn ghost" @click="openEmail(profile.email)">
        <el-icon><Message /></el-icon>
        {{ t('contactEmail', lang) }}
      </el-button>
      <el-button class="action-btn ghost" @click="openExternal('#')">
        <el-icon><Download /></el-icon>
        {{ t('downloadResume', lang) }}
      </el-button>
    </div>
    <div class="stats">
      <p><strong>2+</strong> {{ t('stat1', lang) }}</p>
      <p><strong>100+</strong> {{ t('stat2', lang) }}</p>
      <p><strong>持续</strong> {{ t('stat3', lang) }}</p>
    </div>
  </header>
</template>
