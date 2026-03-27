<script setup>
import { ref } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import ToolCard from './ToolCard.vue'

const input = ref('')
const output = ref('')
const mode = ref('encode')
const error = ref('')
const copied = ref(false)

function process() {
  if (!input.value) {
    output.value = ''
    error.value = ''
    return
  }

  try {
    if (mode.value === 'encode') {
      output.value = btoa(unescape(encodeURIComponent(input.value)))
    } else {
      output.value = decodeURIComponent(escape(atob(input.value)))
    }
    error.value = ''
  } catch (e) {
    error.value = mode.value === 'encode' ? '编码失败' : 'Base64 解码失败，请检查输入'
    output.value = ''
  }
}

function swap() {
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
  input.value = output.value
  output.value = ''
  process()
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
  <ToolCard title="Base64 编解码" description="文本与 Base64 字符串互转">
    <div class="tool-section">
      <div class="section-header">
        <span class="label">输入</span>
        <div class="btn-group">
          <button :class="['small-btn', { active: mode === 'encode' }]" @click="mode = 'encode'; process()">编码</button>
          <button :class="['small-btn', { active: mode === 'decode' }]" @click="mode = 'decode'; process()">解码</button>
          <el-button size="small" :icon="Refresh" circle @click="swap" title="交换" />
        </div>
      </div>
      <el-input
        v-model="input"
        type="textarea"
        :rows="4"
        :placeholder="mode === 'encode' ? '输入要编码的文本...' : '输入 Base64 字符串...'"
        @input="process"
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
        :rows="4"
        readonly
        placeholder="结果..."
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
  align-items: center;
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
