<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle
} from 'reka-ui'

import { type ConfirmRequest, confirmRequest } from '../../composables/useConfirm'
import Button from '../Button/Button.vue'

export interface AlertDialogProps {
  /** Defaults for every confirmation; each call can override them. */
  confirmLabel?: string
  cancelLabel?: string
}

withDefaults(defineProps<AlertDialogProps>(), { confirmLabel: 'Confirm', cancelLabel: 'Cancel' })

// Kept while it animates out, after the request is answered. Plain buttons, not Reka's Action and Cancel: those
// close the dialog themselves, which would answer before the click does.
const shown = ref<ConfirmRequest | null>(null)
const open = computed({
  get: () => !!confirmRequest.value,
  set: (value) => !value && answer(false)
})

watch(confirmRequest, (request) => {
  if (request) shown.value = request
})

function answer(confirmed: boolean) {
  confirmRequest.value?.resolve(confirmed)
  confirmRequest.value = null
}
</script>

<template>
  <AlertDialogRoot v-model:open="open">
    <AlertDialogPortal>
      <AlertDialogOverlay
        class="fixed inset-0 z-[1100] flex items-center justify-center bg-sui-scrim/40 backdrop-blur-[4px] data-[state=closed]:animate-sui-scrim-out data-[state=open]:animate-sui-scrim-in"
      >
        <AlertDialogContent
          v-if="shown"
          class="flex w-[27rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-xl bg-sui-surface shadow-xl outline-hidden data-[state=closed]:animate-sui-dialog-out data-[state=open]:animate-sui-dialog-in"
          @open-auto-focus.prevent="($event.target as HTMLElement).focus()"
        >
          <div class="border-b border-sui-line-subtle px-5 py-4">
            <AlertDialogTitle class="truncate text-base font-semibold text-sui-ink">{{ shown.title }}</AlertDialogTitle>
          </div>
          <AlertDialogDescription class="px-5 py-5 text-sm leading-relaxed text-sui-ink-emphasis">
            {{ shown.message }}
          </AlertDialogDescription>
          <div class="flex items-center justify-end gap-3 border-t border-sui-line-subtle bg-sui-canvas px-5 py-4">
            <Button type="button" :variant="shown.cancelVariant ?? 'ghost'" @click="answer(false)">
              {{ shown.cancelLabel ?? cancelLabel }}
            </Button>
            <Button type="button" :variant="shown.confirmVariant ?? 'primary'" @click="answer(true)">
              {{ shown.confirmLabel ?? confirmLabel }}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
