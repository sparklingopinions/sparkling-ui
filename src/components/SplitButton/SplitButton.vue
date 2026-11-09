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

const emit = defineEmits<{ click: [event: MouseEvent]; 'click-item': [item: DropdownMenuAction & { id?: string }] }>()
</script>

<template>
  <div class="inline-flex items-stretch gap-px" role="group">
    <!-- The main action and a chevron for its variations, joined by a hairline (one root, so classes fall through). -->
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
