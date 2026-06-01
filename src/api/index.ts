import { api } from './client'
import type { Banner, Page, Product, Setting, SystemStatus } from './types'

export const authApi = {
  login: (login: string, password: string) =>
    api.post<{ token: string }>('/admin/login', { login, password }),
}

export const settingsApi = {
  getAll: () => api.get<Setting[]>('/admin/settings'),
  update: (key: string, value: string) =>
    api.patch<Setting>(`/admin/settings/${key}`, { value }),
}

export const pagesApi = {
  getAll: () => api.get<Page[]>('/admin/pages'),
  updateVisibility: (key: string, visible: boolean) =>
    api.patch<Page>(`/admin/pages/${key}`, { visible }),
}

export const productsApi = {
  getAll: () => api.get<Product[]>('/admin/products'),
  updateVisibility: (id: string, visible: boolean) =>
    api.patch<Product>(`/admin/products/${id}`, { visible }),
}

export const bannersApi = {
  getAll: () => api.get<Banner[]>('/admin/banners'),
  updateVisibility: (id: string, visible: boolean) =>
    api.patch<Banner>(`/admin/banners/${id}`, { visible }),
}

export const systemApi = {
  getStatus: () => api.get<SystemStatus>('/admin/system/status'),
}
