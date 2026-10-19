<script setup lang="ts">
import { computed } from 'vue'

import { type Hue, hueFor } from '../../utils/hues'

export interface AvatarProps {
  name?: string | null
  image?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'circle' | 'square'
  /** An attention dot, e.g. unread. */
  badge?: boolean
  /** Pins the colour when it means something; otherwise it comes from the name, stable per person. */
  hue?: Hue
}

const props = withDefaults(defineProps<AvatarProps>(), {
  name: undefined,
  image: undefined,
  size: 'sm',
  shape: 'circle',
  hue: undefined
})

// One uppercased initial reads cleaner than two letters.
const initial = computed(() => (props.name || '?').trim().charAt(0).toUpperCase() || '?')

const sizes = {
  xs: 'h-4 w-4 text-10',
  sm: 'h-6 w-6 text-11',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
  xl: 'h-16 w-16 text-2xl'
}

// A soft coin of one hue: tinted fill, saturated text, a hairline of the hue.
const hues: Record<Hue, string> = {
  blue: 'border-sui-hue-blue-line bg-sui-hue-blue-soft text-sui-hue-blue-ink',
  green: 'border-sui-hue-green-line bg-sui-hue-green-soft text-sui-hue-green-ink',
  orange: 'border-sui-hue-orange-line bg-sui-hue-orange-soft text-sui-hue-orange-ink',
  pink: 'border-sui-hue-pink-line bg-sui-hue-pink-soft text-sui-hue-pink-ink',
  purple: 'border-sui-hue-purple-line bg-sui-hue-purple-soft text-sui-hue-purple-ink',
  slate: 'border-sui-hue-slate-line bg-sui-hue-slate-soft text-sui-hue-slate-ink',
  red: 'border-sui-hue-red-line bg-sui-hue-red-soft text-sui-hue-red-ink',
  amber: 'border-sui-hue-amber-line bg-sui-hue-amber-soft text-sui-hue-amber-ink',
  gray: 'border-sui-line bg-sui-sunken text-sui-ink-body'
}

const shapeClass = computed(() => (props.shape === 'square' ? 'rounded-lg' : 'rounded-full'))

// A photo gets a neutral hairline, so it reads as a crisp coin too.
const colorClass = computed(() => (props.image ? 'border-sui-line-subtle' : hues[props.hue ?? hueFor(props.name)]))
</script>

<template>
  <div
    class="relative inline-flex shrink-0 items-center justify-center border font-semibold"
    :class="[sizes[size], shapeClass, colorClass]"
  >
    <img v-if="image" alt="" class="h-full w-full object-cover" :class="shapeClass" :src="image" />
    <template v-else>{{ initial }}</template>
    <span
      v-if="badge"
      class="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-sui-accent-solid ring-2 ring-sui-surface"
    />
  </div>
</template>
