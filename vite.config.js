import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { codeInspectorPlugin } from 'code-inspector-plugin'

export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    command === 'serve'
      ? codeInspectorPlugin({
          bundler: 'vite',
        })
      : null,
  ].filter(Boolean),
  build: {
    chunkSizeWarningLimit: 600,
  },
}))
