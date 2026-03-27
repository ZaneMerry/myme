<script setup>
import { ref } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import ToolCard from './ToolCard.vue'

const hex = ref('#6366f1')
const rgb = ref({ r: 99, g: 102, b: 241 })
const hsl = ref({ h: 239, s: 84, l: 67 })
const copied = ref('')
let isUpdating = false

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

function hslToRgb(h, s, l) {
  s /= 100
  l /= 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l - c / 2

  let r, g, b
  if (h < 60) { r = c; g = x; b = 0 }
  else if (h < 120) { r = x; g = c; b = 0 }
  else if (h < 180) { r = 0; g = c; b = x }
  else if (h < 240) { r = 0; g = x; b = c }
  else if (h < 300) { r = x; g = 0; b = c }
  else { r = c; g = 0; b = x }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  }
}

function onHexInput() {
  if (isUpdating) return
  isUpdating = true

  const rgbVal = hexToRgb(hex.value)
  if (rgbVal) {
    rgb.value = rgbVal
    hsl.value = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b)
  }

  isUpdating = false
}

function onRgbInput() {
  if (isUpdating) return
  isUpdating = true

  hex.value = rgbToHex(rgb.value.r, rgb.value.g, rgb.value.b)
  hsl.value = rgbToHsl(rgb.value.r, rgb.value.g, rgb.value.b)

  isUpdating = false
}

function onHslInput() {
  if (isUpdating) return
  isUpdating = true

  const rgbVal = hslToRgb(hsl.value.h, hsl.value.s, hsl.value.l)
  rgb.value = rgbVal
  hex.value = rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b)

  isUpdating = false
}

function randomColor() {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)

  isUpdating = true
  rgb.value = { r, g, b }
  hex.value = rgbToHex(r, g, b)
  hsl.value = rgbToHsl(r, g, b)
  isUpdating = false
}

async function copyValue(format) {
  let text = ''
  switch (format) {
    case 'hex': text = hex.value; break
    case 'rgb': text = `rgb(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b})`; break
    case 'hsl': text = `hsl(${hsl.value.h}, ${hsl.value.s}%, ${hsl.value.l}%)`; break
    case 'css': text = `background-color: ${hex.value};`; break
  }
  await navigator.clipboard.writeText(text)
  copied.value = format
  setTimeout(() => { copied.value = '' }, 1500)
}
</script>

<template>
  <ToolCard title="颜色转换" description="HEX / RGB / HSL 互转">
    <div class="color-preview" :style="{ backgroundColor: hex }">
      <span class="preview-text">{{ hex }}</span>
    </div>

    <div class="color-inputs">
      <div class="input-group">
        <label>HEX</label>
        <el-input v-model="hex" placeholder="#000000" @input="onHexInput" class="color-input">
          <template #prefix>
            <span class="color-dot" :style="{ backgroundColor: hex }"></span>
          </template>
        </el-input>
      </div>

      <div class="input-row">
        <div class="input-group small">
          <label>R</label>
          <el-input-number
            v-model="rgb.r"
            :min="0"
            :max="255"
            controls-position="right"
            @change="onRgbInput"
          />
        </div>
        <div class="input-group small">
          <label>G</label>
          <el-input-number
            v-model="rgb.g"
            :min="0"
            :max="255"
            controls-position="right"
            @change="onRgbInput"
          />
        </div>
        <div class="input-group small">
          <label>B</label>
          <el-input-number
            v-model="rgb.b"
            :min="0"
            :max="255"
            controls-position="right"
            @change="onRgbInput"
          />
        </div>
      </div>

      <div class="input-row">
        <div class="input-group small">
          <label>H</label>
          <el-input-number
            v-model="hsl.h"
            :min="0"
            :max="360"
            controls-position="right"
            @change="onHslInput"
          />
        </div>
        <div class="input-group small">
          <label>S%</label>
          <el-input-number
            v-model="hsl.s"
            :min="0"
            :max="100"
            controls-position="right"
            @change="onHslInput"
          />
        </div>
        <div class="input-group small">
          <label>L%</label>
          <el-input-number
            v-model="hsl.l"
            :min="0"
            :max="100"
            controls-position="right"
            @change="onHslInput"
          />
        </div>
      </div>
    </div>

    <div class="color-actions">
      <el-button :icon="Refresh" @click="randomColor">随机颜色</el-button>
    </div>

    <div class="color-outputs">
      <div class="output-item" @click="copyValue('hex')">
        <span class="output-label">HEX</span>
        <span class="output-value">{{ hex }}</span>
        <span class="copy-hint">{{ copied === 'hex' ? '已复制!' : '点击复制' }}</span>
      </div>
      <div class="output-item" @click="copyValue('rgb')">
        <span class="output-label">RGB</span>
        <span class="output-value">rgb({{ rgb.r }}, {{ rgb.g }}, {{ rgb.b }})</span>
        <span class="copy-hint">{{ copied === 'rgb' ? '已复制!' : '点击复制' }}</span>
      </div>
      <div class="output-item" @click="copyValue('hsl')">
        <span class="output-label">HSL</span>
        <span class="output-value">hsl({{ hsl.h }}, {{ hsl.s }}%, {{ hsl.l }}%)</span>
        <span class="copy-hint">{{ copied === 'hsl' ? '已复制!' : '点击复制' }}</span>
      </div>
      <div class="output-item" @click="copyValue('css')">
        <span class="output-label">CSS</span>
        <span class="output-value">background-color: {{ hex }};</span>
        <span class="copy-hint">{{ copied === 'css' ? '已复制!' : '点击复制' }}</span>
      </div>
    </div>
  </ToolCard>
</template>

<style scoped>
.color-preview {
  height: 100px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-3);
  transition: background-color var(--transition-normal);
}

.preview-text {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 18px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.color-inputs {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group.small {
  flex: 1;
}

.input-group label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 600;
}

.input-row {
  display: flex;
  gap: var(--space-2);
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.color-actions {
  margin-bottom: var(--space-3);
}

.color-outputs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2);
}

.output-item {
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-2);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.output-item:hover {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.output-label {
  font-size: 11px;
  color: var(--accent);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.output-value {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  color: var(--text-primary);
  word-break: break-all;
}

.copy-hint {
  font-size: 11px;
  color: var(--text-muted);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.output-item:hover .copy-hint {
  opacity: 1;
}

@media (max-width: 480px) {
  .color-outputs {
    grid-template-columns: 1fr;
  }
}
</style>
