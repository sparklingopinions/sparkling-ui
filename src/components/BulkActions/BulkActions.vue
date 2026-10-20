<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'

import Button from '../Button/Button.vue'
import Icon from '../Icon/Icon.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import CloseIcon from '../internal/CloseIcon.vue'

export interface BulkAction {
  label: string
  /** Passed back with `click-item`, to tell the actions apart. */
  action?: string
  icon?: string
  variant?: 'danger'
  disabled?: boolean
  [key: string]: unknown
}

export interface BulkActionsProps {
  /** How many records are selected; it shows only while there are some. */
  count: number
  /** Two or three; put the rest in an OptionsMenu in the default slot. */
  actions?: BulkAction[]
  /** Adds a clear button, and Escape clears (`@clear`). */
  onClear?: () => void
  /** `{count}` is the number selected. */
  label?: string
  clearLabel?: string
  /** Fixed to the foot of the viewport. False draws it in place. */
  floating?: boolean
}

const props = withDefaults(defineProps<BulkActionsProps>(), {
  actions: () => [],
  onClear: undefined,
  label: '{count} selected',
  clearLabel: 'Clear selection',
  floating: true
})

const emit = defineEmits<{ 'click-item': [action: BulkAction] }>()

defineSlots<{
  /** More controls after the actions, e.g. an OptionsMenu. */
  default?: () => unknown
}>()

const text = computed(() => props.label.replace('{count}', String(props.count)))

// Escape clears the selection, unless a dialog is open and takes it.
function onKeydown(event: KeyboardEvent) {
  if (
    event.key !== 'Escape' ||
    event.defaultPrevented ||
    document.querySelector('[role="dialog"], [role="alertdialog"]')
  )
    return
  props.onClear?.()
}

watch(
  () => props.count > 0 && !!props.onClear,
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
      class="pointer-events-auto flex animate-sui-toast-in items-center gap-2 rounded-2xl border border-sui-line-subtle bg-sui-surface py-1.5 pr-2 pl-4 text-sm text-sui-ink shadow-md"
    >
      <span aria-live="polite" class="whitespace-nowrap tabular-nums">{{ text }}</span>
      <span aria-hidden="true" class="mx-1 h-4 w-px bg-sui-line" />
      <Button
        v-for="(item, i) in actions"
        :key="item.action ?? i"
        :disabled="item.disabled"
        size="sm"
        :variant="item.variant === 'danger' ? 'danger-outline' : 'secondary'"
        @click="emit('click-item', item)"
      >
        <Icon v-if="item.icon" :name="item.icon" />
        {{ item.label }}
      </Button>
      <slot />
      <Tooltip v-if="onClear" :text="clearLabel">
        <Button :aria-label="clearLabel" icon-only size="xs" variant="ghost" @click="onClear()">
          <CloseIcon class="fill-sui-ink-subtle stroke-sui-ink-subtle" />
        </Button>
      </Tooltip>
    </div>
  </div>
</template>
