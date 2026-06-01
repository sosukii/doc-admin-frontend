import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'error'

export interface Toast {
  id: number
  message: string
  type: ToastType
}

let nextId = 0

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  const show = (message: string, type: ToastType = 'success', duration = 3000) => {
    const id = ++nextId
    toasts.value.push({ id, message, type })
    setTimeout(() => dismiss(id), duration)
  }

  const dismiss = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, show, dismiss }
})
