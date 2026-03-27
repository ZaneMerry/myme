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
  <div class="page-container">
    <header class="page-header">
      <h1>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
        学习笔记
      </h1>
      <p>持续沉淀技术笔记与面经复盘</p>
    </header>

    <div class="notes-grid">
      <article v-for="note in notes" :key="note.title" class="note-card">
        <div class="note-meta">
          <span class="note-category">{{ note.category }}</span>
          <span class="note-date">{{ note.date }}</span>
        </div>
        <h3>{{ note.title }}</h3>
        <p>{{ note.summary }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  width: min(1000px, 95vw);
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
  color: var(--accent);
}

.page-header p {
  color: var(--text-secondary);
  font-size: 15px;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-2);
}

.note-card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  transition: all var(--transition-normal);
}

.note-card:hover {
  border-color: var(--accent);
  background: var(--bg-card-hover);
  transform: translateY(-2px);
}

.note-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.note-category {
  background: var(--accent-soft);
  color: var(--accent);
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
}

.note-date {
  color: var(--text-muted);
  font-size: 12px;
}

.note-card h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: var(--space-1);
  color: var(--text-primary);
}

.note-card p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}
</style>
