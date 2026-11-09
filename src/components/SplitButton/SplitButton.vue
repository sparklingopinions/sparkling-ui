<script setup lang="ts">
import Button from '../Button/Button.vue'
import type { ButtonSize, ButtonVariant } from '../Button/Button.vue'
import DropdownMenu from '../DropdownMenu/DropdownMenu.vue'
import type { DropdownMenuAction, DropdownMenuEntry } from '../DropdownMenu/DropdownMenu.vue'
import ChevronIcon from '../internal/ChevronIcon.vue'

export interface SplitButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  /** The other ways to do the main action, in the menu the chevron opens. */
  items?: DropdownMenuEntry[]
  /** The chevron's name and tooltip. */
  menuLabel?: string
}

const props = withDefaults(defineProps<SplitButtonProps>(), {
  variant: 'primary',
  size: 'md',
  items: () => [],
  menuLabel: 'More options'
})

// The line between the halves, quieter than the page showing through: the fill's own ink, faint (12%).
const seams: Partial<Record<ButtonVariant, string>> = {
  primary: 'border-l-sui-on-accent/12',
  contrast: 'border-l-sui-on-contrast/12',
  danger: 'border-l border-l-sui-on-danger/12'
}
// Hovering either half, the seam goes: the hovered half's own colour is the only change.
const seamOnHover = 'group-hover/split:not-data-disabled:border-l-transparent'

const emit = defineEmits<{ click: [event: MouseEvent]; 'click-item': [item: DropdownMenuAction & { id?: string }] }>()
</script>

<template>
  <div class="group/split inline-flex items-stretch" role="group">
    <!-- The main action and a chevron for its variations, touching, the chevron a pixel over so their edges become one
         line; on a filled button that line is a faint tint of its own text colour (one root, so classes fall through). -->
    <Button
      attached="end"
      :disabled="disabled"
      :size="size"
      type="button"
      :variant="variant"
      @click="emit('click', $event)"
    >
      <slot />
    </Button>
    <DropdownMenu align="end" :items="props.items" :tooltip="menuLabel" @click-item="emit('click-item', $event)">
      <template #trigger>
        <Button
          :aria-label="menuLabel"
          attached="start"
          :class="['-ml-px', seams[variant], seams[variant] && seamOnHover]"
          :disabled="disabled || !props.items.length"
          icon-only
          :size="size"
          type="button"
          :variant="variant"
        >
          <ChevronIcon direction="down" />
        </Button>
      </template>
    </DropdownMenu>
  </div>
</template>
