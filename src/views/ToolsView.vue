<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

const tools = [
  { id: 'json', name: 'JSON', desc: '格式化 / 压缩 / 验证', color: '#f59e0b' },
  { id: 'timestamp', name: '时间戳', desc: 'Unix 与北京时间互转', color: '#6366f1' },
  { id: 'base64', name: 'Base64', desc: '编码 / 解码', color: '#10b981' },
  { id: 'url', name: 'URL', desc: '编码 / 解码', color: '#3b82f6' },
  { id: 'html', name: 'HTML', desc: '实体编码 / 解码', color: '#22c55e' },
  { id: 'unicode', name: 'Unicode', desc: '中文与 Unicode 互转', color: '#a855f7' },
  { id: 'uuid', name: 'UUID', desc: '生成 v4 格式', color: '#8b5cf6' },
  { id: 'hash', name: 'Hash', desc: 'SHA-256 / SHA-1 / MD5', color: '#ef4444' },
  { id: 'cron', name: 'Cron', desc: '表达式解析与预览', color: '#14b8a6' },
  { id: 'jwt', name: 'JWT', desc: '解码查看 Payload', color: '#f97316' },
  { id: 'sql', name: 'SQL', desc: '格式化语句', color: '#ec4899' },
  { id: 'color', name: '颜色', desc: 'HEX / RGB / HSL 互转', color: '#06b6d4' },
]

const filteredTools = computed(() => {
  if (!searchQuery.value.trim()) return tools
  const query = searchQuery.value.toLowerCase()
  return tools.filter(t =>
    t.name.toLowerCase().includes(query) ||
    t.desc.toLowerCase().includes(query)
  )
})

function goToTool(toolId) {
  router.push(`/tools/${toolId}`)
}
</script>

<template>
  <div class="tools-page">
    <header class="page-header">
      <h1>开发工具集</h1>
      <p>实用的开发者工具集合</p>
    </header>

    <div class="search-box">
      <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索工具..."
        class="search-input"
      />
    </div>

    <div class="tools-grid">
      <button
        v-for="tool in filteredTools"
        :key="tool.id"
        class="tool-card"
        :style="{ '--tool-color': tool.color }"
        @click="goToTool(tool.id)"
      >
        <div class="tool-icon">{{ tool.name.charAt(0) }}</div>
        <div class="tool-info">
          <h3>{{ tool.name }}</h3>
          <p>{{ tool.desc }}</p>
        </div>
        <svg class="tool-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>
    </div>

    <div v-if="filteredTools.length === 0" class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
      <p>未找到匹配的工具</p>
    </div>
  </div>
</template>

<style scoped>
.tools-page {
  width: min(1000px, 95vw);
  margin: 0 auto;
  padding: var(--space-4) 0;
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-4);
}

.page-header h1 {
  font-size: clamp(28px, 5vw, 40px);
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
}

.page-header p {
  color: var(--text-secondary);
  font-size: 15px;
}

.search-box {
  position: relative;
  max-width: 360px;
  margin: 0 auto var(--space-4);
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 15px;
  outline: none;
  transition: all var(--transition-normal);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-2);
}

.tool-card {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  text-align: left;
  font-family: inherit;
}

.tool-card:hover {
  border-color: var(--tool-color);
  background: var(--bg-card-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.tool-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-elevated);
  border-radius: var(--radius-md);
  font-size: 20px;
  font-weight: 700;
  color: var(--tool-color);
  flex-shrink: 0;
}

.tool-info {
  flex: 1;
  min-width: 0;
}

.tool-info h3 {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.tool-info p {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tool-arrow {
  color: var(--text-muted);
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.tool-card:hover .tool-arrow {
  color: var(--tool-color);
  transform: translateX(4px);
}

.empty-state {
  text-align: center;
  padding: var(--space-5);
  color: var(--text-muted);
}

.empty-state svg {
  margin-bottom: var(--space-2);
  opacity: 0.5;
}

.empty-state p {
  font-size: 15px;
}
</style>
