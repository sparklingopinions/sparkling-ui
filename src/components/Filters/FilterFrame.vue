<script setup lang="ts">
defineProps<{ status?: string; enterLabel: string; closeLabel: string }>()

const emit = defineEmits<{ enter: [] }>()

// Enter applies and closes, except on a button, where it presses the button.
function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' || (event.target as HTMLElement).closest('button, [role="option"], [role="radio"]')) return
  event.preventDefault()
  emit('enter')
}
</script>

<!-- The filter and sort panels' card: the content, then a footer with the live count and the ↵ and Esc hints. -->
<template>
  <div @keydown="onKeydown">
    <slot />
    <div
      class="flex h-9 items-center gap-3 rounded-b-[calc(0.75rem-1px)] border-t border-sui-line-subtle bg-sui-canvas px-3.5 text-xs whitespace-nowrap text-sui-ink-muted"
    >
      <span class="mr-auto min-w-0 truncate font-medium text-sui-ink-body tabular-nums">{{ status }}</span>
      <span
        v-for="[key, label] in [
          ['↵', enterLabel],
          ['Esc', closeLabel]
        ]"
        :key="key"
        class="inline-flex items-center gap-1.5"
      >
        <kbd
          class="inline-flex h-4.5 min-w-4.5 items-center justify-center rounded border border-sui-line bg-sui-surface px-1 font-sans text-11"
          >{{ key }}</kbd
        >{{ label }}
      </span>
    </div>
  </div>
</template>
