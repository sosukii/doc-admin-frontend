<script setup lang="ts">
defineProps<{
  modelValue: boolean
  disabled?: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const classes = {
  wrapper: 'inline-flex items-center gap-2 cursor-pointer select-none',
  track: 'switch-track',
  trackOn: 'switch-track--on',
  disabled: 'opacity-50 pointer-events-none',
}
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    :class="[classes.wrapper, disabled && classes.disabled]"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span :class="[classes.track, modelValue && classes.trackOn]" />
  </button>
</template>
