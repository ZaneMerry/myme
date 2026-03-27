<script setup>
import { useI18n } from '../composables/useI18n'

defineProps({
  projects: {
    type: Array,
    default: () => [],
  },
  isProd: {
    type: Boolean,
    default: false,
  },
})

const { t, lang } = useI18n()

function openExternal(url) {
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <article class="card interactive-card">
    <h2>{{ t('projectsTitle', lang) }}</h2>
    <ul class="list">
      <li v-for="project in projects" :key="project.name">
        <p class="title">{{ project.name }}</p>
        <p class="desc">{{ project.description }}</p>
        <p class="meta">技术栈：{{ project.stack.join(' / ') }}</p>
        <div class="links">
          <a
            :href="isProd ? project.demo : 'javascript:void(0)'"
            target="_blank"
            rel="noreferrer"
            @click.prevent="openExternal(project.demo)"
          >{{ t('projectDemo', lang) }}</a>
          <a
            :href="isProd ? project.repo : 'javascript:void(0)'"
            target="_blank"
            rel="noreferrer"
            @click.prevent="openExternal(project.repo)"
          >{{ t('projectRepo', lang) }}</a>
        </div>
      </li>
    </ul>
  </article>
</template>
