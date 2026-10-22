<script setup lang="ts">
import { onMounted, onUpdated, ref, useTemplateRef } from 'vue'

export interface ToolbarProps {
  /** Its accessible name, e.g. "Text formatting". */
  label: string
  orientation?: 'horizontal' | 'vertical'
  /** The arrow keys wrap from the last control to the first. */
  loop?: boolean
}

const props = withDefaults(defineProps<ToolbarProps>(), { orientation: 'horizontal', loop: true })

const root = useTemplateRef<HTMLElement>('root')
// The control Tab lands on: the last one focused, else the first.
const current = ref<HTMLElement | null>(null)

const controls = () => [...(root.value?.querySelectorAll<HTMLElement>('button, a[href], input, [role="button"]') ?? [])]
const items = () => controls().filter((el) => !el.matches(':disabled, [aria-disabled="true"]'))

// The controls are the app's: the toolbar only sets their tabindex, so one of them is in the Tab order.
function rove() {
  const all = items()
  const active = current.value && all.includes(current.value) ? current.value : all[0]
  for (const el of controls()) el.tabIndex = el === active ? 0 : -1
}

onMounted(rove)
onUpdated(rove)

function onFocusin(event: FocusEvent) {
  const target = items().find((el) => el === event.target)
  if (!target) return
  current.value = target
  rove()
}

function onKeydown(event: KeyboardEvent) {
  const [back, next] = props.orientation === 'vertical' ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight']
  if (![back, next, 'Home', 'End'].includes(event.key) || event.altKey || event.metaKey || event.ctrlKey) return
  // A field inside keeps its arrow keys.
  if ((event.target as HTMLElement).matches('input, textarea')) return
  const all = items()
  const i = all.indexOf(event.target as HTMLElement)
  if (i < 0) return
  const last = all.length - 1
  let to = event.key === 'Home' ? 0 : event.key === 'End' ? last : i + (event.key === next ? 1 : -1)
  if (to < 0) to = props.loop ? last : 0
  if (to > last) to = props.loop ? 0 : last
  event.preventDefault()
  all[to]?.focus()
}
</script>

<!-- A row of controls, such as format toggles, that Tab enters once and the arrow keys move through. -->
<template>
  <div
    ref="root"
    :aria-label="label"
    :aria-orientation="orientation"
    class="flex gap-0.5"
    :class="orientation === 'vertical' ? 'flex-col items-stretch' : 'items-center'"
    role="toolbar"
    @focusin="onFocusin"
    @keydown="onKeydown"
  >
    <slot />
  </div>
</template>
