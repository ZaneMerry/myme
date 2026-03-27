<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import JsonFormatter from './JsonFormatter.vue'
import TimestampConv from './TimestampConv.vue'
import Base64Codec from './Base64Codec.vue'
import UrlCodec from './UrlCodec.vue'
import UuidGen from './UuidGen.vue'
import HashGen from './HashGen.vue'
import CronParser from './CronParser.vue'
import JwtDecoder from './JwtDecoder.vue'
import SqlFormatter from './SqlFormatter.vue'
import ColorConv from './ColorConv.vue'
import HtmlCodec from './HtmlCodec.vue'
import UnicodeConv from './UnicodeConv.vue'

const searchQuery = ref('')
const activeTab = ref('json')

const allTools = [
  { id: 'json', name: 'JSON', desc: '格式化/压缩/验证', component: JsonFormatter, color: '#f59e0b', category: '数据' },
  { id: 'timestamp', name: '时间戳', desc: 'Unix 与北京时间互转', component: TimestampConv, color: '#6366f1', category: '转换' },
  { id: 'base64', name: 'Base64', desc: '编解码', component: Base64Codec, color: '#10b981', category: '编码' },
  { id: 'url', name: 'URL', desc: '编码/解码', component: UrlCodec, color: '#3b82f6', category: '编码' },
  { id: 'html', name: 'HTML', desc: '实体编解码', component: HtmlCodec, color: '#22c55e', category: '编码' },
  { id: 'unicode', name: 'Unicode', desc: '中文与 Unicode 互转', component: UnicodeConv, color: '#a855f7', category: '编码' },
  { id: 'uuid', name: 'UUID', desc: '生成 v4', component: UuidGen, color: '#8b5cf6', category: '生成' },
  { id: 'hash', name: 'Hash', desc: 'SHA-256/SHA-1', component: HashGen, color: '#ef4444', category: '加密' },
  { id: 'cron', name: 'Cron', desc: '表达式解析', component: CronParser, color: '#14b8a6', category: '转换' },
  { id: 'jwt', name: 'JWT', desc: '解码查看', component: JwtDecoder, color: '#f97316', category: '解码' },
  { id: 'sql', name: 'SQL', desc: '格式化', component: SqlFormatter, color: '#ec4899', category: '数据' },
  { id: 'color', name: '颜色', desc: 'HEX/RGB/HSL', component: ColorConv, color: '#06b6d4', category: '转换' },
]

const filteredTools = computed(() => {
  if (!searchQuery.value.trim()) return allTools
  const query = searchQuery.value.toLowerCase()
  return allTools.filter(t =>
    t.name.toLowerCase().includes(query) ||
    t.desc.toLowerCase().includes(query) ||
    t.category.toLowerCase().includes(query)
  )
})

const activeTool = computed(() => allTools.find(t => t.id === activeTab.value))

const activeComponent = computed(() => activeTool.value?.component || JsonFormatter)
const activeColor = computed(() => activeTool.value?.color || '#6366f1')

function switchTool(tool) {
  activeTab.value = tool.id
}

function handleKeydown(e) {
  const currentIndex = allTools.findIndex(t => t.id === activeTab.value)
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    const nextIndex = (currentIndex + 1) % allTools.length
    activeTab.value = allTools[nextIndex].id
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    const prevIndex = (currentIndex - 1 + allTools.length) % allTools.length
    activeTab.value = allTools[prevIndex].id
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="tool-container">
    <header class="tool-header">
      <h1>
        <svg class="header-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
        开发工具集
      </h1>
      <p class="tool-subtitle">实用的开发者工具集合 · 按 ← → 键切换工具</p>
    </header>

    <div class="search-box">
      <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

    <nav class="tool-tabs">
      <button
        v-for="tool in filteredTools"
        :key="tool.id"
        :class="['tab-btn', { active: activeTab === tool.id }]"
        :style="{ '--tab-color': tool.color }"
        @click="switchTool(tool)"
        :title="tool.desc"
      >
        <span class="tab-dot"></span>
        {{ tool.name }}
      </button>
    </nav>

    <div v-if="filteredTools.length === 0" class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
      <p>未找到匹配的工具</p>
    </div>

    <Transition name="slide-fade" mode="out-in">
      <div
        v-if="filteredTools.length > 0"
        :key="activeTab"
        class="tool-content"
        :style="{ '--accent-color': activeColor }"
      >
        <component :is="activeComponent" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tool-container {
  width: min(1100px, 95vw);
  margin: 0 auto;
}

.tool-header {
  text-align: center;
  margin-bottom: var(--space-3);
}

.tool-header h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: clamp(26px, 4vw, 36px);
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.header-icon {
  color: #6366f1;
  -webkit-text-fill-color: initial;
}

.tool-subtitle {
  color: var(--muted);
  font-size: var(--font-sm);
}

.search-box {
  position: relative;
  max-width: 320px;
  margin: 0 auto var(--space-3);
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 42px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 12px;
  color: var(--text);
  font-size: var(--font-sm);
  outline: none;
  transition: all 0.25s ease;
}

.search-input::placeholder {
  color: var(--muted);
}

.search-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.tool-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: var(--space-3);
  padding: 8px;
  background: var(--card);
  border-radius: 16px;
  border: 1px solid var(--line);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.tab-btn .tab-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--tab-color);
  opacity: 0.5;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: var(--text);
  background: var(--hover);
}

.tab-btn.active {
  color: var(--text);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.15);
}

.tab-btn.active .tab-dot {
  opacity: 1;
  box-shadow: 0 0 8px var(--tab-color);
}

.tool-content {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: var(--space-3);
  border-top: 3px solid var(--accent-color);
}

.empty-state {
  text-align: center;
  padding: var(--space-4);
  color: var(--muted);
}

.empty-state svg {
  margin-bottom: var(--space-2);
  opacity: 0.5;
}

.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.15s ease-in;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 768px) {
  .tool-tabs {
    gap: 4px;
    padding: 6px;
  }

  .tab-btn {
    padding: 6px 10px;
    font-size: 12px;
  }

  .tab-btn .tab-dot {
    width: 6px;
    height: 6px;
  }
}
</style>
