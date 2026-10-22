import { type ComponentPublicInstance, type Ref, computed, nextTick, ref, shallowRef, useId, watch } from 'vue'

/** What a `#trigger` slot's opener spreads with `v-bind="props"`. */
export interface FilterTriggerProps {
  'aria-haspopup': 'dialog'
  'aria-expanded': boolean
  'aria-controls': string | undefined
  'data-state': 'open' | 'closed'
  onClick: () => void
  ref: (node: Element | ComponentPublicInstance | null) => void
}

// An opener drawn by the app sits outside Reka's PopoverTrigger, so the panel needs telling that clicks on it aren't
// outside clicks, and where focus goes back to when it closes.
export function useCustomTrigger(open: Ref<boolean>) {
  const element = shallowRef<HTMLElement | null>(null)
  // Reka names the panel itself; the opener reads that id once the panel is open.
  const panelKey = useId()
  const panelId = ref<string>()
  watch(open, async (isOpen) => {
    await nextTick()
    panelId.value = isOpen ? (document.querySelector(`[data-sui-panel="${panelKey}"]`)?.id ?? undefined) : undefined
  })
  const elementOf = (node: Element | ComponentPublicInstance | null) =>
    node instanceof Element ? (node as HTMLElement) : ((node?.$el as HTMLElement | undefined) ?? null)
  const toggle = () => (open.value = !open.value)

  const props = computed<FilterTriggerProps>(() => ({
    'aria-haspopup': 'dialog',
    'aria-expanded': open.value,
    'aria-controls': panelId.value,
    'data-state': open.value ? 'open' : 'closed',
    onClick: toggle,
    ref: (node) => (element.value = elementOf(node))
  }))

  function ignoreTrigger(event: Event) {
    if (element.value?.contains(event.target as Node)) event.preventDefault()
  }

  function returnFocus(event: Event) {
    if (!element.value) return
    event.preventDefault()
    element.value.focus()
  }

  return { props, toggle, ignoreTrigger, returnFocus, panelKey }
}
