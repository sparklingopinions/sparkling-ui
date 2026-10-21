<script setup lang="ts">
import { onBeforeUnmount, ref, useAttrs, watch } from 'vue'

import { PopoverAnchor, PopoverContent, PopoverPortal, PopoverRoot } from 'reka-ui'

export interface PopoverProps {
  /** The gap to the anchor, in px; negative overlaps it. */
  offset?: number
  /** Shifts it along the anchor's edge, in px. */
  alignOffset?: number
  closeOnEscape?: boolean
  /** The panel's width, e.g. `20rem`. */
  width?: string
}

// Root is Reka's renderless PopoverRoot: class and attributes belong on the panel.
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PopoverProps>(), {
  offset: 4,
  alignOffset: 0,
  closeOnEscape: true,
  width: '16rem'
})

const emit = defineEmits<{ show: []; hide: [] }>()

const attrs = useAttrs()

const open = ref(false)
const anchor = ref<HTMLElement>()
// What was clicked to open it; clicks on it toggle the popover rather than counting as outside.
const opener = ref<HTMLElement>()
const label = ref<string>()
// A press outside closes it and leaves focus to what was pressed.
let pressedOutside = false

/** Opens below the event's element, or below `target` when given. */
function show(event: Event, target?: HTMLElement) {
  opener.value = event.currentTarget as HTMLElement
  anchor.value = target ?? opener.value
  // A dialog needs a name: an aria-label given to the popover, or else the name of the element it opened from.
  label.value =
    (attrs['aria-label'] as string | undefined) ??
    opener.value?.getAttribute('aria-label') ??
    opener.value?.textContent?.trim()
  pressedOutside = false
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
  else pressedOutside = true
}

function onEscape(event: KeyboardEvent) {
  if (!props.closeOnEscape) event.preventDefault()
}

// Otherwise focus left in the panel goes back to the anchor.
function onCloseAutoFocus(event: Event) {
  event.preventDefault()
  const active = document.activeElement
  const inPanel = !active || active === document.body || (event.target as HTMLElement).contains(active)
  if (inPanel && !pressedOutside) anchor.value?.focus()
}

// Focus goes to an [autofocus] element inside, or else the panel, so Tab moves through it and Escape works at once.
// The event comes from Reka's positioning wrapper around the panel.
function onOpenAutoFocus(event: Event) {
  event.preventDefault()
  const wrapper = event.target as HTMLElement | null
  const panel = wrapper?.querySelector<HTMLElement>('[role="dialog"]')
  ;(panel?.querySelector<HTMLElement>('[autofocus]') ?? panel)?.focus()
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
        class="z-[1100] block max-h-(--reka-popover-content-available-height) origin-center overflow-y-auto rounded-lg border border-sui-line-subtle bg-sui-surface text-sui-ink shadow-xl data-[state=closed]:animate-sui-overlay-out data-[state=open]:animate-sui-overlay-in"
        :collision-padding="8"
        side="bottom"
        :side-offset="offset"
        :style="{ width }"
        @close-auto-focus="onCloseAutoFocus"
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
