<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'

export interface TextareaProps {
  /** Grows with its content instead of scrolling. */
  autoResize?: boolean
  /** Marks the field as failing validation: a danger border and `aria-invalid`. */
  invalid?: boolean
  disabled?: boolean
}

const props = defineProps<TextareaProps>()

const model = defineModel<string | null>()

const field = useTemplateRef<HTMLTextAreaElement>('field')

// As PrimeVue's: grows straight to the content's height, and only drops to `auto` to measure when shrinking.
function resize() {
  const el = field.value
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
  if (!props.autoResize || !field.value) return
  observer = new ResizeObserver(() => requestAnimationFrame(resize))
  observer.observe(field.value)
})

onBeforeUnmount(() => observer?.disconnect())

watch(model, () => nextTick(resize))
</script>

<template>
  <textarea
    ref="field"
    :aria-invalid="invalid ? 'true' : undefined"
    class="m-0 w-full appearance-none rounded-md border bg-sui-surface px-3 py-1.5 font-sans text-sm leading-5 text-sui-ink transition-colors duration-200 placeholder:text-sui-ink-faint"
    :class="[
      invalid ? 'border-sui-danger-mid' : 'border-sui-line-subtle hover:border-sui-line-strong',
      disabled
        ? 'pointer-events-none cursor-default opacity-60 select-none'
        : 'focus:border-sui-accent-solid focus:shadow-[0_1px_2px_0_rgb(0_0_0/0.05)] focus:ring-3 focus:ring-sui-focus-ring focus:outline-hidden focus:outline-offset-0'
    ]"
    :disabled="disabled"
    :value="model ?? ''"
    @input="model = ($event.target as HTMLTextAreaElement).value"
  />
</template>
