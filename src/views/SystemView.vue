<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { systemApi } from '../api'
import { useToastStore } from '../stores/toast'
import type { SystemStatus } from '../api/types'

const toast = useToastStore()

const status = ref<SystemStatus | null>(null)
const loading = ref(false)
const apiOk = ref(false)

const FRONTEND_VERSION = __APP_VERSION__
const DEPLOY_TIME = __DEPLOY_TIME__

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

const formatUptime = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${h}ч ${m}м`
}

const load = async () => {
  loading.value = true
  try {
    status.value = await systemApi.getStatus()
    apiOk.value = status.value.status === 'ok'
  } catch {
    apiOk.value = false
    toast.show('Не удалось получить статус API', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(load)

const classes = {
  page: 'flex flex-col gap-6',
  title: 'text-2xl font-heading font-bold text-[var(--color-text)]',
  grid: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4',
  card: 'glass-panel p-5 flex flex-col gap-2',
  cardLabel: 'text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide',
  cardValue: 'text-base font-semibold text-[var(--color-text)]',
  statusRow: 'flex items-center gap-2',
  dot: {
    ok: 'w-2.5 h-2.5 rounded-full bg-[var(--color-success)] shadow-[0_0_6px_var(--color-success)] flex-shrink-0',
    err: 'w-2.5 h-2.5 rounded-full bg-[var(--color-danger)] flex-shrink-0',
  },
  spinner: 'text-sm text-[var(--color-text-muted)] py-8',
  reloadBtn: 'text-xs text-[var(--color-primary)] hover:underline cursor-pointer self-start',
}
</script>

<template>
  <div :class="classes.page">
    <h1 :class="classes.title">Система</h1>

    <div v-if="loading" :class="classes.spinner">Загрузка...</div>

    <template v-else>
      <div :class="classes.grid">
        <!-- API status -->
        <div :class="classes.card">
          <span :class="classes.cardLabel">Статус API</span>
          <div :class="classes.statusRow">
            <span :class="apiOk ? classes.dot.ok : classes.dot.err" />
            <span :class="classes.cardValue">{{ apiOk ? 'Работает' : 'Недоступен' }}</span>
          </div>
        </div>

        <!-- Backend version -->
        <div :class="classes.card">
          <span :class="classes.cardLabel">Версия backend</span>
          <span :class="classes.cardValue">{{ status?.version ?? '—' }}</span>
        </div>

        <!-- Frontend version -->
        <div :class="classes.card">
          <span :class="classes.cardLabel">Версия frontend</span>
          <span :class="classes.cardValue">{{ FRONTEND_VERSION }}</span>
        </div>

        <!-- Uptime -->
        <div :class="classes.card">
          <span :class="classes.cardLabel">Uptime backend</span>
          <span :class="classes.cardValue">{{ status ? formatUptime(status.uptime) : '—' }}</span>
        </div>

        <!-- Started at -->
        <div :class="[classes.card, 'sm:col-span-2']">
          <span :class="classes.cardLabel">Запущен</span>
          <span :class="classes.cardValue">{{ status ? formatDate(status.startedAt) : '—' }}</span>
        </div>

        <!-- Last deploy -->
        <div :class="[classes.card, 'sm:col-span-2']">
          <span :class="classes.cardLabel">Последний деплой frontend</span>
          <span :class="classes.cardValue">{{ formatDate(DEPLOY_TIME) }}</span>
        </div>
      </div>

      <button :class="classes.reloadBtn" @click="load">↻ Обновить</button>
    </template>
  </div>
</template>
