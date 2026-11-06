<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'

import Button from '../Button/Button.vue'
import DropdownMenu from '../DropdownMenu/DropdownMenu.vue'
import Icon from '../Icon/Icon.vue'
import Kbd from '../Kbd/Kbd.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import CloseIcon from '../internal/CloseIcon.vue'

export interface ActionBarOption {
  label: string
  /** Passed back as the action's `value`. */
  value: unknown
  icon?: string
  disabled?: boolean
}

export interface ActionBarAction {
  label: string
  /** Passed back with `click-item`, to tell the actions apart. */
  action?: string
  icon?: string
  variant?: 'danger'
  disabled?: boolean
  /** Why it's disabled, as its tooltip, e.g. "None of these are archived". */
  disabledReason?: string
  /** A single key that runs it while records are selected (not while typing, with a modifier, or with a dialog or menu
   *  open), shown on the button. Not for an action with `options`. */
  shortcut?: string
  /** Makes it a menu: picking one emits `click-item` with that option's `value`, e.g. Set status › Done. */
  options?: ActionBarOption[]
  [key: string]: unknown
}

export interface ActionBarProps {
  /** How many records are selected; it shows only while there are some. */
  count: number
  /** Two or three; put the rest in an DropdownMenu in the default slot. */
  actions?: ActionBarAction[]
  /** Adds a clear button, and Escape clears (`@clear`). */
  onClear?: () => void
  /** `{count}` is the number selected. */
  label?: string
  clearLabel?: string
  /** Fixed to the foot of the viewport. False draws it in place. */
  floating?: boolean
}

const props = withDefaults(defineProps<ActionBarProps>(), {
  actions: () => [],
  onClear: undefined,
  label: '{count} selected',
  clearLabel: 'Clear selection',
  floating: true
})

const emit = defineEmits<{ 'click-item': [action: ActionBarAction & { value?: unknown }] }>()

defineSlots<{
  /** More controls after the actions, e.g. an DropdownMenu. */
  default?: () => unknown
}>()

const text = computed(() => props.label.replace('{count}', String(props.count)))

const menuItems = (item: ActionBarAction) =>
  (item.options ?? []).map((option, index) => ({
    type: 'action' as const,
    label: option.label,
    action: String(index),
    icon: option.icon,
    disabled: option.disabled
  }))
const pick = (item: ActionBarAction, index: string | undefined) => {
  const option = item.options?.[Number(index)]
  if (option) emit('click-item', { ...item, value: option.value })
}

const typing = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  !!target.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]')

// Escape clears the selection and an action's key runs it, unless a dialog or menu is open and takes the key.
function onKeydown(event: KeyboardEvent) {
  if (event.defaultPrevented || document.querySelector('[role="dialog"], [role="alertdialog"], [role="menu"]')) return
  if (event.key === 'Escape') {
    props.onClear?.()
    return
  }
  if (event.metaKey || event.ctrlKey || event.altKey || typing(event.target)) return
  const item = props.actions.find(
    (a) => a.shortcut && !a.options && !a.disabled && a.shortcut.toLowerCase() === event.key.toLowerCase()
  )
  if (!item) return
  event.preventDefault()
  emit('click-item', item)
}

watch(
  () => props.count > 0 && (!!props.onClear || props.actions.some((a) => a.shortcut)),
  (listening) => {
    if (listening) document.addEventListener('keydown', onKeydown)
    else document.removeEventListener('keydown', onKeydown)
  },
  { immediate: true }
)

onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<!-- Actions on the selected records: a floating pill with the count, the actions and a clear button. -->
<template>
  <div
    v-if="count > 0"
    :aria-label="text"
    class="pointer-events-none flex justify-center"
    :class="floating && 'fixed inset-x-0 bottom-4 z-[1150]'"
    role="toolbar"
  >
    <div
      class="pointer-events-auto flex animate-sui-toast-in items-center gap-2 rounded-xl border border-sui-edge bg-sui-raised py-1.5 pr-2 pl-4 text-sm text-sui-ink shadow-(--sui-shadow-floating)"
    >
      <span aria-live="polite" class="whitespace-nowrap tabular-nums">{{ text }}</span>
      <span aria-hidden="true" class="mx-1 h-4 w-px bg-sui-line" />
      <template v-for="(item, i) in actions" :key="item.action ?? i">
        <DropdownMenu
          v-if="item.options"
          align="start"
          :items="menuItems(item)"
          :tooltip="null"
          @click-item="pick(item, $event.action)"
        >
          <template #trigger>
            <Button :disabled="item.disabled" size="sm" variant="secondary">
              <Icon v-if="item.icon" :name="item.icon" />
              {{ item.label }}
              <Icon color="ink-subtle" name="chevron-down" />
            </Button>
          </template>
        </DropdownMenu>
        <Tooltip v-else :disabled="!item.disabled || !item.disabledReason" :text="item.disabledReason">
          <Button
            :aria-keyshortcuts="item.shortcut"
            :disabled="item.disabled"
            size="sm"
            :variant="item.variant === 'danger' ? 'danger-outline' : 'secondary'"
            @click="emit('click-item', item)"
          >
            <Icon v-if="item.icon" :name="item.icon" />
            {{ item.label }}
            <Kbd v-if="item.shortcut" class="ml-0.5">{{ item.shortcut.toUpperCase() }}</Kbd>
          </Button>
        </Tooltip>
      </template>
      <slot />
      <Tooltip v-if="onClear" :text="clearLabel">
        <Button :aria-label="clearLabel" icon-only size="xs" variant="ghost" @click="onClear()">
          <CloseIcon class="fill-sui-ink-subtle stroke-sui-ink-subtle" />
        </Button>
      </Tooltip>
    </div>
  </div>
</template>
