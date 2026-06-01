<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { settingsApi } from '../api'
import { useToastStore } from '../stores/toast'
import AppButton from '../components/ui/AppButton.vue'
import AppInput from '../components/ui/AppInput.vue'
import ConfirmModal from '../components/ui/ConfirmModal.vue'
import type { Setting } from '../api/types'

const toast = useToastStore()

const SETTING_LABELS: Record<string, string> = {
  phone: 'Телефон',
  email: 'Email',
  address: 'Адрес',
  work_time: 'Время работы',
}

const settings = ref<Setting[]>([])
const form = ref<Record<string, string>>({})
const original = ref<Record<string, string>>({})
const loading = ref(false)
const saving = ref(false)
const showConfirm = ref(false)

const load = async () => {
  loading.value = true
  try {
    settings.value = await settingsApi.getAll()
    const map: Record<string, string> = {}
    settings.value.forEach((s) => { map[s.key] = s.value })
    form.value = { ...map }
    original.value = { ...map }
  } catch {
    toast.show('Ошибка загрузки контактов', 'error')
  } finally {
    loading.value = false
  }
}

const changedKeys = () =>
  Object.keys(form.value).filter((k) => form.value[k] !== original.value[k])

const confirm = () => {
  if (changedKeys().length === 0) return
  showConfirm.value = true
}

const save = async () => {
  saving.value = true
  showConfirm.value = false
  try {
    await Promise.all(
      changedKeys().map((key) => settingsApi.update(key, form.value[key]))
    )
    original.value = { ...form.value }
    toast.show('Контакты сохранены')
  } catch {
    toast.show('Ошибка сохранения', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(load)

const classes = {
  page: 'flex flex-col gap-6',
  title: 'text-2xl font-heading font-bold text-[var(--color-text)]',
  panel: 'glass-panel p-6 sm:p-8 flex flex-col gap-6 max-w-xl',
  form: 'flex flex-col gap-4',
  actions: 'flex gap-3 pt-2',
  spinner: 'text-sm text-[var(--color-text-muted)] py-8',
  // Confirm modal content
  diffRow: 'flex flex-col gap-3',
  diffItem: 'flex flex-col gap-1 p-3 rounded-lg bg-[rgba(var(--color-text-rgb),0.04)]',
  diffLabel: 'text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide',
  diffOld: 'text-sm text-[var(--color-text-muted)] line-through',
  diffNew: 'text-sm font-medium text-[var(--color-primary)]',
}
</script>

<template>
  <div :class="classes.page">
    <h1 :class="classes.title">Контакты</h1>

    <div v-if="loading" :class="classes.spinner">Загрузка...</div>

    <div v-else :class="classes.panel">
      <div :class="classes.form">
        <AppInput
          v-for="s in settings"
          :key="s.key"
          v-model="form[s.key]"
          :label="SETTING_LABELS[s.key] ?? s.key"
          :placeholder="SETTING_LABELS[s.key]"
        />
      </div>

      <div :class="classes.actions">
        <AppButton :loading="saving" :disabled="changedKeys().length === 0" @click="confirm">
          Сохранить
        </AppButton>
        <AppButton
          v-if="changedKeys().length > 0"
          variant="secondary"
          @click="form = { ...original }"
        >
          Сбросить
        </AppButton>
      </div>
    </div>

    <!-- Confirm modal -->
    <ConfirmModal v-if="showConfirm" @cancel="showConfirm = false">
      <template #title>Подтвердите изменения</template>

      <template #content>
        <div :class="classes.diffRow">
          <div
            v-for="key in changedKeys()"
            :key="key"
            :class="classes.diffItem"
          >
            <span :class="classes.diffLabel">{{ SETTING_LABELS[key] ?? key }}</span>
            <span :class="classes.diffOld">{{ original[key] || '—' }}</span>
            <span :class="classes.diffNew">{{ form[key] || '—' }}</span>
          </div>
        </div>
      </template>

      <template #actions>
        <AppButton variant="secondary" @click="showConfirm = false">Отмена</AppButton>
        <AppButton :loading="saving" @click="save">Подтвердить</AppButton>
      </template>
    </ConfirmModal>
  </div>
</template>
