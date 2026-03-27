<script setup>
import { ref } from 'vue'
import ToolCard from './ToolCard.vue'

const input = ref('')
const output = ref('')
const error = ref('')
const copied = ref(false)

const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'INDEX', 'DROP', 'ALTER', 'ADD', 'DISTINCT', 'AS', 'IN', 'BETWEEN', 'LIKE', 'IS', 'NULL', 'NOT', 'ASC', 'DESC', 'UNION', 'ALL', 'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN']

function formatSql() {
  error.value = ''
  output.value = ''

  if (!input.value.trim()) return

  try {
    let sql = input.value.trim()

    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      sql = sql.replace(regex, `\n${keyword}`)
    })

    sql = sql.replace(/\s+/g, ' ').trim()

    let indent = 0
    const lines = sql.split('\n').map(line => {
      const trimmed = line.trim()
      if (!trimmed) return ''

      if (trimmed.startsWith('WHERE') || trimmed.startsWith('AND') || trimmed.startsWith('OR')) {
        indent = 1
      } else if (trimmed.startsWith('ORDER BY') || trimmed.startsWith('GROUP BY') || trimmed.startsWith('HAVING')) {
        indent = 1
      } else if (trimmed.startsWith('JOIN') || trimmed.startsWith('LEFT') || trimmed.startsWith('RIGHT')) {
        indent = 1
      }

      const formatted = '  '.repeat(Math.max(0, indent)) + trimmed

      if (trimmed.endsWith(',') || trimmed.endsWith('AND') || trimmed.endsWith('OR')) {
        indent = Math.min(indent + 1, 3)
      }

      return formatted
    })

    output.value = lines.filter(l => l.trim()).join('\n')
  } catch (e) {
    error.value = '格式化失败: ' + e.message
  }
}

function compressSql() {
  error.value = ''
  output.value = ''

  if (!input.value.trim()) return

  try {
    output.value = input.value
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s*\(\s*/g, '(')
      .replace(/\s*\)\s*/g, ')')
      .replace(/\s*=\s*/g, ' = ')
      .replace(/\s*!=\s*/g, ' != ')
      .replace(/\s*<\s*/g, ' < ')
      .replace(/\s*>\s*/g, ' > ')
      .trim()
  } catch (e) {
    error.value = '压缩失败: ' + e.message
  }
}

async function copyOutput() {
  if (output.value) {
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1500)
  }
}

function clear() {
  input.value = ''
  output.value = ''
  error.value = ''
}
</script>

<template>
  <ToolCard title="SQL 格式化" description="格式化或压缩 SQL 语句">
    <div class="tool-section">
      <div class="section-header">
        <span class="label">输入 SQL</span>
        <div class="btn-group">
          <button class="small-btn active" @click="formatSql">格式化</button>
          <button class="small-btn" @click="compressSql">压缩</button>
        </div>
      </div>
      <el-input
        v-model="input"
        type="textarea"
        :rows="5"
        placeholder="输入 SQL 语句..."
        class="tool-input"
      />
    </div>

    <div class="tool-section">
      <div class="section-header">
        <span class="label">输出</span>
        <div class="btn-group">
          <el-button size="small" @click="copyOutput" :disabled="!output">
            {{ copied ? '已复制' : '复制' }}
          </el-button>
          <el-button size="small" @click="clear">清空</el-button>
        </div>
      </div>
      <el-input
        v-model="output"
        type="textarea"
        :rows="5"
        readonly
        placeholder="格式化结果..."
        class="tool-input mono"
      />
      <p v-if="error" class="error-msg">{{ error }}</p>
    </div>
  </ToolCard>
</template>

<style scoped>
.tool-section {
  margin-bottom: var(--space-3);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.btn-group {
  display: flex;
  gap: 8px;
}

.small-btn {
  padding: 6px 14px;
  border: 1px solid var(--border-default);
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: inherit;
}

.small-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.small-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}

.tool-input {
  width: 100%;
}

.tool-input.mono :deep(.el-textarea__inner) {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
}

.error-msg {
  color: var(--error);
  font-size: 13px;
  margin-top: var(--space-1);
}
</style>
