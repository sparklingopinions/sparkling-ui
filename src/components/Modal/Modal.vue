<script setup lang="ts">
import { computed, useSlots } from 'vue'

import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui'

import Button from '../Button/Button.vue'
import Icon from '../Icon/Icon.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import CloseIcon from '../internal/CloseIcon.vue'
import { focusFirst } from './focus'

export interface ModalProps {
  title?: string
  /** The close button in the header. */
  closable?: boolean
  closeLabel?: string
  cancelLabel?: string
  /** Shows the standard footer's confirm button, which emits `confirm`, as ⌘ or Ctrl Enter does. */
  confirmLabel?: string
  confirmIcon?: string
  confirmVariant?: 'primary' | 'danger' | 'contrast'
  confirmDisabled?: boolean
  /** sm 432px, md 512px, record 520px (the default with a band), lg 672px, xl 768px. */
  size?: 'sm' | 'md' | 'record' | 'lg' | 'xl'
  /** A record form's tinted header band: a CSS colour such as `rgb(var(--sui-hue-blue-soft))`, or `true` for the accent
   *  wash. The `hero` slot sits centred in it. */
  band?: string | boolean
  /** Muted text at the footer's start, e.g. `saveHint()`. */
  hint?: string
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
  confirmVariant: 'primary',
  size: undefined,
  band: undefined,
  hint: undefined
})

const emit = defineEmits<{ confirm: []; cancel: [] }>()

const open = defineModel<boolean>('open', { default: false })

const slots = useSlots()
const hasFooter = computed(() => !!slots.footer || !!props.confirmLabel)
const banded = computed(() => !!props.band || !!slots.hero)

const sizes = {
  sm: 'max-w-[27rem]',
  md: 'max-w-lg',
  record: 'max-w-130',
  lg: 'max-w-2xl',
  xl: 'max-w-3xl'
}
const width = computed(() => sizes[props.size ?? (banded.value ? 'record' : 'md')])
const bandColour = computed(() => (typeof props.band === 'string' ? props.band : 'rgb(var(--sui-accent-wash))'))

const iconColours = { primary: 'on-accent', danger: 'on-danger', contrast: 'on-contrast' } as const

function cancel() {
  emit('cancel')
  open.value = false
}

function confirmFromKeyboard(event: KeyboardEvent) {
  if (!event.metaKey && !event.ctrlKey) return
  event.preventDefault()
  if (props.confirmLabel && !props.confirmDisabled) emit('confirm')
}
</script>

<!-- The one dialog: a header, body and canvas footer; or, with a `band` or `hero`, a record form under a tinted band. -->
<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-[1100] flex items-center justify-center bg-sui-scrim/40 backdrop-blur-[4px] data-[state=closed]:animate-sui-scrim-out data-[state=open]:animate-sui-scrim-in"
      >
        <DialogContent
          :aria-describedby="undefined"
          class="flex max-h-[90vh] w-full flex-col bg-sui-surface shadow-xl outline-hidden data-[state=closed]:animate-sui-dialog-out data-[state=open]:animate-sui-dialog-in"
          :class="[width, banded ? 'rounded-2xl' : 'rounded-xl']"
          @escape-key-down="emit('cancel')"
          @interact-outside.prevent
          @keydown.enter="confirmFromKeyboard"
          @open-auto-focus="focusFirst"
        >
          <div
            v-if="banded"
            class="shrink-0 rounded-t-2xl pt-3.5 pr-3.5 pb-4.5 pl-5 transition-colors duration-200"
            data-modal-header
            :style="{ backgroundColor: bandColour }"
          >
            <div class="flex items-center justify-between gap-3">
              <DialogTitle class="text-13 leading-5 font-medium text-sui-ink-body">{{ title }}</DialogTitle>
              <Tooltip v-if="closable" :text="closeLabel">
                <Button :aria-label="closeLabel" class="shrink-0" icon-only size="sm" variant="ghost" @click="cancel">
                  <CloseIcon class="fill-sui-ink-muted stroke-sui-ink-muted" />
                </Button>
              </Tooltip>
            </div>
            <div v-if="$slots.hero" class="mt-0.5 flex flex-col items-center gap-1.5 pr-1.5">
              <slot name="hero" />
            </div>
          </div>
          <div
            v-else-if="!headerless"
            class="flex shrink-0 items-center justify-between gap-3 rounded-t-xl border-b border-sui-line-subtle bg-sui-surface px-5 py-4 text-sui-ink"
            data-modal-header
          >
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
          <DialogTitle v-else class="sr-only">{{ title }}</DialogTitle>

          <div
            class="overflow-y-auto bg-sui-surface text-sm text-sui-ink-emphasis"
            :class="[banded ? 'px-5 pt-0.5 pb-4' : 'p-5', !hasFooter && (banded ? 'rounded-b-2xl' : 'rounded-b-xl')]"
            data-modal-body
          >
            <slot />
          </div>

          <div
            v-if="hasFooter"
            class="flex shrink-0 items-center border-t border-sui-line-subtle bg-sui-canvas text-sui-ink"
            :class="banded ? 'gap-2 rounded-b-2xl py-3 pr-4 pl-5' : 'gap-3 rounded-b-xl px-5 py-4'"
            data-modal-footer
          >
            <slot name="footer">
              <slot name="footer-start" />
              <span v-if="hint" class="min-w-0 truncate text-xs text-sui-ink-muted">{{ hint }}</span>
              <span class="flex-1" />
              <Button type="button" variant="ghost" @click="cancel">{{ cancelLabel }}</Button>
              <Button :disabled="confirmDisabled" type="button" :variant="confirmVariant" @click="emit('confirm')">
                <Icon v-if="confirmIcon" :color="iconColours[confirmVariant]" :name="confirmIcon" />
                {{ confirmLabel }}
              </Button>
            </slot>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>
