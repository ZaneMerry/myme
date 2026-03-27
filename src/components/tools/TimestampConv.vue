<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { DocumentCopy, Refresh } from '@element-plus/icons-vue'
import ToolCard from './ToolCard.vue'

const now = ref(Math.floor(Date.now() / 1000))
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    now.value = Math.floor(Date.now() / 1000)
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const customTs = ref('')
const useCustom = ref(false)
const copied = ref(false)

function getDisplayTs() {
  return useCustom.value ? parseInt(customTs.value) || 0 : now.value
}

function getHumanDate(ts) {
  try {
    return new Date(ts * 1000).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  } catch {
    return '无效时间戳'
  }
}

function getIsoDate(ts) {
  try {
    return new Date(ts * 1000).toISOString()
  } catch {
    return ''
  }
}

function refreshNow() {
  now.value = Math.floor(Date.now() / 1000)
  customTs.value = ''
  useCustom.value = false
}

async function copyValue(text) {
  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => { copied.value = false }, 1500)
}
</script>

<template>
  <ToolCard title="时间戳转换" description="Unix 时间戳与北京时间互转">
    <div class="timestamp-grid">
      <div class="ts-card">
        <span class="ts-label">当前时间戳</span>
        <span class="ts-value">{{ now }}</span>
        <div class="ts-actions">
          <el-button size="small" :icon="Refresh" @click="refreshNow">刷新</el-button>
          <el-button size="small" :icon="DocumentCopy" @click="copyValue(String(now))">复制</el-button>
        </div>
      </div>

      <div class="ts-card">
        <span class="ts-label">自定义时间戳</span>
        <el-input
          v-model="customTs"
          type="number"
          placeholder="输入要转换的时间戳..."
          class="ts-input"
        />
        <div class="ts-toggle">
          <span :class="{ active: !useCustom }" @click="useCustom = false">当前</span>
          <el-switch v-model="useCustom" />
          <span :class="{ active: useCustom }" @click="useCustom = true">自定义</span>
        </div>
      </div>

      <div class="ts-card highlight">
        <span class="ts-label">北京时间</span>
        <span class="ts-value large">{{ getHumanDate(getDisplayTs()) }}</span>
        <div class="ts-actions">
          <el-button size="small" :icon="DocumentCopy" @click="copyValue(getHumanDate(getDisplayTs()))">复制</el-button>
        </div>
      </div>

      <div class="ts-card">
        <span class="ts-label">ISO 8601</span>
        <span class="ts-value mono">{{ getIsoDate(getDisplayTs()) }}</span>
        <div class="ts-actions">
          <el-button size="small" :icon="DocumentCopy" @click="copyValue(getIsoDate(getDisplayTs()))">复制</el-button>
        </div>
      </div>
    </div>
  </ToolCard>
</template>

<style scoped>
.timestamp-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2);
}

.ts-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-2);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.ts-card.highlight {
  border-color: var(--accent);
  background: linear-gradient(135deg, var(--accent-soft), transparent);
}

.ts-label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ts-value {
  font-size: 16px;
  color: var(--text-primary);
  font-weight: 600;
  word-break: break-all;
}

.ts-value.large {
  font-size: 18px;
  background: linear-gradient(135deg, var(--accent), var(--accent-hover));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ts-value.mono {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
}

.ts-actions {
  display: flex;
  gap: 8px;
}

.ts-input {
  width: 100%;
}

.ts-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
}

.ts-toggle span.active {
  color: var(--accent);
  font-weight: 600;
}

@media (max-width: 640px) {
  .timestamp-grid {
    grid-template-columns: 1fr;
  }
}
</style>
