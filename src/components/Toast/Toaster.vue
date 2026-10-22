<script setup lang="ts">
import { reactive } from 'vue'

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

export interface ToasterProps {
  /** The toast region's name for assistive tech; `{hotkey}` is F8, which focuses it. */
  label?: string
  closeLabel?: string
  /**
   * Toasts drawn in place, for docs, designs and demos, instead of the live ones fixed to the viewport. The list is
   * yours: add and remove items, and handle `close`.
   */
  preview?: ToastPreview[]
}

withDefaults(defineProps<ToasterProps>(), {
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
        class="pointer-events-auto data-[state=closed]:animate-sui-toast-out data-[state=closed]:overflow-hidden data-[state=open]:animate-sui-toast-in"
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
    <!-- A div, not Reka's default ol: the toasts are divs, so a page can draw one alone. -->
    <ToastViewport
      as="div"
      class="pointer-events-none fixed bottom-5 left-1/2 z-[1200] flex w-96 max-w-[calc(100vw-2.5rem)] -translate-x-1/2 flex-col rounded-md outline-hidden"
      data-sui-toasts
      :label="label"
    />
  </ToastProvider>
</template>
