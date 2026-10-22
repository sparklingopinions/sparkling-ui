<script setup lang="ts">
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuSeparator,
  ContextMenuTrigger
} from 'reka-ui'

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

export interface ContextMenuProps extends MenuConfirmLabels {
  items?: DropdownMenuEntry[]
  /** The menu's accessible name, e.g. "Post actions". */
  label?: string
  /** Lets the browser's own menu through. */
  disabled?: boolean
}

const props = withDefaults(defineProps<ContextMenuProps>(), {
  ...menuConfirmDefaults,
  items: () => [],
  label: undefined
})

const emit = defineEmits<{
  'click-item': [item: DropdownMenuAction & { id?: string }]
  'update:open': [open: boolean]
  show: []
  hide: []
}>()

const select = useMenuSelect(props, (item) => emit('click-item', item))

function onOpenChange(open: boolean) {
  emit('update:open', open)
  if (open) emit('show')
  else emit('hide')
}

// Shift+F10 and the Menu key open it at the focused element. Browsers fire `contextmenu` for these only on some
// platforms, so the keys open it themselves, the way a right-click would, near the element's top left.
function onKeydown(event: KeyboardEvent) {
  if (props.disabled || !((event.key === 'F10' && event.shiftKey) || event.key === 'ContextMenu')) return
  event.preventDefault()
  const target = event.currentTarget as HTMLElement
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  target.dispatchEvent(
    new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: rect.left + 8,
      clientY: rect.top + Math.min(rect.height, 32)
    })
  )
}
</script>

<!-- DropdownMenu's items at the pointer: right-click the default slot, or Shift+F10 or the Menu key while it has focus. -->
<template>
  <ContextMenuRoot :modal="false" @update:open="onOpenChange">
    <ContextMenuTrigger as-child :disabled="disabled" @keydown="onKeydown">
      <slot />
    </ContextMenuTrigger>
    <ContextMenuPortal>
      <ContextMenuContent :aria-label="label" :class="[menuContentClass, 'min-w-48']" :collision-padding="8">
        <template v-for="(item, index) in items" :key="index">
          <ContextMenuSeparator v-if="item.type === 'separator'" :class="menuSeparatorClass" />
          <ContextMenuItem v-else :class="menuItemClass" @select="select(item)">
            <MenuItemContent :item="item" />
          </ContextMenuItem>
        </template>
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>
