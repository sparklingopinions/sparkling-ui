<script setup lang="ts">
import { computed, useSlots } from 'vue'

import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui'

import Button from '../Button/Button.vue'
import Icon from '../Icon/Icon.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import CloseIcon from '../internal/CloseIcon.vue'

export interface ModalProps {
  title?: string
  /** The close button in the header. */
  closable?: boolean
  closeLabel?: string
  cancelLabel?: string
  /** Shows the standard footer's primary button, which emits `confirm`. */
  confirmLabel?: string
  confirmIcon?: string
  confirmDisabled?: boolean
  size?: 'md' | 'lg' | 'xl'
  /** The body draws its own header, edge to edge. */
  headerless?: boolean
}

const props = withDefaults(defineProps<ModalProps>(), {
  title: undefined,
  closable: true,
  closeLabel: 'Close',
  cancelLabel: 'Cancel',
  confirmLabel: undefined,
  confirmIcon: undefined,
  size: 'md'
})

const emit = defineEmits<{ confirm: []; cancel: [] }>()

const open = defineModel<boolean>('open', { default: false })

const slots = useSlots()
const hasFooter = computed(() => !!slots.footer || !!props.confirmLabel)

const sizes = { md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-3xl' }

function cancel() {
  emit('cancel')
  open.value = false
}

// Focus goes to an [autofocus] field (footer first, then header, then body), as PrimeVue's did; otherwise to the
// dialog itself, so keyboard focus is inside it.
function onOpenAutoFocus(event: Event) {
  event.preventDefault()
  const dialog = event.target as HTMLElement
  const target = ['[data-modal-footer]', '[data-modal-header]', '[data-modal-body]']
    .map((part) => dialog.querySelector<HTMLElement>(`${part} [autofocus]`))
    .find(Boolean)
  ;(target ?? dialog).focus()
}
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-[1100] flex items-center justify-center bg-sui-scrim/40 backdrop-blur-[4px] data-[state=closed]:animate-sui-scrim-out data-[state=open]:animate-sui-scrim-in"
      >
        <DialogContent
          :aria-describedby="undefined"
          class="flex max-h-[90vh] w-full flex-col rounded-xl bg-sui-surface shadow-xl outline-hidden data-[state=closed]:animate-sui-dialog-out data-[state=open]:animate-sui-dialog-in"
          :class="sizes[size]"
          @escape-key-down="emit('cancel')"
          @interact-outside.prevent
          @open-auto-focus="onOpenAutoFocus"
        >
          <div
            v-if="!headerless"
            class="flex shrink-0 items-center justify-between rounded-tl-xl rounded-tr-xl border-b border-sui-line-subtle bg-sui-surface px-5 py-4 text-sui-ink"
            data-modal-header
          >
            <div class="flex w-full items-center justify-between gap-3">
              <DialogTitle class="min-w-0">
                <slot name="title">
                  <h2 v-if="title" class="truncate text-base font-semibold text-sui-ink">{{ title }}</h2>
                </slot>
              </DialogTitle>
              <Tooltip v-if="closable" :text="closeLabel">
                <Button :aria-label="closeLabel" class="shrink-0" icon-only size="sm" variant="ghost" @click="cancel">
                  <CloseIcon class="fill-sui-ink-subtle stroke-sui-ink-subtle" />
                </Button>
              </Tooltip>
            </div>
          </div>
          <DialogTitle v-else class="sr-only">{{ title }}</DialogTitle>

          <div
            class="overflow-y-auto bg-sui-surface p-5 text-sm text-sui-ink-emphasis"
            :class="!hasFooter && 'rounded-b-xl'"
            data-modal-body
          >
            <slot />
          </div>

          <div
            v-if="hasFooter"
            class="flex shrink-0 items-center justify-end gap-3 rounded-b-xl border-t border-sui-line-subtle bg-sui-canvas px-5 py-4 text-right text-sui-ink"
            data-modal-footer
          >
            <slot name="footer">
              <Button type="button" variant="ghost" @click="cancel">{{ cancelLabel }}</Button>
              <Button :disabled="confirmDisabled" type="button" variant="primary" @click="emit('confirm')">
                <Icon v-if="confirmIcon" color="on-accent" :name="confirmIcon" />
                {{ confirmLabel }}
              </Button>
            </slot>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>
