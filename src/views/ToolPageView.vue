<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import JsonFormatter from '../components/tools/JsonFormatter.vue'
import TimestampConv from '../components/tools/TimestampConv.vue'
import Base64Codec from '../components/tools/Base64Codec.vue'
import UrlCodec from '../components/tools/UrlCodec.vue'
import UuidGen from '../components/tools/UuidGen.vue'
import HashGen from '../components/tools/HashGen.vue'
import CronParser from '../components/tools/CronParser.vue'
import JwtDecoder from '../components/tools/JwtDecoder.vue'
import SqlFormatter from '../components/tools/SqlFormatter.vue'
import ColorConv from '../components/tools/ColorConv.vue'
import HtmlCodec from '../components/tools/HtmlCodec.vue'
import UnicodeConv from '../components/tools/UnicodeConv.vue'

const route = useRoute()
const router = useRouter()

const tools = {
  json: { name: 'JSON 格式化', component: JsonFormatter, desc: '格式化、压缩、验证 JSON 数据' },
  timestamp: { name: '时间戳转换', component: TimestampConv, desc: 'Unix 时间戳与北京时间互转' },
  base64: { name: 'Base64 编解码', component: Base64Codec, desc: '文本与 Base64 字符串互转' },
  url: { name: 'URL 编解码', component: UrlCodec, desc: 'URL 组件编码与解码' },
  html: { name: 'HTML 编解码', component: HtmlCodec, desc: 'HTML 实体与普通文本互转' },
  unicode: { name: 'Unicode 转换', component: UnicodeConv, desc: '中文与 Unicode 互转' },
  uuid: { name: 'UUID 生成器', component: UuidGen, desc: '生成 RFC 4122 标准 UUID v4' },
  hash: { name: 'Hash 生成器', component: HashGen, desc: 'SHA-256 / SHA-1 哈希值生成' },
  cron: { name: 'Cron 解析器', component: CronParser, desc: '解析 Cron 表达式并计算执行时间' },
  jwt: { name: 'JWT 解码器', component: JwtDecoder, desc: '解码 JWT Token 查看 Payload' },
  sql: { name: 'SQL 格式化', component: SqlFormatter, desc: '格式化或压缩 SQL 语句' },
  color: { name: '颜色转换', component: ColorConv, desc: 'HEX / RGB / HSL 颜色互转' },
}

const toolId = computed(() => route.params.id)
const currentTool = computed(() => tools[toolId.value])

onMounted(() => {
  if (!currentTool.value) {
    router.push('/tools')
  }
})
</script>

<template>
  <div class="tool-page">
    <div class="tool-page-header" v-if="currentTool">
      <div class="breadcrumb">
        <router-link to="/tools">工具集</router-link>
        <span class="separator">/</span>
        <span class="current">{{ currentTool.name }}</span>
      </div>
      <h1>{{ currentTool.name }}</h1>
      <p class="tool-desc">{{ currentTool.desc }}</p>
    </div>

    <div class="tool-page-content" v-if="currentTool">
      <component :is="currentTool.component" />
    </div>
  </div>
</template>

<style scoped>
.tool-page {
  width: min(900px, 95vw);
  margin: 0 auto;
  padding: var(--space-3) 0;
}

.tool-page-header {
  margin-bottom: var(--space-3);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: var(--space-2);
  font-size: 13px;
}

.breadcrumb a {
  color: var(--accent);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.breadcrumb a:hover {
  color: var(--accent-hover);
}

.separator {
  color: var(--text-muted);
}

.current {
  color: var(--text-secondary);
}

.tool-page-header h1 {
  font-size: clamp(24px, 4vw, 32px);
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
}

.tool-desc {
  color: var(--text-secondary);
  font-size: 15px;
}

.tool-page-content {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
}
</style>
