<script setup lang="ts">
import { ToastProvider, ToastRoot, ToastViewport } from 'reka-ui'

import { type ToastSeverity, removeToast, toasts } from '../../composables/toast'
import ToastMessage from './ToastMessage.vue'

export interface ToastPreview {
  /** Keeps its place as the list changes, so toasts animate in and out like live ones. Defaults to its index. */
  id?: string | number
  summary: string
  detail?: string
  severity?: ToastSeverity
  closable?: boolean
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

defineEmits<{
  /** A preview toast's close button, with its `id` (or index). */
  close: [id: string | number]
}>()
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
      :closable="item.closable"
      :close-label="closeLabel"
      :detail="item.detail"
      :severity="item.severity"
      :summary="item.summary"
      @close="$emit('close', item.id ?? index)"
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
      @update:open="(open) => !open && removeToast(item.id)"
    >
      <ToastMessage
        class="pointer-events-auto data-[state=closed]:animate-sui-toast-out data-[state=closed]:overflow-hidden data-[state=open]:animate-sui-toast-in"
        :closable="item.closable"
        :close-label="closeLabel"
        :detail="item.detail"
        :severity="item.severity"
        :summary="item.summary"
        @close="removeToast(item.id)"
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
