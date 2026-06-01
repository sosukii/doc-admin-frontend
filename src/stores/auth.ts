import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '../api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('admin_token'))
  const error = ref<string | null>(null)
  const loading = ref(false)

  const isAuthenticated = () => !!token.value

  const login = async (login: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      const res = await authApi.login(login, password)
      token.value = res.token
      localStorage.setItem('admin_token', res.token)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка входа'
      throw e
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    localStorage.removeItem('admin_token')
  }

  return { token, error, loading, isAuthenticated, login, logout }
})
