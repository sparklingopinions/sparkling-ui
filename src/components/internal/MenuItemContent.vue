<script setup lang="ts">
import Icon from '../Icon/Icon.vue'
import type { DropdownMenuAction } from './menu'

defineProps<{ item: DropdownMenuAction }>()
</script>

<!-- One menu item as drawn: an icon, the label and a shortcut. -->
<template>
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
</template>
