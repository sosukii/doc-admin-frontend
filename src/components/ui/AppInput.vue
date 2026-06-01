<script setup lang="ts">
defineProps<{
  label?: string
  modelValue: string
  placeholder?: string
  type?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const classes = {
  wrapper: 'flex flex-col gap-1.5',
  label: 'text-sm font-medium text-[var(--color-text-muted)]',
  input: 'w-full bg-[var(--color-surface-strong)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[rgba(var(--color-accent-rgb),0.15)]',
}
</script>

<template>
  <div :class="classes.wrapper">
    <label v-if="label" :class="classes.label">{{ label }}</label>
    <input
      :type="type ?? 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :class="classes.input"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
