<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

import Button from '../Button/Button.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import CheckIcon from '../internal/CheckIcon.vue'
import CopyIcon from '../internal/CopyIcon.vue'

export interface CopyBlockProps {
  /** What Copy puts on the clipboard. Shown as is unless the default slot draws it differently. */
  text: string
  size?: 'sm' | 'md'
  copyLabel?: string
  copiedLabel?: string
}

const props = withDefaults(defineProps<CopyBlockProps>(), {
  size: 'md',
  copyLabel: 'Copy to clipboard',
  copiedLabel: 'Copied'
})

const emit = defineEmits<{ copy: [text: string]; error: [error: unknown] }>()

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const copy = async () => {
  try {
    await navigator.clipboard.writeText(props.text)
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => (copied.value = false), 1600)
    emit('copy', props.text)
  } catch (error) {
    copied.value = false
    emit('error', error)
  }
}

onBeforeUnmount(() => clearTimeout(timer))

const label = computed(() => (copied.value ? props.copiedLabel : props.copyLabel))
</script>

<!-- A block of text to copy, as code blocks do: Copy sits in the top right corner, shown while the pointer is over
     the block or focus is in it, and always where there's no hover. The text keeps clear of the corner. -->
<template>
  <div
    class="group relative rounded-lg border border-sui-line-subtle bg-sui-sunken text-sui-ink"
    :class="size === 'sm' ? 'py-2.5 pr-10 pl-3 text-sm leading-normal' : 'py-3 pr-10.5 pl-3.5 text-15 leading-normal'"
  >
    <slot>
      <p class="m-0 whitespace-pre-line">{{ text }}</p>
    </slot>
    <Tooltip :text="label">
      <Button
        :aria-label="label"
        class="absolute top-1.5 right-1.5 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
        :class="copied ? 'opacity-100' : 'opacity-0'"
        icon-only
        size="sm"
        variant="ghost"
        @click="copy"
      >
        <CheckIcon v-if="copied" />
        <CopyIcon v-else />
      </Button>
    </Tooltip>
  </div>
</template>
