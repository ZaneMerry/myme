<script setup>
import { ref, watch } from 'vue'
import { DocumentCopy, Delete } from '@element-plus/icons-vue'
import ToolCard from './ToolCard.vue'

const jwtInput = ref('')
const parts = ref({ header: null, payload: null, signature: null })
const error = ref('')
const copiedField = ref('')

function decodeJwt() {
  error.value = ''
  parts.value = { header: null, payload: null, signature: null }

  if (!jwtInput.value.trim()) return

  const token = jwtInput.value.trim()

  try {
    const partsArray = token.split('.')
    if (partsArray.length !== 3) {
      error.value = '无效 JWT 格式，应包含 3 个部分 (header.payload.signature)'
      return
    }

    const [headerB64, payloadB64, signatureB64] = partsArray

    const headerJson = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')))
    const payloadJson = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')))

    parts.value = {
      header: {
        raw: headerB64,
        json: headerJson,
        formatted: JSON.stringify(headerJson, null, 2),
      },
      payload: {
        raw: payloadB64,
        json: payloadJson,
        formatted: JSON.parse(JSON.stringify(payloadJson)),
      },
      signature: signatureB64,
    }
  } catch (e) {
    error.value = 'JWT 解码失败: ' + e.message
  }
}

function formatJwtDate(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

function isExpired(exp) {
  return exp ? Date.now() > exp * 1000 : false
}

async function copyPart(part, field) {
  const text = typeof part === 'object' ? JSON.stringify(part, null, 2) : part
  await navigator.clipboard.writeText(text)
  copiedField.value = field
  setTimeout(() => { copiedField.value = '' }, 2000)
}

watch(jwtInput, decodeJwt)
</script>

<template>
  <ToolCard title="JWT 解码器" description="解码 JWT Token 查看 Payload 内容（不验证签名）">
    <div class="tool-section">
      <div class="section-header">
        <span class="label">输入 JWT Token</span>
        <el-button size="small" :icon="Delete" @click="jwtInput = ''; parts = { header: null, payload: null, signature: null }; error = ''">清空</el-button>
      </div>
      <el-input
        v-model="jwtInput"
        type="textarea"
        :rows="3"
        placeholder="粘贴 JWT Token..."
        class="tool-textarea mono"
      />
      <p v-if="error" class="error-msg">{{ error }}</p>
    </div>

    <div v-if="parts.header" class="jwt-parts">
      <div class="jwt-part header-part">
        <div class="part-header">
          <span class="part-title">Header</span>
          <el-button size="small" :icon="DocumentCopy" @click="copyPart(parts.header.json, 'header')">
            {{ copiedField === 'header' ? '已复制' : '复制' }}
          </el-button>
        </div>
        <pre class="part-content">{{ parts.header.formatted }}</pre>
      </div>

      <div class="jwt-part payload-part">
        <div class="part-header">
          <span class="part-title">
            Payload
            <span v-if="parts.payload.json.exp" :class="['exp-badge', isExpired(parts.payload.json.exp) ? 'expired' : 'valid']">
              {{ isExpired(parts.payload.json.exp) ? '已过期' : '有效' }}
            </span>
          </span>
          <el-button size="small" :icon="DocumentCopy" @click="copyPart(parts.payload.json, 'payload')">
            {{ copiedField === 'payload' ? '已复制' : '复制' }}
          </el-button>
        </div>
        <pre class="part-content">{{ JSON.stringify(parts.payload.formatted, null, 2) }}</pre>

        <div v-if="parts.payload.json.exp" class="jwt-dates">
          <div class="date-item">
            <span class="date-label">签发时间</span>
            <span class="date-value">{{ formatJwtDate(parts.payload.json.iat) }}</span>
          </div>
          <div class="date-item">
            <span class="date-label">过期时间</span>
            <span class="date-value" :class="{ 'is-expired': isExpired(parts.payload.json.exp) }">
              {{ formatJwtDate(parts.payload.json.exp) }}
            </span>
          </div>
        </div>
      </div>

      <div class="jwt-part signature-part">
        <div class="part-header">
          <span class="part-title">Signature</span>
          <el-button size="small" :icon="DocumentCopy" @click="copyPart(parts.signature, 'signature')">
            {{ copiedField === 'signature' ? '已复制' : '复制' }}
          </el-button>
        </div>
        <pre class="part-content signature">{{ parts.signature }}</pre>
      </div>
    </div>

    <div class="jwt-warning">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <span>此工具仅用于解码查看，不验证签名真实性</span>
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

.error-msg {
  color: var(--error);
  font-size: 13px;
  margin-top: var(--space-1);
}

.jwt-parts {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.jwt-part {
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-2);
}

.header-part {
  border-left: 3px solid var(--accent);
}

.payload-part {
  border-left: 3px solid var(--warning);
}

.signature-part {
  border-left: 3px solid var(--text-muted);
}

.part-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.part-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.exp-badge {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.exp-badge.valid {
  background: rgba(16, 185, 129, 0.15);
  color: var(--success);
}

.exp-badge.expired {
  background: rgba(239, 68, 68, 0.15);
  color: var(--error);
}

.part-content {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.part-content.signature {
  color: var(--text-muted);
}

.jwt-dates {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-2);
  padding-top: var(--space-2);
  border-top: 1px dashed var(--border-default);
}

.date-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-label {
  font-size: 11px;
  color: var(--text-muted);
}

.date-value {
  font-size: 13px;
  color: var(--text-primary);
}

.date-value.is-expired {
  color: var(--error);
}

.jwt-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: var(--space-2);
  padding: var(--space-2);
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: var(--radius-md);
  font-size: 13px;
  color: var(--warning);
}

:deep(.tool-textarea .el-textarea__inner) {
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
}
</style>
