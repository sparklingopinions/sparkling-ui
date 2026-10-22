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

import Button from '../Button/Button.vue'
import Icon from '../Icon/Icon.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import MenuItemContent from '../internal/MenuItemContent.vue'
import {
  type DropdownMenuAction,
  type DropdownMenuEntry,
  type MenuConfirmLabels,
  menuConfirmDefaults,
  menuContentClass,
  menuItemClass,
  menuSeparatorClass,
  useMenuSelect
} from '../internal/menu'

export type { DropdownMenuAction, DropdownMenuEntry }

export interface DropdownMenuProps extends MenuConfirmLabels {
  items?: DropdownMenuEntry[]
  buttonIcon?: string
  /** A label beside the icon; without one the button is icon-only, named by the tooltip. */
  buttonLabel?: string
  /** The trigger's tooltip and name; null for none. */
  tooltip?: string | null
  /** Lines the menu up with the trigger's start or end edge. */
  align?: 'start' | 'end'
}

const props = withDefaults(defineProps<DropdownMenuProps>(), {
  ...menuConfirmDefaults,
  items: () => [],
  buttonIcon: 'more-vertical',
  buttonLabel: undefined,
  tooltip: 'More actions',
  align: 'start'
})

const emit = defineEmits<{ 'click-item': [item: DropdownMenuAction & { id?: string }]; show: []; hide: [] }>()

const open = ref(false)
const select = useMenuSelect(props, (item) => emit('click-item', item))

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
          :class="[menuContentClass, 'min-w-[max(12rem,var(--reka-dropdown-menu-trigger-width))]']"
          side="bottom"
        >
          <template v-for="(item, index) in items" :key="index">
            <DropdownMenuSeparator v-if="item.type === 'separator'" :class="menuSeparatorClass" />
            <DropdownMenuItem v-else :class="menuItemClass" @select="select(item)">
              <MenuItemContent :item="item" />
            </DropdownMenuItem>
          </template>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  </div>
</template>
