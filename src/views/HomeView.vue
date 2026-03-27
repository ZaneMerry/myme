<script setup>
import { Message } from '@element-plus/icons-vue'

const isProd = import.meta.env.PROD

const profile = {
  name: '小粥',
  role: 'Java 后端开发 / 应届求职',
  slogan: '用工程化思维把业务需求落成稳定可维护的服务',
  intro: '这里会持续分享学习经验、后端技术笔记、面经复盘和项目实践，重点记录 Java 后端开发中的设计与踩坑。',
  tags: ['Java', 'Spring Boot', 'MySQL', 'Redis', '微服务', '消息队列'],
  github: 'https://github.com/xiao-zhou-study',
  email: '19588587964@163.com',
}

function openExternal(url) {
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-badge">
        <span :class="['env', isProd ? 'prod' : 'dev']">{{ isProd ? 'PROD' : 'DEV' }}</span>
      </div>

      <h1 class="hero-name">{{ profile.name }}</h1>
      <p class="hero-role">{{ profile.role }}</p>
      <p class="hero-slogan">{{ profile.slogan }}</p>

      <div class="tags">
        <span v-for="tag in profile.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>

      <p class="hero-intro">{{ profile.intro }}</p>

      <div class="hero-actions">
        <el-button type="primary" size="large" @click="openExternal(profile.github)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 6px;">
            <path d="M12 1.5A10.5 10.5 0 0 0 8.68 22c.53.1.72-.22.72-.5v-1.74c-2.95.64-3.57-1.25-3.57-1.25-.49-1.23-1.18-1.56-1.18-1.56-.97-.66.08-.65.08-.65 1.07.08 1.64 1.1 1.64 1.1.95 1.63 2.5 1.16 3.1.88.1-.69.37-1.16.66-1.43-2.35-.27-4.82-1.18-4.82-5.25 0-1.16.42-2.1 1.1-2.84-.11-.27-.48-1.36.1-2.84 0 0 .9-.29 2.94 1.08a10.18 10.18 0 0 1 5.35 0c2.05-1.37 2.94-1.08 2.94-1.08.58 1.48.21 2.57.1 2.84.68.74 1.1 1.68 1.1 2.84 0 4.08-2.48 4.98-4.84 5.25.38.33.72.97.72 1.95v2.9c0 .28.2.61.72.5A10.5 10.5 0 0 0 12 1.5Z"/>
          </svg>
          GitHub 主页
        </el-button>
        <el-button size="large" @click="openExternal('mailto:' + profile.email)">
          <el-icon style="margin-right: 6px;"><Message /></el-icon>
          {{ profile.email }}
        </el-button>
      </div>
    </section>

    <nav class="quick-nav">
      <router-link to="/tools" class="quick-card">
        <div class="quick-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
        </div>
        <div class="quick-content">
          <h3>开发工具集</h3>
          <p>JSON、时间戳、Base64 等</p>
        </div>
        <svg class="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </router-link>

      <router-link to="/notes" class="quick-card">
        <div class="quick-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </div>
        <div class="quick-content">
          <h3>学习笔记</h3>
          <p>技术笔记、面经复盘</p>
        </div>
        <svg class="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </router-link>

      <router-link to="/projects" class="quick-card">
        <div class="quick-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div class="quick-content">
          <h3>项目展示</h3>
          <p>后端实战项目</p>
        </div>
        <svg class="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
.home {
  width: min(720px, 95vw);
  margin: 0 auto;
  padding: var(--space-4) 0;
}

.hero {
  text-align: center;
  padding: var(--space-5) 0;
}

.hero-badge {
  margin-bottom: var(--space-3);
}

.env {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.env.prod {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.env.dev {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.hero-name {
  font-size: clamp(40px, 8vw, 64px);
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: var(--space-1);
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-role {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
}

.hero-slogan {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: var(--space-3);
}

.tag {
  padding: 6px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-size: 13px;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.tag:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.hero-intro {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.8;
  max-width: 560px;
  margin: 0 auto var(--space-4);
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.quick-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.quick-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all var(--transition-normal);
}

.quick-card:hover {
  border-color: var(--accent);
  background: var(--bg-card-hover);
  transform: translateX(8px);
}

.quick-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated);
  border-radius: var(--radius-md);
  color: var(--accent);
  flex-shrink: 0;
}

.quick-content {
  flex: 1;
}

.quick-content h3 {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.quick-content p {
  font-size: 14px;
  color: var(--text-secondary);
}

.arrow {
  color: var(--text-muted);
  transition: all var(--transition-fast);
}

.quick-card:hover .arrow {
  color: var(--accent);
  transform: translateX(4px);
}

@media (max-width: 640px) {
  .home {
    padding: var(--space-3) 0;
  }

  .hero {
    padding: var(--space-3) 0;
  }

  .quick-card {
    padding: var(--space-2);
  }

  .quick-icon {
    width: 48px;
    height: 48px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero-actions .el-button {
    width: 100%;
  }
}
</style>
