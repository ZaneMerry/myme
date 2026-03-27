<script setup>
import { useGithub } from '../composables/useGithub'
import { useI18n } from '../composables/useI18n'

const props = defineProps({
  username: {
    type: String,
    default: 'xiao-zhou-study',
  },
  isProd: {
    type: Boolean,
    default: false,
  },
  githubUrl: {
    type: String,
    default: 'https://github.com/xiao-zhou-study',
  },
})

const { githubActivities, githubLoading, githubError, githubHint, loadGithubActivities } = useGithub()
const { t, lang } = useI18n()

loadGithubActivities({ username: props.username, isProd: props.isProd })
</script>

<template>
  <section class="card interactive-card">
    <h2>{{ t('activitiesTitle', lang) }}</h2>
    <p class="meta">
      主页：<a :href="githubUrl" target="_blank" rel="noreferrer">{{ githubUrl }}</a>
    </p>
    <p v-if="githubLoading" class="meta">{{ t('activitiesLoading', lang) }}</p>
    <p v-else-if="githubError" class="meta status-error">{{ t(githubError, lang) }}</p>
    <p v-else-if="githubHint" class="meta">{{ githubHint }}</p>
    <ul class="timeline">
      <li v-for="activity in githubActivities" :key="activity.date + activity.repo + activity.action">
        <span class="date">{{ activity.date }}</span>
        <p>{{ activity.action }} · <strong>{{ activity.repo }}</strong></p>
      </li>
    </ul>
    <p v-if="!githubLoading && githubActivities.length === 0" class="meta">{{ t('activitiesEmpty', lang) }}</p>
    <p class="footnote">
      {{ t('activitiesFootnote', lang) }}
    </p>
  </section>
</template>
