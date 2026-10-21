<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'

import { useFieldControl } from '../FormField/context'

export interface TextareaProps {
  /** Grows with its content instead of scrolling. */
  autoResize?: boolean
  /** Marks the field as failing validation: a danger border and `aria-invalid`. */
  invalid?: boolean
  disabled?: boolean
}

const props = defineProps<TextareaProps>()

const model = defineModel<string | null>()

const textarea = useTemplateRef<HTMLTextAreaElement>('textarea')

const { attrs: fieldAttrs, invalid: isInvalid } = useFieldControl(
  () => model.value,
  () => props.invalid
)

// Grows straight to the content's height, and only drops to `auto` to measure when shrinking.
function resize() {
  const el = textarea.value
  if (!props.autoResize || !el?.offsetParent) return
  const current = parseInt(el.style.height) || 0
  const needed = el.scrollHeight
  if (current && needed < current) {
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  } else if (!current || needed > current) {
    el.style.height = `${needed}px`
  }
}

let observer: ResizeObserver | undefined

onMounted(() => {
  if (!props.autoResize || !textarea.value) return
  observer = new ResizeObserver(() => requestAnimationFrame(resize))
  observer.observe(textarea.value)
})

onBeforeUnmount(() => observer?.disconnect())

watch(model, () => nextTick(resize))
</script>

<template>
  <textarea
    ref="textarea"
    v-bind="fieldAttrs"
    :aria-invalid="isInvalid ? 'true' : undefined"
    class="m-0 w-full appearance-none rounded-md border bg-sui-surface px-3 py-1.5 font-sans text-sm leading-5 text-sui-ink transition-[border-color,box-shadow] duration-200 placeholder:text-sui-ink-faint"
    :class="[
      isInvalid ? 'border-sui-danger-mid' : 'border-sui-line-strong hover:border-sui-ink-muted',
      disabled
        ? 'pointer-events-none cursor-default opacity-60 select-none'
        : 'focus:border-sui-accent focus:ring-0 focus-visible:sui-ring-field'
    ]"
    :disabled="disabled"
    :value="model ?? ''"
    @input="model = ($event.target as HTMLTextAreaElement).value"
  />
</template>
