<script setup>
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'

const { lang } = useI18n()

const notes = computed(() => {
  if (lang.value === 'en') {
    return [
      {
        title: 'Java Backend Roadmap (Campus to Hiring)',
        summary: 'A practical path covering Java, JVM, concurrency, DB, cache and distributed systems.',
        category: 'Learning',
        date: '2026-03-18',
      },
      {
        title: 'Spring Boot Notes: API, Transaction, Exception',
        summary: 'Practical layering patterns and unified exception response strategy.',
        category: 'Tech Notes',
        date: '2026-03-21',
      },
      {
        title: 'Interview Reflection: Deep-Dive Project Answers',
        summary: 'High-frequency topics: DB tuning, cache consistency and reliability.',
        category: 'Interview',
        date: '2026-03-24',
      },
    ]
  }
  return [
    {
      title: 'Java 后端学习路线（大四到校招）',
      summary: '围绕 Java 基础、JVM、并发、数据库、缓存与分布式搭建学习主线。',
      category: '学习经验',
      date: '2026-03-18',
    },
    {
      title: 'Spring Boot 实战笔记：接口、事务与异常治理',
      summary: '整理 Controller-Service-DAO 分层实践和统一异常返回规范。',
      category: '技术笔记',
      date: '2026-03-21',
    },
    {
      title: '后端面经复盘：项目深挖与场景题回答模板',
      summary: '总结高频问题：数据库优化、缓存一致性、系统稳定性保障。',
      category: '面经',
      date: '2026-03-24',
    },
  ]
})
</script>

<template>
  <article class="card interactive-card">
    <h2>{{ lang === 'zh' ? '学习经验 & 笔记' : 'Learning & Notes' }}</h2>
    <ul class="list">
      <li v-for="item in notes" :key="item.title">
        <p class="title">{{ item.title }}</p>
        <p class="meta">{{ item.category }} · {{ item.date }}</p>
        <p class="desc">{{ item.summary }}</p>
      </li>
    </ul>
  </article>
</template>
