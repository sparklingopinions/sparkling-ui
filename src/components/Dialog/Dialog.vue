<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useSlots, useTemplateRef, watch } from 'vue'

import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui'

import Button from '../Button/Button.vue'
import Icon from '../Icon/Icon.vue'
import Kbd from '../Kbd/Kbd.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import CloseIcon from '../internal/CloseIcon.vue'
import ContextSeparator from './ContextSeparator.vue'
import { focusFirst, modifierKey } from './focus'
import { useSheetDrag } from './useSheetDrag'

export interface DialogProps {
  title?: string
  /** The close button in the header. */
  closable?: boolean
  closeLabel?: string
  /** @deprecated A dialog has no Cancel button: Escape and the close button cancel. Kept so existing calls compile. */
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
  /** Muted text at the footer's start. The ⌘ or Ctrl Enter shortcut is drawn by the dialog next to its confirm. */
  hint?: string
  /** The body draws its own header, edge to edge. */
  headerless?: boolean
  /** sheet: a bottom sheet with a grab handle, drag to dismiss and a full-width confirm. auto: a sheet on a viewport
   *  narrower than `sheetBelow`, a dialog otherwise. A sheet draws no Cancel and no band: dragging it down, the
   *  scrim and Escape cancel. */
  presentation?: 'dialog' | 'sheet' | 'auto'
  /** The width in px below which `auto` is a sheet. */
  sheetBelow?: number
}

const props = withDefaults(defineProps<DialogProps>(), {
  title: undefined,
  closable: true,
  closeLabel: 'Close',
  cancelLabel: 'Cancel',
  confirmLabel: undefined,
  confirmIcon: undefined,
  confirmVariant: 'primary',
  size: undefined,
  band: undefined,
  hint: undefined,
  presentation: 'dialog',
  sheetBelow: 640
})

const emit = defineEmits<{ confirm: []; cancel: [] }>()

const open = defineModel<boolean>('open', { default: false })

const slots = useSlots()
const hasContext = computed(() => !!slots.context)
const modKey = modifierKey()
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

const narrow = ref(false)
let query: MediaQueryList | undefined
const onQuery = () => (narrow.value = !!query?.matches)
watch(
  () => [props.presentation, props.sheetBelow] as const,
  ([presentation, below]) => {
    query?.removeEventListener('change', onQuery)
    query =
      presentation === 'auto' && typeof window !== 'undefined'
        ? window.matchMedia(`(max-width: ${below - 0.02}px)`)
        : undefined
    query?.addEventListener('change', onQuery)
    onQuery()
  },
  { immediate: true }
)
onBeforeUnmount(() => query?.removeEventListener('change', onQuery))

const sheet = computed(() => props.presentation === 'sheet' || (props.presentation === 'auto' && narrow.value))
const panel = useTemplateRef<InstanceType<typeof DialogContent>>('panel')
const drag = useSheetDrag(
  computed(() => panel.value?.$el as HTMLElement | undefined),
  () => cancel()
)
watch(open, (isOpen) => isOpen && drag.reset())

const iconColours = { primary: 'on-accent', danger: 'on-danger', contrast: 'on-contrast' } as const

function cancel() {
  emit('cancel')
  open.value = false
}

// A sheet closes on a tap on the scrim; a dialog only from its buttons and Escape.
function onOutside(event: Event) {
  if (sheet.value) emit('cancel')
  else event.preventDefault()
}

function confirmFromKeyboard(event: KeyboardEvent) {
  if (!event.metaKey && !event.ctrlKey) return
  event.preventDefault()
  if (props.confirmLabel && !props.confirmDisabled) emit('confirm')
}
</script>

<!-- The one dialog: one raised piece with a title (after an optional `context`, such as where the thing lands), a body
     and a footer; or, with a `band` or `hero`, a record form under a tinted band; or a bottom sheet. -->
<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-[1100] flex justify-center data-[state=closed]:animate-sui-scrim-out data-[state=open]:animate-sui-scrim-in"
        :class="
          sheet
            ? 'items-end bg-sui-scrim/40 backdrop-blur-[4px]'
            : 'items-start bg-[rgb(var(--sui-scrim)/var(--sui-scrim-alpha))] px-4 pt-(--sui-dialog-offset) pb-4'
        "
      >
        <DialogContent
          v-if="sheet"
          ref="panel"
          :aria-describedby="undefined"
          class="relative flex max-h-[calc(100dvh-1.5rem)] w-full flex-col rounded-t-(--sui-radius-sheet) border border-b-0 border-sui-edge bg-sui-raised shadow-(--sui-shadow-floating) outline-hidden data-[state=closed]:animate-sui-sheet-out data-[state=open]:animate-sui-sheet-in motion-reduce:animate-none motion-reduce:transition-none"
          :class="!drag.dragging.value && 'transition-transform duration-[250ms] ease-[cubic-bezier(0.32,0.72,0,1)]'"
          :style="drag.style.value"
          @escape-key-down="emit('cancel')"
          @interact-outside="onOutside"
          @keydown.enter="confirmFromKeyboard"
          @open-auto-focus="focusFirst"
        >
          <!-- Without a close button, keyboard and screen-reader users still get one: it shows when focused. -->
          <button
            v-if="!closable"
            class="pointer-events-none absolute top-2 right-3 h-7 rounded-md bg-sui-fill px-2.5 text-13 font-medium text-sui-ink opacity-0 outline-hidden focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:sui-ring"
            type="button"
            @click="cancel"
          >
            {{ closeLabel }}
          </button>
          <div class="shrink-0 cursor-grab touch-none pt-2" data-modal-header v-bind="drag.handlers">
            <span aria-hidden="true" class="mx-auto block h-1 w-9 rounded-full bg-sui-mark-faint" />
            <div v-if="!headerless" class="flex min-h-11 items-center justify-between gap-3 pt-2 pr-4 pb-1 pl-5">
              <div class="flex min-w-0 items-center gap-1">
                <template v-if="hasContext">
                  <slot name="context" />
                  <ContextSeparator />
                </template>
                <DialogTitle class="min-w-0 truncate text-base font-semibold text-sui-ink">
                  <slot name="title">{{ title }}</slot>
                </DialogTitle>
              </div>
              <Tooltip v-if="closable" :text="closeLabel">
                <Button :aria-label="closeLabel" class="shrink-0" icon-only size="sm" variant="ghost" @click="cancel">
                  <CloseIcon class="fill-sui-ink-subtle stroke-sui-ink-subtle" />
                </Button>
              </Tooltip>
            </div>
            <DialogTitle v-else class="sr-only">{{ title }}</DialogTitle>
          </div>

          <div
            class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-2 pb-5 text-sm leading-5 text-sui-ink-emphasis"
            data-modal-body
          >
            <slot />
          </div>

          <div
            v-if="hasFooter"
            class="flex shrink-0 flex-col gap-2.5 border-t border-sui-fill-line bg-sui-raised px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            data-modal-footer
          >
            <slot name="footer">
              <div v-if="$slots['footer-start'] || hint" class="flex min-w-0 items-center justify-center gap-2">
                <slot name="footer-start" />
                <span v-if="hint" class="min-w-0 truncate text-xs text-sui-ink-muted">{{ hint }}</span>
              </div>
              <Button
                class="w-full"
                :disabled="confirmDisabled"
                size="lg"
                type="button"
                :variant="confirmVariant"
                @click="emit('confirm')"
              >
                <Icon v-if="confirmIcon" :color="iconColours[confirmVariant]" :name="confirmIcon" />
                {{ confirmLabel }}
              </Button>
            </slot>
          </div>
        </DialogContent>
        <DialogContent
          v-else
          :aria-describedby="undefined"
          class="flex max-h-[calc(100dvh-var(--sui-dialog-offset)-1rem)] w-full flex-col border border-sui-edge bg-sui-raised shadow-(--sui-shadow-floating) outline-hidden data-[state=closed]:animate-sui-dialog-out data-[state=open]:animate-sui-dialog-in"
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
            class="flex shrink-0 items-center justify-between gap-3 pt-3 pr-3 pl-4 text-sui-ink"
            data-modal-header
          >
            <div class="flex min-h-7 min-w-0 items-center gap-1">
              <template v-if="hasContext">
                <slot name="context" />
                <ContextSeparator />
              </template>
              <DialogTitle
                class="min-w-0 truncate text-sm font-semibold text-sui-ink"
                :class="hasContext ? '' : 'pl-1'"
              >
                <slot name="title">{{ title }}</slot>
              </DialogTitle>
            </div>
            <Tooltip v-if="closable" :text="closeLabel">
              <Button :aria-label="closeLabel" class="shrink-0" icon-only size="sm" variant="ghost" @click="cancel">
                <CloseIcon class="fill-sui-ink-muted stroke-sui-ink-muted" />
              </Button>
            </Tooltip>
          </div>
          <DialogTitle v-else class="sr-only">{{ title }}</DialogTitle>

          <div
            class="overflow-y-auto text-sm text-sui-ink-emphasis"
            :class="[
              banded ? 'px-5 pt-0.5 pb-4' : headerless ? 'p-5' : 'px-5 pt-3.5 pb-5',
              !hasFooter && (banded ? 'rounded-b-2xl' : 'rounded-b-xl')
            ]"
            data-modal-body
          >
            <slot />
          </div>

          <div
            v-if="hasFooter"
            class="flex shrink-0 items-center gap-2.5 text-sui-ink"
            :class="banded ? 'rounded-b-2xl py-3 pr-4 pl-5' : 'rounded-b-xl px-4 pt-1 pb-4 pl-5'"
            data-modal-footer
          >
            <slot name="footer">
              <slot name="footer-start" />
              <span v-if="hint" class="min-w-0 truncate text-xs text-sui-ink-muted">{{ hint }}</span>
              <span class="flex-1" />
              <span v-if="confirmLabel" aria-hidden="true" class="flex shrink-0 items-center gap-1">
                <Kbd>{{ modKey }}</Kbd
                ><Kbd>↵</Kbd>
              </span>
              <Button
                v-if="confirmLabel"
                :aria-keyshortcuts="modKey === '⌘' ? 'Meta+Enter' : 'Control+Enter'"
                :disabled="confirmDisabled"
                type="button"
                :variant="confirmVariant"
                @click="emit('confirm')"
              >
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
