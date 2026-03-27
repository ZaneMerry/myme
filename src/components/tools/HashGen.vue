<script setup>
import { ref } from 'vue'
import { DocumentCopy, Delete } from '@element-plus/icons-vue'
import ToolCard from './ToolCard.vue'

const input = ref('')
const sha256 = ref('')
const sha1 = ref('')
const md5 = ref('')
const isProcessing = ref(false)

async function hashSHA256(str) {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

async function hashSHA1(str) {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(8, '0')
}

async function process() {
  if (!input.value) {
    sha256.value = ''
    sha1.value = ''
    md5.value = ''
    return
  }

  isProcessing.value = true

  try {
    const [hash256, hash1] = await Promise.all([
      hashSHA256(input.value),
      hashSHA1(input.value)
    ])
    sha256.value = hash256
    sha1.value = hash1
    md5.value = simpleHash(input.value) + simpleHash(input.value.split('').reverse().join(''))
  } catch (e) {
    console.error('Hash error:', e)
  } finally {
    isProcessing.value = false
  }
}

async function copyHash(hash) {
  await navigator.clipboard.writeText(hash)
}

function clear() {
  input.value = ''
  sha256.value = ''
  sha1.value = ''
  md5.value = ''
}
</script>

<template>
  <ToolCard title="Hash 生成器" description="生成 SHA-256 / SHA-1 哈希值">
    <div class="tool-section">
      <div class="section-header">
        <span class="label">输入文本</span>
        <el-button size="small" :icon="Delete" @click="clear">清空</el-button>
      </div>
      <el-input
        v-model="input"
        type="textarea"
        :rows="3"
        placeholder="输入要哈希的文本..."
        @input="process"
        class="tool-input"
        :disabled="isProcessing"
      />
    </div>

    <div class="hash-results">
      <div class="hash-item">
        <div class="hash-header">
          <span class="hash-label">SHA-256</span>
          <el-button
            size="small"
            :icon="DocumentCopy"
            @click="copyHash(sha256)"
            :disabled="!sha256"
          >
            复制
          </el-button>
        </div>
        <span class="hash-value">{{ sha256 || '等待输入...' }}</span>
      </div>

      <div class="hash-item">
        <div class="hash-header">
          <span class="hash-label">SHA-1</span>
          <el-button
            size="small"
            :icon="DocumentCopy"
            @click="copyHash(sha1)"
            :disabled="!sha1"
          >
            复制
          </el-button>
        </div>
        <span class="hash-value">{{ sha1 || '等待输入...' }}</span>
      </div>

      <div class="hash-item">
        <div class="hash-header">
          <span class="hash-label">Simple Hash</span>
          <el-button
            size="small"
            :icon="DocumentCopy"
            @click="copyHash(md5)"
            :disabled="!md5"
          >
            复制
          </el-button>
        </div>
        <span class="hash-value">{{ md5 || '等待输入...' }}</span>
      </div>
    </div>

    <p class="hash-note">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
      </svg>
      SHA-256 和 SHA-1 使用浏览器原生 Web Crypto API
    </p>
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

.tool-input {
  width: 100%;
}

.hash-results {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.hash-item {
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-2);
}

.hash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.hash-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--error);
  background: rgba(239, 68, 68, 0.15);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
}

.hash-value {
  display: block;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  color: var(--text-secondary);
  word-break: break-all;
  line-height: 1.6;
}

.hash-note {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: var(--space-2);
  font-size: 12px;
  color: var(--text-muted);
}

.hash-note svg {
  opacity: 0.7;
}
</style>
