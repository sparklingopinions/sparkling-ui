<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'

import { useFieldControl } from '../FormField/context'

export interface TextareaProps {
  /** Grows with its content instead of scrolling. */
  autoResize?: boolean
  /** Marks the field as failing validation: a danger border and `aria-invalid`. */
  invalid?: boolean
  disabled?: boolean
  /** No box: for when the text is the thing being made (a note, a message), filling a dialog edge to edge. Give it an
   *  `aria-label` or a visually hidden label. */
  bare?: boolean
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
    class="m-0 w-full appearance-none font-sans text-sui-ink placeholder:text-sui-ink-faint"
    :class="[
      bare
        ? 'resize-none border-0 bg-transparent p-0 text-sm leading-[1.55] shadow-none outline-hidden focus:border-0 focus:shadow-none focus:ring-0 focus:outline-hidden'
        : [
            'rounded-lg border bg-sui-fill px-3 py-1.5 text-sm leading-5 transition-[border-color,box-shadow,background-color] duration-200',
            isInvalid ? 'border-sui-danger-mid' : 'border-sui-fill-line hover:bg-sui-fill-hover',
            !disabled && 'focus:border-sui-accent focus:bg-transparent focus:ring-0 focus-visible:sui-ring-field'
          ],
      disabled && 'pointer-events-none cursor-default opacity-60 select-none'
    ]"
    :disabled="disabled"
    :value="model ?? ''"
    @input="model = ($event.target as HTMLTextAreaElement).value"
  />
</template>
