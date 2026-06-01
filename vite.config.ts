import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as { version: string }

export default defineConfig({
  plugins: [vue()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __DEPLOY_TIME__: JSON.stringify(new Date().toISOString()),
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
