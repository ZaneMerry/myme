<script setup>
import { Monitor } from '@element-plus/icons-vue'
import { useTheme } from '../composables/useTheme'

const { themeMode, updateThemeMode } = useTheme()
</script>

<template>
  <header class="nav">
    <div class="nav-inner">
      <router-link to="/" class="nav-logo">
        <span class="logo-text">小粥</span>
        <span class="logo-dot"></span>
      </router-link>

      <nav class="nav-links">
        <router-link to="/tools" class="nav-link">工具集</router-link>
        <router-link to="/notes" class="nav-link">笔记</router-link>
        <router-link to="/projects" class="nav-link">项目</router-link>
        <router-link to="/github" class="nav-link">GitHub</router-link>
      </nav>

      <div class="nav-actions">
        <el-select :model-value="themeMode" size="default" @change="updateThemeMode">
          <template #prefix>
            <el-icon><Monitor /></el-icon>
          </template>
          <el-option value="system" label="系统" />
          <el-option value="light" label="亮色" />
          <el-option value="dark" label="暗色" />
        </el-select>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10, 10, 15, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-default);
}

[data-theme="light"] .nav {
  background: rgba(248, 250, 252, 0.85);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.logo-dot {
  width: 8px;
  height: 8px;
  background: var(--accent);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.nav-link {
  padding: 8px 16px;
  font-size: var(--font-sm);
  font-weight: 500;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--bg-card);
}

.nav-link.router-link-active {
  color: var(--accent);
  background: var(--accent-soft);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

@media (max-width: 768px) {
  .nav-inner {
    padding: 0 var(--space-2);
  }

  .nav-links {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(10, 10, 15, 0.95);
    backdrop-filter: blur(20px);
    border-top: 1px solid var(--border-default);
    padding: var(--space-2) var(--space-2) calc(var(--space-2) + 70px);
    justify-content: space-around;
    z-index: 99;
  }

  [data-theme="light"] .nav-links {
    background: rgba(248, 250, 252, 0.95);
  }

  .nav-link {
    padding: 10px 12px;
    font-size: 12px;
  }
}
</style>
