<script setup lang="ts">
import { computed } from 'vue'

import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui'

import Button from '../Button/Button.vue'
import { bodyClass, focusFirst, footerClass, overlayClass, panelClass } from '../Modal/classes'
import Tooltip from '../Tooltip/Tooltip.vue'
import CloseIcon from '../internal/CloseIcon.vue'

export interface LedgerModalProps {
  title: string
  /** The band's colour, e.g. a soft hue for the record's type. */
  bandClass: string
  confirmLabel: string
  confirmDisabled?: boolean
  /** Beside the buttons; by default, how to save from the keyboard. */
  hint?: string | null
  cancelLabel?: string
  closeLabel?: string
  /** `{key}` is ⌘ on Apple devices and Ctrl elsewhere. */
  saveHint?: string
}

const props = withDefaults(defineProps<LedgerModalProps>(), {
  hint: null,
  cancelLabel: 'Cancel',
  closeLabel: 'Close',
  saveHint: '{key} Enter to save'
})

const emit = defineEmits<{ submit: [] }>()

const open = defineModel<boolean>('open', { default: false })

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
const shownHint = computed(() => props.hint ?? props.saveHint.replace('{key}', isMac ? '⌘' : 'Ctrl'))
</script>

<!-- A record's form: a tinted band with the title and a centred hero (`band` slot), ledger rows, and a footer that saves
     on ⌘ or Ctrl Enter. -->
<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay :class="overlayClass">
        <DialogContent
          :aria-describedby="undefined"
          :class="[panelClass, 'max-w-130 rounded-2xl']"
          @interact-outside.prevent
          @open-auto-focus="focusFirst"
        >
          <div :class="[bodyClass, 'rounded-t-2xl']" data-modal-body>
            <div @keydown.enter.ctrl.prevent="emit('submit')" @keydown.enter.meta.prevent="emit('submit')">
              <div
                class="-mx-5 -mt-5 rounded-t-2xl pt-3.5 pr-3.5 pb-4.5 pl-5 transition-colors duration-200"
                :class="bandClass"
              >
                <div class="flex items-center justify-between">
                  <DialogTitle class="text-13 font-medium text-sui-ink-body">{{ title }}</DialogTitle>
                  <Tooltip :text="closeLabel">
                    <Button
                      :aria-label="closeLabel"
                      icon-only
                      size="sm"
                      type="button"
                      variant="ghost"
                      @click="open = false"
                    >
                      <CloseIcon class="fill-sui-ink-muted stroke-sui-ink-muted" />
                    </Button>
                  </Tooltip>
                </div>
                <div class="mt-0.5 flex flex-col items-center gap-1.5 pr-1.5">
                  <slot name="band" />
                </div>
              </div>
              <div class="pt-0.5">
                <slot />
              </div>
            </div>
          </div>

          <div :class="[footerClass, 'gap-2 rounded-b-2xl py-3 pr-4 pl-5']" data-modal-footer>
            <!-- A quiet secondary action on the left, e.g. Delete view. -->
            <slot name="footer-start" />
            <span class="text-xs text-sui-ink-muted" :class="$slots['footer-start'] ? 'mr-1 ml-auto' : 'mr-auto'">
              {{ shownHint }}
            </span>
            <Button type="button" variant="ghost" @click="open = false">{{ cancelLabel }}</Button>
            <Button :disabled="confirmDisabled" type="button" variant="primary" @click="emit('submit')">
              {{ confirmLabel }}
            </Button>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>
