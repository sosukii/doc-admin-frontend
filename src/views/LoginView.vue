<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AppButton from '../components/ui/AppButton.vue'
import AppInput from '../components/ui/AppInput.vue'

const auth = useAuthStore()
const router = useRouter()

const login = ref('')
const password = ref('')

const submit = async () => {
  try {
    await auth.login(login.value, password.value)
    void router.push({ name: 'visibility' })
  } catch {
    // error shown via auth.error
  }
}

const classes = {
  page: 'min-h-dvh flex items-center justify-center p-4',
  panel: 'glass-panel w-full max-w-sm p-8 flex flex-col gap-8',
  header: 'flex flex-col gap-1',
  title: 'text-2xl font-heading font-bold gradient-text',
  subtitle: 'text-sm text-[var(--color-text-muted)]',
  form: 'flex flex-col gap-4',
  error: 'text-xs text-[var(--color-danger)] text-center',
}
</script>

<template>
  <div :class="classes.page">
    <div :class="classes.panel">
      <div :class="classes.header">
        <h1 :class="classes.title">Avent Admin</h1>
        <p :class="classes.subtitle">Войдите в административную панель</p>
      </div>

      <form :class="classes.form" @submit.prevent="submit">
        <AppInput v-model="login" label="Логин" placeholder="admin" autocomplete="username" />
        <AppInput v-model="password" label="Пароль" type="password" placeholder="••••••••" autocomplete="current-password" />
        <p v-if="auth.error" :class="classes.error">{{ auth.error }}</p>
        <AppButton type="submit" :loading="auth.loading">Войти</AppButton>
      </form>
    </div>
  </div>
</template>
