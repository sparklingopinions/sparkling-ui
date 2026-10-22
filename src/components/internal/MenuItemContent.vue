<script setup lang="ts">
import Icon from '../Icon/Icon.vue'
import type { DropdownMenuAction } from './menu'

// Reka's item attributes come first, so a disabled item's own win over its `aria-disabled`.
defineOptions({ inheritAttrs: false })

defineProps<{ item: DropdownMenuAction; reasonId?: string }>()
</script>

<!-- One menu item as drawn: an icon, the label and a shortcut; disabled, dimmed, with its reason underneath. It's the
     menu item itself (its Reka item renders as-child). A disabled item isn't Reka's `disabled`, which arrow keys skip:
     the WAI-ARIA menu pattern keeps it reachable, and the menu's `select` ignores it. -->
<template>
  <div
    v-bind="$attrs"
    :aria-describedby="item.disabled && item.disabledReason ? reasonId : undefined"
    :aria-disabled="item.disabled ? 'true' : undefined"
    class="flex items-center gap-2.5 px-2.5 py-1.5"
    :class="[
      item.variant === 'danger' ? 'text-sui-danger' : 'text-sui-ink',
      item.disabled ? 'cursor-default' : 'cursor-pointer'
    ]"
  >
    <Icon
      v-if="item.icon"
      class="h-4 w-4 shrink-0"
      :class="item.disabled && 'opacity-50'"
      :color="item.variant === 'danger' ? 'danger' : 'ink-muted'"
      :name="item.icon"
    />
    <span class="flex min-w-0 flex-1 flex-col">
      <span class="text-13" :class="item.disabled && 'opacity-50'">{{ item.label }}</span>
      <span v-if="item.disabled && item.disabledReason" :id="reasonId" class="text-xs text-sui-ink-muted">{{
        item.disabledReason
      }}</span>
    </span>
    <span v-if="item.shortcut" class="text-11 text-sui-ink-muted" :class="item.disabled && 'opacity-50'">{{
      item.shortcut
    }}</span>
  </div>
</template>
