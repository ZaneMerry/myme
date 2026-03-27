<script setup>
import { ref } from 'vue'
import ToolCard from './ToolCard.vue'

const input = ref('')
const output = ref('')
const error = ref('')
const copied = ref(false)
const formatType = ref('format')

function process() {
  if (!input.value.trim()) {
    output.value = ''
    error.value = ''
    return
  }

  try {
    const parsed = JSON.parse(input.value)
    if (formatType.value === 'format') {
      output.value = JSON.stringify(parsed, null, 2)
    } else {
      output.value = JSON.stringify(parsed)
    }
    error.value = ''
  } catch (e) {
    error.value = `JSON 解析错误: ${e.message}`
    output.value = ''
  }
}

function validate() {
  if (!input.value.trim()) {
    error.value = ''
    return
  }

  try {
    JSON.parse(input.value)
    error.value = ''
  } catch (e) {
    error.value = `无效 JSON: ${e.message}`
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
  <ToolCard title="JSON 格式化" description="格式化、压缩、验证 JSON 数据">
    <div class="tool-section">
      <div class="section-header">
        <span class="label">输入</span>
        <div class="btn-group">
          <button :class="['small-btn', { active: formatType === 'format' }]" @click="formatType = 'format'">格式化</button>
          <button :class="['small-btn', { active: formatType === 'compress' }]" @click="formatType = 'compress'">压缩</button>
        </div>
      </div>
      <el-input
        v-model="input"
        type="textarea"
        :rows="6"
        placeholder="粘贴 JSON 数据..."
        @input="process"
        @blur="validate"
        class="tool-input"
      />
      <p v-if="error" class="error-msg">{{ error }}</p>
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
        :rows="6"
        readonly
        placeholder="格式化结果..."
        class="tool-input mono"
      />
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

.error-msg {
  color: var(--error);
  font-size: 13px;
  margin-top: var(--space-1);
}

.tool-input {
  width: 100%;
}

.tool-input.mono :deep(.el-textarea__inner) {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
}
</style>
