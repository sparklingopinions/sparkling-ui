<script setup lang="ts">
import { computed } from 'vue'

import { type IconColor, iconColors } from './colors'
import { resolveIcon } from './resolver'

export interface IconProps {
  name: string
  /** Its stroke and fill; without one, the icon keeps its own (or a parent's) colours. */
  color?: IconColor
  /** Names a meaningful icon for assistive tech; without one it's decorative and hidden. */
  label?: string
}

const props = defineProps<IconProps>()

const icon = computed(() => resolveIcon(props.name))
</script>

<template>
  <component
    :is="icon"
    v-if="icon"
    :key="name"
    :aria-hidden="label ? undefined : 'true'"
    :aria-label="label"
    :class="color && iconColors[color]"
    :role="label ? 'img' : undefined"
  />
</template>
