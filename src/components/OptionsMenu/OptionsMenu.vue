<script setup lang="ts">
import { ref } from 'vue'

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from 'reka-ui'

import { useConfirm } from '../../composables/useConfirm'
import Button from '../Button/Button.vue'
import Icon from '../Icon/Icon.vue'
import Tooltip from '../Tooltip/Tooltip.vue'

export interface OptionsMenuAction {
  type: 'action'
  label: string
  action?: string
  icon?: string
  variant?: 'danger'
  shortcut?: string
  /** Asks first, with this wording; `confirmed: true` asks with the generic wording. */
  confirm?: { message: string; title?: string; acceptLabel?: string }
  confirmed?: boolean
  [key: string]: unknown
}

export type OptionsMenuItem = OptionsMenuAction | { type: 'separator' }

export interface OptionsMenuProps {
  /** Passed back with every clicked item, e.g. the record the menu acts on. */
  id?: string
  items?: OptionsMenuItem[]
  buttonIcon?: string
  /** A label beside the icon; without one the button is icon-only, named by the tooltip. */
  buttonLabel?: string
  /** The trigger's tooltip and name; null for none. */
  tooltip?: string | null
  /** Lines the menu up with the trigger's start or end edge. */
  align?: 'start' | 'end'
  confirmTitle?: string
  confirmMessage?: string
  confirmLabel?: string
  deleteLabel?: string
  cancelLabel?: string
}

const props = withDefaults(defineProps<OptionsMenuProps>(), {
  id: undefined,
  items: () => [],
  buttonIcon: 'dot-vertical',
  buttonLabel: undefined,
  tooltip: 'More actions',
  align: 'start',
  confirmTitle: 'Are you sure?',
  confirmMessage: "This can't be undone.",
  confirmLabel: 'Confirm',
  deleteLabel: 'Delete',
  cancelLabel: 'Cancel'
})

const emit = defineEmits<{ 'click-item': [item: OptionsMenuAction & { id?: string }]; show: []; hide: [] }>()

const open = ref(false)
const confirm = useConfirm()

async function select(item: OptionsMenuAction) {
  if (item.confirm || item.confirmed) {
    const destructive = item.variant === 'danger' || item.action === 'delete'
    const confirmed = await confirm({
      title: item.confirm?.title ?? props.confirmTitle,
      message: item.confirm?.message ?? props.confirmMessage,
      cancelLabel: props.cancelLabel,
      confirmLabel: item.confirm?.acceptLabel ?? (item.action === 'delete' ? props.deleteLabel : props.confirmLabel),
      confirmVariant: destructive ? 'danger' : 'primary'
    })
    if (!confirmed) return
  }
  emit('click-item', { id: props.id, ...item })
}

function onOpenChange(value: boolean) {
  open.value = value
  if (value) emit('show')
  else emit('hide')
}
</script>

<template>
  <div>
    <!-- Not modal: the page stays live (hover, scroll) while it's open. -->
    <DropdownMenuRoot :modal="false" :open="open" @update:open="onOpenChange">
      <!-- The tooltip inside the menu's trigger: Reka's anchors attach to the nearest popper, which must be the menu's. -->
      <DropdownMenuTrigger as-child>
        <Tooltip :disabled="!tooltip || open" :text="tooltip ?? undefined">
          <slot name="trigger" :open="open">
            <Button
              :aria-label="buttonLabel ? undefined : (tooltip ?? undefined)"
              :icon-only="!buttonLabel"
              size="sm"
              type="button"
              variant="ghost"
              @click.stop
            >
              <span v-if="buttonLabel">{{ buttonLabel }}</span>
              <Icon v-if="buttonIcon" color="ink-subtle" :name="buttonIcon" />
            </Button>
          </slot>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          :align="align"
          class="z-[1000] min-w-[max(12rem,var(--reka-dropdown-menu-trigger-width))] rounded-xl border border-sui-line-subtle bg-sui-surface p-1 shadow-lg outline-hidden data-[state=open]:animate-sui-menu-in"
          side="bottom"
        >
          <template v-for="(item, index) in items" :key="index">
            <DropdownMenuSeparator v-if="item.type === 'separator'" class="my-1 border-t border-sui-line-subtle" />
            <DropdownMenuItem
              v-else
              class="relative rounded-lg text-sm text-sui-ink transition-colors duration-150 outline-hidden hover:bg-sui-sunken focus-visible:sui-ring-inset data-highlighted:bg-sui-sunken"
              @select="select(item)"
            >
              <div
                class="flex cursor-pointer items-center gap-2.5 px-2.5 py-1.5"
                :class="item.variant === 'danger' ? 'text-sui-danger' : 'text-sui-ink'"
              >
                <Icon
                  v-if="item.icon"
                  class="h-4 w-4 shrink-0"
                  :color="item.variant === 'danger' ? 'danger' : 'ink-muted'"
                  :name="item.icon"
                />
                <span class="flex-1 text-13">{{ item.label }}</span>
                <span v-if="item.shortcut" class="text-11 text-sui-ink-muted">{{ item.shortcut }}</span>
              </div>
            </DropdownMenuItem>
          </template>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  </div>
</template>
