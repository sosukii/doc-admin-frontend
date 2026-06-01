import { defineStore } from 'pinia'
import { ref } from 'vue'

type Theme = 'dark' | 'light'

const getSystemTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute('data-theme', theme)
}

export const useThemeStore = defineStore('theme', () => {
  const saved = localStorage.getItem('admin_theme') as Theme | null
  const theme = ref<Theme>(saved ?? getSystemTheme())

  applyTheme(theme.value)

  const toggle = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem('admin_theme', theme.value)
    applyTheme(theme.value)
  }

  return { theme, toggle }
})
