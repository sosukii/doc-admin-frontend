<script setup lang="ts">
import { useToastStore } from '../../stores/toast'

const toast = useToastStore()

const classes = {
  container: 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none',
  toast: {
    base: 'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium shadow-xl backdrop-blur-sm border min-w-[240px] max-w-[360px]',
    success: 'bg-[var(--color-surface-strong)] border-[var(--color-success)] text-[var(--color-text)]',
    error: 'bg-[var(--color-surface-strong)] border-[var(--color-danger)] text-[var(--color-text)]',
  },
  dot: {
    success: 'w-2 h-2 rounded-full bg-[var(--color-success)] flex-shrink-0',
    error: 'w-2 h-2 rounded-full bg-[var(--color-danger)] flex-shrink-0',
  },
}
</script>

<template>
  <div :class="classes.container">
    <TransitionGroup name="toast">
      <div
        v-for="t in toast.toasts"
        :key="t.id"
        :class="[classes.toast.base, classes.toast[t.type]]"
      >
        <span :class="classes.dot[t.type]" />
        {{ t.message }}
      </div>
    </TransitionGroup>
  </div>
</template>
