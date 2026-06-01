<script setup lang="ts">
const classes = {
  overlay: 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4',
  panel: 'glass-panel w-full max-w-md p-6 flex flex-col gap-6',
  title: 'text-lg font-heading font-bold text-[var(--color-text)]',
  content: 'text-sm text-[var(--color-text-muted)] leading-relaxed',
  row: 'flex flex-col gap-1',
  rowLabel: 'text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide',
  rowOld: 'text-sm text-[var(--color-text-muted)] line-through',
  rowNew: 'text-sm font-medium text-[var(--color-primary)]',
  actions: 'flex gap-3 justify-end',
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div :class="classes.overlay" @click.self="$emit('cancel')">
        <Transition name="slide-up" appear>
          <div :class="classes.panel">
            <h3 :class="classes.title">
              <slot name="title">Подтвердите изменения</slot>
            </h3>

            <div :class="classes.content">
              <slot name="content" />
            </div>

            <div :class="classes.actions">
              <slot name="actions" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
