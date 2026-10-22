<script setup lang="ts">
import { computed, reactive } from 'vue'

import { ToastProvider, ToastRoot, ToastViewport } from 'reka-ui'

import {
  type ToastAction,
  type ToastDismissReason,
  type ToastSeverity,
  removeToast,
  toastActions,
  toasts
} from '../../composables/toast'
import ToastMessage from './ToastMessage.vue'

export interface ToastPreview {
  /** Keeps its place as the list changes, so toasts animate in and out like live ones. Defaults to its index. */
  id?: string | number
  summary: string
  detail?: string
  severity?: ToastSeverity
  closable?: boolean
  action?: ToastAction
  actions?: ToastAction[]
  /** With actions, the countdown bar's length in ms; it emits `close` with `timeout` when it runs out. */
  life?: number
}

export type ToasterPosition = 'bottom-center' | 'bottom-left' | 'bottom-right' | 'top-center' | 'top-left' | 'top-right'

export interface ToasterProps {
  /** Where live toasts sit. Move them clear of the app's own chrome with the `--sui-toaster-inset-*` tokens. */
  position?: ToasterPosition
  /** The toast region's name for assistive tech; `{hotkey}` is F8, which focuses it. */
  label?: string
  closeLabel?: string
  /**
   * Toasts drawn in place, for docs, designs and demos, instead of the live ones fixed to the viewport. The list is
   * yours: add and remove items, and handle `close`.
   */
  preview?: ToastPreview[]
}

const props = withDefaults(defineProps<ToasterProps>(), {
  position: 'bottom-center',
  label: 'Notifications ({hotkey})',
  closeLabel: 'Close',
  preview: undefined
})

const emit = defineEmits<{
  /** A preview toast left, with its `id` (or index): its close button, one of its actions, or its countdown. */
  close: [id: string | number, reason: ToastDismissReason]
}>()

// Reka pauses every toast's timer while the region is hovered or focused, or the window is in the background; the
// countdown bars follow it.
const paused = reactive(new Set<number>())

// The region sits `--sui-toaster-margin` in from the viewport's edges plus the app's insets, and the safe area
// beyond them; centred, it centres in what's left between the side insets.
const side = (edge: 'left' | 'right') => `calc(var(--sui-toaster-margin) + var(--sui-toaster-inset-${edge}))`
const placement = computed(() => {
  const [vertical, horizontal] = props.position.split('-') as ['top' | 'bottom', 'left' | 'center' | 'right']
  return {
    [vertical]: `calc(var(--sui-toaster-margin) + var(--sui-toaster-inset-${vertical}) + env(safe-area-inset-${vertical}))`,
    left: horizontal === 'right' ? 'auto' : side('left'),
    right: horizontal === 'left' ? 'auto' : side('right'),
    width: `min(var(--sui-toaster-width), 100vw - ${side('left')} - ${side('right')})`
  }
})
const fromTop = computed(() => props.position.startsWith('top'))

function runLive(id: number, action: ToastAction) {
  action.onClick()
  removeToast(id, 'action')
}

function runPreview(id: string | number, action: ToastAction) {
  action.onClick()
  emit('close', id, 'action')
}
</script>

<!-- Mount once near the app root; `toast.info(...)` and friends show here. Swiping is off. -->
<template>
  <TransitionGroup
    v-if="preview"
    class="flex w-full max-w-96 flex-col"
    enter-active-class="animate-sui-toast-in"
    leave-active-class="animate-sui-toast-out overflow-hidden"
    tag="div"
  >
    <ToastMessage
      v-for="(item, index) in preview"
      :key="item.id ?? index"
      :actions="toastActions(item)"
      :closable="item.closable"
      :close-label="closeLabel"
      :detail="item.detail"
      :life="item.life"
      :severity="item.severity"
      :summary="item.summary"
      @action="runPreview(item.id ?? index, $event)"
      @close="emit('close', item.id ?? index, 'close')"
      @expire="emit('close', item.id ?? index, 'timeout')"
    />
  </TransitionGroup>
  <ToastProvider v-else :swipe-threshold="Number.POSITIVE_INFINITY">
    <ToastRoot
      v-for="item in toasts"
      :key="item.id"
      as-child
      :duration="item.life || Number.POSITIVE_INFINITY"
      :open="item.open"
      :type="item.severity === 'error' ? 'foreground' : 'background'"
      @escape-key-down="removeToast(item.id, 'close')"
      @pause="paused.add(item.id)"
      @resume="paused.delete(item.id)"
      @update:open="(open) => !open && removeToast(item.id, 'timeout')"
    >
      <ToastMessage
        :actions="item.actions"
        class="pointer-events-auto data-[state=closed]:overflow-hidden data-[state=closed]:animate-sui-toast-out motion-reduce:data-[state=closed]:animate-sui-toast-fade"
        :class="
          fromTop
            ? 'data-[state=open]:animate-sui-toast-in-top motion-reduce:data-[state=open]:animate-sui-fade-in'
            : 'data-[state=open]:animate-sui-toast-in motion-reduce:data-[state=open]:animate-sui-fade-in'
        "
        :closable="item.closable"
        :close-label="closeLabel"
        :detail="item.detail"
        :life="item.life"
        :paused="paused.has(item.id)"
        :severity="item.severity"
        :summary="item.summary"
        @action="runLive(item.id, $event)"
        @close="removeToast(item.id, 'close')"
      />
    </ToastRoot>
    <!-- A div, not Reka's default ol: the toasts are divs, so a page can draw one alone. From the top, the newest is
         nearest the edge, as it is at the bottom. -->
    <ToastViewport
      as="div"
      class="pointer-events-none fixed z-[1200] mx-auto flex rounded-md outline-hidden"
      :class="fromTop ? 'flex-col-reverse' : 'flex-col'"
      :data-sui-position="position"
      data-sui-toasts
      :label="label"
      :style="placement"
    />
  </ToastProvider>
</template>
