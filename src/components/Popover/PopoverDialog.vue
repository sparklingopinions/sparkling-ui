<script setup lang="ts">
import {
  type ComponentPublicInstance,
  type MaybeRef,
  computed,
  onBeforeUnmount,
  ref,
  shallowRef,
  toValue,
  useSlots,
  watch
} from 'vue'

import { PopoverAnchor, PopoverContent, PopoverPortal, PopoverRoot } from 'reka-ui'

import Button from '../Button/Button.vue'
import Dialog from '../Dialog/Dialog.vue'
import { type FilterTriggerProps, useCustomTrigger } from '../Filters/trigger'

export type PopoverDialogTriggerProps = FilterTriggerProps

export interface PopoverDialogProps {
  title: string
  /** What it opens under on the desktop: an element, a component, or a ref to one. Without it, the `trigger` slot. */
  anchor?: MaybeRef<HTMLElement | ComponentPublicInstance | null | undefined>
  /** The popover's width in px, or a CSS width. */
  width?: number | string
  /** Shows Cancel and this confirm button in the footer; it emits `confirm`, as ⌘ or Ctrl Enter does. */
  confirmLabel?: string
  confirmDisabled?: boolean
  cancelLabel?: string
  closeLabel?: string
  /** The viewport width in px below which it's a bottom sheet. */
  sheetBelow?: number
}

const props = withDefaults(defineProps<PopoverDialogProps>(), {
  anchor: undefined,
  width: 320,
  confirmLabel: undefined,
  cancelLabel: 'Cancel',
  closeLabel: 'Close',
  sheetBelow: 640
})

const emit = defineEmits<{ confirm: []; cancel: [] }>()

const open = defineModel<boolean>('open', { default: false })

defineSlots<{
  default?: () => unknown
  /** Replaces Cancel and the confirm button. */
  footer?: () => unknown
  /** The opener, when there's no `anchor`: spread `props` on your button. */
  trigger?: (props: { props: PopoverDialogTriggerProps; open: boolean }) => unknown
}>()

const slots = useSlots()
const trigger = useCustomTrigger(open)
const triggerElement = shallowRef<HTMLElement | null>(null)
const triggerProps = computed<PopoverDialogTriggerProps>(() => ({
  ...trigger.props.value,
  ref: (node) => {
    trigger.props.value.ref(node)
    triggerElement.value = node instanceof Element ? (node as HTMLElement) : ((node?.$el as HTMLElement) ?? null)
  }
}))

const anchorElement = computed(() => {
  const value = toValue(props.anchor)
  if (value instanceof Element) return value as HTMLElement
  return (value?.$el as HTMLElement | undefined) ?? triggerElement.value ?? undefined
})

const narrow = ref(false)
let query: MediaQueryList | undefined
const onQuery = () => (narrow.value = !!query?.matches)
watch(
  () => props.sheetBelow,
  (below) => {
    query?.removeEventListener('change', onQuery)
    query =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia(`(max-width: ${below - 0.02}px)`)
        : undefined
    query?.addEventListener('change', onQuery)
    onQuery()
  },
  { immediate: true }
)
onBeforeUnmount(() => query?.removeEventListener('change', onQuery))

// A popover needs something to sit under; without one it's a small dialog, and on a phone always a sheet.
const presentation = computed(() => (narrow.value ? 'sheet' : anchorElement.value ? 'popover' : 'dialog'))

// Focus goes back to what had it when it opened (a row opened by a shortcut, a button), else the anchor; a press
// outside leaves it where it landed.
let returnTo: HTMLElement | null = null
let pressedOutside = false
watch(open, (isOpen) => {
  if (!isOpen) return
  const active = document.activeElement as HTMLElement | null
  returnTo = active && active !== document.body ? active : null
  pressedOutside = false
})

function cancel() {
  emit('cancel')
  open.value = false
}

function onOpenAutoFocus(event: Event) {
  event.preventDefault()
  const panel =
    (event.target as HTMLElement).querySelector<HTMLElement>('[role="dialog"]') ?? (event.target as HTMLElement)
  ;(panel.querySelector<HTMLElement>('[autofocus]') ?? panel).focus()
}

function onCloseAutoFocus(event: Event) {
  event.preventDefault()
  if (pressedOutside) return
  const target = returnTo?.isConnected ? returnTo : anchorElement.value
  target?.focus()
}

function onPointerDownOutside(event: CustomEvent<{ originalEvent: PointerEvent }>) {
  const target = event.detail.originalEvent.target
  if (target instanceof Node && triggerElement.value?.contains(target)) {
    event.preventDefault()
    return
  }
  pressedOutside = true
  emit('cancel')
}

function confirmFromKeyboard(event: KeyboardEvent) {
  if (!event.metaKey && !event.ctrlKey) return
  event.preventDefault()
  if (props.confirmLabel && !props.confirmDisabled) emit('confirm')
}

const panelWidth = computed(() => (typeof props.width === 'number' ? `${props.width}px` : props.width))
</script>

<!-- A small decision: a popover under its anchor on the desktop, a bottom sheet on the phone. -->
<template>
  <slot v-if="slots.trigger" name="trigger" :open="open" :props="triggerProps" />
  <PopoverRoot v-if="presentation === 'popover'" v-model:open="open">
    <PopoverAnchor :reference="anchorElement" />
    <PopoverPortal>
      <PopoverContent
        align="start"
        :aria-label="title"
        class="z-[1100] flex max-h-(--reka-popover-content-available-height) flex-col gap-2.5 overflow-y-auto rounded-lg border border-sui-line-subtle bg-sui-surface px-4 py-3.5 text-sm text-sui-ink shadow-xl outline-hidden data-[state=closed]:animate-sui-overlay-out data-[state=open]:animate-sui-overlay-in"
        :collision-padding="8"
        :data-sui-panel="trigger.panelKey"
        role="dialog"
        side="bottom"
        :side-offset="4"
        :style="{ width: panelWidth }"
        @close-auto-focus="onCloseAutoFocus"
        @escape-key-down="emit('cancel')"
        @focus-outside.prevent
        @keydown.enter="confirmFromKeyboard"
        @open-auto-focus="onOpenAutoFocus"
        @pointer-down-outside="onPointerDownOutside"
      >
        <h2 class="m-0 text-sm font-semibold text-sui-ink">{{ title }}</h2>
        <slot />
        <div v-if="$slots.footer || confirmLabel" class="flex items-center justify-end gap-2 pt-0.5">
          <slot name="footer">
            <Button size="sm" type="button" variant="ghost" @click="cancel">{{ cancelLabel }}</Button>
            <Button :disabled="confirmDisabled" size="sm" type="button" variant="primary" @click="emit('confirm')">
              {{ confirmLabel }}
            </Button>
          </slot>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
  <Dialog
    v-else
    v-model:open="open"
    :cancel-label="cancelLabel"
    :close-label="closeLabel"
    :confirm-disabled="confirmDisabled"
    :confirm-label="confirmLabel"
    :presentation="presentation === 'sheet' ? 'sheet' : 'dialog'"
    size="sm"
    :title="title"
    @cancel="emit('cancel')"
    @confirm="emit('confirm')"
  >
    <slot />
    <template v-if="$slots.footer" #footer><slot name="footer" /></template>
  </Dialog>
</template>
