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
        class="fixed inset-0 z-[1160] flex items-start justify-center bg-[rgb(var(--sui-scrim)/var(--sui-scrim-alpha))] px-4 pt-(--sui-dialog-offset) pb-4 data-[state=closed]:animate-sui-scrim-out data-[state=open]:animate-sui-scrim-in"
      >
        <AlertDialogContent
          v-if="shown"
          class="flex w-[27rem] max-w-full flex-col overflow-hidden rounded-xl border border-sui-edge bg-sui-raised shadow-(--sui-shadow-floating) outline-hidden data-[state=closed]:animate-sui-dialog-out data-[state=open]:animate-sui-dialog-in"
          @open-auto-focus.prevent="($event.target as HTMLElement).focus()"
        >
          <div class="px-5 pt-4">
            <AlertDialogTitle class="truncate text-sm font-semibold text-sui-ink">{{ shown.title }}</AlertDialogTitle>
          </div>
          <AlertDialogDescription class="px-5 pt-2 pb-5 text-sm leading-relaxed text-sui-ink-emphasis">
            {{ shown.message }}
          </AlertDialogDescription>
          <div class="flex items-center justify-end gap-2.5 px-4 pb-4">
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
