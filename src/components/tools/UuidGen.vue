<script setup>
import { ref } from 'vue'
import { DocumentCopy, Refresh } from '@element-plus/icons-vue'
import ToolCard from './ToolCard.vue'

const uuid = ref(generateUuid())
const history = ref([])
const copied = ref(false)

function generateUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function regenerate() {
  history.value.unshift(uuid.value)
  if (history.value.length > 5) history.value.pop()
  uuid.value = generateUuid()
}

async function copyUuid() {
  await navigator.clipboard.writeText(uuid.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <ToolCard title="UUID 生成器" description="生成符合 RFC 4122 标准的 UUID v4">
    <div class="uuid-display">
      <span class="uuid-value">{{ uuid }}</span>
      <div class="uuid-actions">
        <el-button type="primary" :icon="Refresh" @click="regenerate">生成新 UUID</el-button>
        <el-button :icon="DocumentCopy" @click="copyUuid">{{ copied ? '已复制' : '复制' }}</el-button>
      </div>
    </div>

    <div v-if="history.length > 0" class="uuid-history">
      <span class="history-label">历史记录</span>
      <div class="history-list">
        <span
          v-for="(item, index) in history"
          :key="index"
          class="history-item"
          @click="uuid = item; navigator.clipboard.writeText(item)"
        >
          {{ item }}
        </span>
      </div>
    </div>

    <div class="uuid-info">
      <div class="info-item">
        <span class="info-label">版本</span>
        <span class="info-value">UUID v4 (随机)</span>
      </div>
      <div class="info-item">
        <span class="info-label">格式</span>
        <span class="info-value">8-4-4-4-12 (36 字符)</span>
      </div>
    </div>
  </ToolCard>
</template>

<style scoped>
.uuid-display {
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  margin-bottom: var(--space-3);
}

.uuid-value {
  display: block;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 20px;
  color: var(--accent);
  margin-bottom: var(--space-2);
  word-break: break-all;
  letter-spacing: 1px;
}

.uuid-actions {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.uuid-history {
  margin-bottom: var(--space-3);
}

.history-label {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: var(--space-1);
  font-weight: 600;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.history-item {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  color: var(--text-secondary);
  padding: 8px 12px;
  background: var(--bg-elevated);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.history-item:hover {
  background: var(--accent-soft);
  color: var(--accent);
}

.uuid-info {
  display: flex;
  gap: var(--space-3);
  padding-top: var(--space-2);
  border-top: 1px solid var(--border-default);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 13px;
  color: var(--text-primary);
  font-weight: 600;
}
</style>
