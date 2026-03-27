<script setup>
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'

const isProd = import.meta.env.PROD
const { t, lang } = useI18n()

const projects = [
  {
    name: '校园二手交易系统后端',
    description: '实现用户、商品、订单与消息通知核心流程，支持权限与审计日志。',
    stack: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
    demo: isProd ? 'https://xiao-zhou-study.github.io' : '#',
    repo: 'https://github.com/xiao-zhou-study',
    status: '进行中',
    statusColor: '#f59e0b',
  },
  {
    name: '面经与笔记管理 API',
    description: '提供笔记发布、标签检索、全文搜索和统计分析接口。',
    stack: ['Java', 'Spring Boot', 'MyBatis', 'Elasticsearch'],
    demo: isProd ? 'https://xiao-zhou-study.github.io' : '#',
    repo: 'https://github.com/xiao-zhou-study',
    status: '进行中',
    statusColor: '#f59e0b',
  },
]

function openExternal(url) {
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="page-container">
    <header class="page-header">
      <h1>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
        项目展示
      </h1>
      <p>后端实战项目与技术实践</p>
    </header>

    <div class="projects-grid">
      <article v-for="project in projects" :key="project.name" class="project-card">
        <div class="project-header">
          <div class="project-info">
            <h3>{{ project.name }}</h3>
            <span class="project-status" :style="{ color: project.statusColor }">{{ project.status }}</span>
          </div>
        </div>
        <p class="project-desc">{{ project.description }}</p>
        <div class="project-stack">
          <span v-for="tech in project.stack" :key="tech" class="tech-tag">{{ tech }}</span>
        </div>
        <div class="project-links">
          <el-button size="small" type="primary" @click="openExternal(project.repo)">GitHub 仓库</el-button>
          <el-button size="small" @click="openExternal(project.demo)">在线演示</el-button>
        </div>
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

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--space-3);
}

.project-card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  transition: all var(--transition-normal);
}

.project-card:hover {
  border-color: var(--accent);
  background: var(--bg-card-hover);
  transform: translateY(-2px);
}

.project-header {
  margin-bottom: var(--space-2);
}

.project-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.project-status {
  font-size: 12px;
  font-weight: 600;
}

.project-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
  line-height: 1.6;
}

.project-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: var(--space-2);
}

.tech-tag {
  background: var(--accent-soft);
  color: var(--accent);
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
}

.project-links {
  display: flex;
  gap: var(--space-2);
}
</style>
