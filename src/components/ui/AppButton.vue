<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger'
  type?: 'button' | 'submit'
  loading?: boolean
  disabled?: boolean
}>(), {
  variant: 'primary',
  type: 'button',
  loading: false,
  disabled: false,
})

const classes = {
  base: 'inline-flex items-center justify-center gap-2 font-medium rounded-xl px-5 py-2.5 text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
  variants: {
    primary: 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-soft)] text-[var(--color-bg)] shadow-lg hover:-translate-y-px',
    secondary: 'bg-[var(--color-surface-strong)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[rgba(var(--color-text-rgb),0.08)]',
    danger: 'bg-[var(--color-danger)] text-white hover:opacity-90',
  },
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[classes.base, classes.variants[variant]]"
  >
    <svg v-if="loading" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <slot />
  </button>
</template>
