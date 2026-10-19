<script setup lang="ts">
import { onBeforeUnmount, ref, useAttrs, watch } from 'vue'

import { PopoverAnchor, PopoverContent, PopoverPortal, PopoverRoot } from 'reka-ui'

export interface PopoverProps {
  /** The gap to the anchor, in px; negative overlaps it. */
  offset?: number
  /** Shifts it along the anchor's edge, in px. */
  alignOffset?: number
  closeOnEscape?: boolean
}

// Root is Reka's renderless PopoverRoot: class and attributes belong on the panel.
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PopoverProps>(), { offset: 4, alignOffset: 0, closeOnEscape: true })

const emit = defineEmits<{ show: []; hide: [] }>()

const attrs = useAttrs()

const open = ref(false)
const anchor = ref<HTMLElement>()
// What was clicked to open it; clicks on it toggle the popover rather than counting as outside.
const opener = ref<HTMLElement>()
const label = ref<string>()

/** Opens below the event's element, or below `target` when given. */
function show(event: Event, target?: HTMLElement) {
  opener.value = event.currentTarget as HTMLElement
  anchor.value = target ?? opener.value
  // A dialog needs a name: an aria-label given to the popover, or else the name of the element it opened from.
  label.value =
    (attrs['aria-label'] as string | undefined) ??
    opener.value?.getAttribute('aria-label') ??
    opener.value?.textContent?.trim()
  open.value = true
}

function hide() {
  open.value = false
}

function toggle(event: Event, target?: HTMLElement) {
  if (open.value) hide()
  else show(event, target)
}

defineExpose({ show, hide, toggle })

function isOnAnchor(target: EventTarget | null) {
  return target instanceof Node && [anchor.value, opener.value].some((el) => el?.contains(target))
}

function onPointerDownOutside(event: CustomEvent<{ originalEvent: PointerEvent }>) {
  if (isOnAnchor(event.detail.originalEvent.target)) event.preventDefault()
}

function onEscape(event: KeyboardEvent) {
  if (!props.closeOnEscape) return event.preventDefault()
  anchor.value?.focus()
}

// Only an [autofocus] element inside takes focus on open; otherwise it stays where it was.
function onOpenAutoFocus(event: Event) {
  event.preventDefault()
  ;(event.target as HTMLElement | null)?.querySelector<HTMLElement>('[autofocus]')?.focus()
}

// It closes when the page moves under it: a scrolling ancestor of the anchor, or a resized window.
function onScroll(event: Event) {
  if (event.target instanceof Node && event.target.contains(anchor.value ?? null)) hide()
}

watch(open, (isOpen) => {
  if (isOpen) {
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', hide)
    emit('show')
  } else {
    window.removeEventListener('scroll', onScroll, true)
    window.removeEventListener('resize', hide)
    emit('hide')
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('resize', hide)
})
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverAnchor :reference="anchor" />
    <PopoverPortal>
      <PopoverContent
        v-bind="$attrs"
        align="start"
        :align-offset="alignOffset"
        :aria-label="label"
        class="z-[1000] block w-64 origin-center rounded-lg border border-sui-line-subtle bg-sui-surface text-sui-ink shadow-xl data-[state=closed]:animate-sui-overlay-out data-[state=open]:animate-sui-overlay-in"
        side="bottom"
        :side-offset="offset"
        trap-focus
        @close-auto-focus.prevent
        @escape-key-down="onEscape"
        @focus-outside.prevent
        @open-auto-focus="onOpenAutoFocus"
        @pointer-down-outside="onPointerDownOutside"
      >
        <slot :hide="hide" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
