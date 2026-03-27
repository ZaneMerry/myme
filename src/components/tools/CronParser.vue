<script setup>
import { ref, computed } from 'vue'
import { DocumentCopy } from '@element-plus/icons-vue'
import ToolCard from './ToolCard.vue'

const cronInput = ref('0 * * * *')
const parsed = ref(null)
const error = ref('')
const copied = ref(false)

const presets = [
  { label: '每5分钟', value: '*/5 * * * *' },
  { label: '每小时', value: '0 * * * *' },
  { label: '每天午夜', value: '0 0 * * *' },
  { label: '每周一', value: '0 0 * * 1' },
  { label: '每月1号', value: '0 0 1 * *' },
  { label: '每10分钟', value: '*/10 * * * *' },
]

const nextRuns = computed(() => {
  if (!parsed.value) return []

  const runs = []
  const now = new Date()
  const maxDate = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  let current = new Date(now)

  current.setSeconds(0, 0)
  current.setMinutes(current.getMinutes() + 1)

  let count = 0
  while (current <= maxDate && count < 5) {
    if (shouldRun(current)) {
      runs.push(new Date(current))
      count++
    }
    current.setMinutes(current.getMinutes() + 1)
  }
  return runs
})

function shouldRun(date) {
  if (!cronInput.value) return false
  const parts = cronInput.value.trim().split(/\s+/)
  if (parts.length < 5) return false

  const [minute, hour, day, month, weekday] = parts

  const minMatch = matchField(minute, date.getMinutes(), 0, 59)
  const hourMatch = matchField(hour, date.getHours(), 0, 23)
  const dayMatch = matchField(day, date.getDate(), 1, 31)
  const monthMatch = matchField(month, date.getMonth() + 1, 1, 12)
  const weekdayMatch = matchField(weekday, date.getDay(), 0, 6)

  return minMatch && hourMatch && dayMatch && monthMatch && weekdayMatch
}

function matchField(field, value, min, max) {
  if (field === '*') return true

  const result = new Set()
  const parts = field.split(',')

  for (const part of parts) {
    if (part.includes('/')) {
      const [range, step] = part.split('/')
      const stepNum = parseInt(step)
      if (range === '*') {
        for (let i = min; i <= max; i += stepNum) result.add(i)
      } else {
        const [start, end] = range.split('-').map(Number)
        for (let i = start; i <= end; i += stepNum) result.add(i)
      }
    } else if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number)
      for (let i = start; i <= end; i++) result.add(i)
    } else {
      result.add(parseInt(part))
    }
  }
  return result.has(value)
}

function parseCron() {
  error.value = ''
  parsed.value = null

  if (!cronInput.value.trim()) {
    error.value = '请输入 Cron 表达式'
    return
  }

  const parts = cronInput.value.trim().split(/\s+/)
  if (parts.length < 5) {
    error.value = '需要 5 个字段: 分 时 日 月 周'
    return
  }

  parsed.value = {
    minute: parts[0],
    hour: parts[1],
    day: parts[2],
    month: parts[3],
    weekday: parts[4],
  }
}

function formatDate(date) {
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

async function copyNextRuns() {
  const text = nextRuns.value.map(formatDate).join('\n')
  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

parseCron()
</script>

<template>
  <ToolCard title="Cron 解析器" description="标准 5 字段 Cron 表达式 (分 时 日 月 周)">
    <div class="tool-section">
      <div class="section-header">
        <span class="label">Cron 表达式</span>
      </div>
      <div class="cron-input-row">
        <el-input
          v-model="cronInput"
          placeholder="* * * * *"
          class="cron-input"
          @input="parseCron"
        />
      </div>

      <div class="presets">
        <span class="presets-label">快速选择:</span>
        <button
          v-for="preset in presets"
          :key="preset.value"
          class="preset-btn"
          @click="cronInput = preset.value; parseCron()"
        >
          {{ preset.label }}
        </button>
      </div>

      <p v-if="error" class="error-msg">{{ error }}</p>
    </div>

    <div v-if="parsed" class="parsed-result">
      <div class="field-grid">
        <div class="field-item">
          <span class="field-label">分</span>
          <span class="field-value">{{ parsed.minute }}</span>
        </div>
        <div class="field-item">
          <span class="field-label">时</span>
          <span class="field-value">{{ parsed.hour }}</span>
        </div>
        <div class="field-item">
          <span class="field-label">日</span>
          <span class="field-value">{{ parsed.day }}</span>
        </div>
        <div class="field-item">
          <span class="field-label">月</span>
          <span class="field-value">{{ parsed.month }}</span>
        </div>
        <div class="field-item">
          <span class="field-label">周</span>
          <span class="field-value">{{ parsed.weekday }}</span>
        </div>
      </div>

      <div class="next-runs">
        <div class="next-header">
          <span class="next-label">未来执行时间</span>
          <el-button size="small" :icon="DocumentCopy" @click="copyNextRuns" :disabled="nextRuns.length === 0">复制</el-button>
        </div>
        <div v-if="nextRuns.length > 0" class="runs-list">
          <span v-for="(run, index) in nextRuns" :key="index" class="run-item">
            {{ index + 1 }}. {{ formatDate(run) }}
          </span>
        </div>
        <p v-else class="no-runs">24小时内无匹配执行时间</p>
      </div>
    </div>
  </ToolCard>
</template>

<style scoped>
.tool-section {
  margin-bottom: var(--space-3);
}

.section-header {
  margin-bottom: var(--space-2);
}

.label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.cron-input-row {
  margin-bottom: var(--space-2);
}

.cron-input {
  width: 100%;
}

.presets {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.presets-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.preset-btn {
  padding: 6px 12px;
  border: 1px solid var(--border-default);
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: inherit;
}

.preset-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.error-msg {
  color: var(--error);
  font-size: 13px;
  margin-top: var(--space-1);
}

.parsed-result {
  animation: fadeIn 0.3s ease;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-bottom: var(--space-3);
}

.field-item {
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-2);
  text-align: center;
}

.field-label {
  display: block;
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field-value {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 15px;
  color: var(--accent);
  font-weight: 600;
}

.next-runs {
  background: var(--accent-soft);
  border: 1px solid var(--accent);
  border-radius: var(--radius-md);
  padding: var(--space-2);
}

.next-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.next-label {
  font-size: 13px;
  color: var(--accent);
  font-weight: 600;
}

.runs-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.run-item {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  color: var(--text-primary);
}

.no-runs {
  font-size: 13px;
  color: var(--text-secondary);
  text-align: center;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  .field-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
