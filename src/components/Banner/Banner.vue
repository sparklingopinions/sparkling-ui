<script setup lang="ts">
import { computed } from 'vue'

import Icon from '../Icon/Icon.vue'
import type { IconColor } from '../Icon/colors'

export type BannerTone = 'danger' | 'warning' | 'info' | 'neutral'

export interface BannerProps {
  tone?: BannerTone
  /** An icon for the tile; without one, the banner shows a dot. */
  icon?: string
  dismissible?: boolean
  /** The dismiss button's accessible name. */
  dismissLabel?: string
  /** A rounded notice inside a card or form, instead of a full-width bar. */
  inset?: boolean
}

const props = withDefaults(defineProps<BannerProps>(), { tone: 'warning', icon: undefined, dismissLabel: 'Dismiss' })

defineEmits<{ dismiss: [] }>()

// The tile is a soft filled chip, its alpha tuned so each tone reads with equal weight on its own tinted ground.
const tones: Record<BannerTone, { bar: string; line: string; tile: string; icon: IconColor; dot: string }> = {
  danger: {
    bar: 'bg-sui-danger-soft',
    line: 'border-sui-danger-line',
    tile: 'bg-sui-danger-solid/20',
    icon: 'danger',
    dot: 'bg-sui-danger-solid'
  },
  warning: {
    bar: 'bg-sui-warning-soft',
    line: 'border-sui-warning-line',
    tile: 'bg-sui-warning-bright/20',
    icon: 'warning-mid',
    dot: 'bg-sui-warning-mid'
  },
  info: {
    bar: 'bg-sui-accent-soft',
    line: 'border-sui-accent-line',
    tile: 'bg-sui-accent-solid/20',
    icon: 'accent',
    dot: 'bg-sui-accent-solid'
  },
  neutral: {
    bar: 'bg-sui-canvas',
    line: 'border-sui-line-subtle',
    tile: 'bg-sui-line-subtle',
    icon: 'ink-muted',
    dot: 'bg-sui-mark-faint'
  }
}

const tone = computed(() => tones[props.tone])
</script>

<template>
  <div
    :class="[
      tone.bar,
      inset
        ? ['flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5', tone.line]
        : 'flex w-full items-center gap-3 border-b border-sui-line-subtle px-6 py-3'
    ]"
  >
    <slot v-if="$slots.leading" name="leading" />
    <span v-else-if="icon" class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" :class="tone.tile">
      <Icon class="h-4 w-4" :color="tone.icon" :name="icon" />
    </span>
    <span v-else class="h-1.5 w-1.5 shrink-0 rounded-full" :class="tone.dot" />

    <div class="min-w-0 flex-1 text-sm leading-snug text-sui-ink-body">
      <slot />
    </div>

    <div v-if="$slots.action" class="shrink-0">
      <slot name="action" />
    </div>

    <button
      v-if="dismissible"
      :aria-label="dismissLabel"
      class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-sui-ink-faint transition-colors hover:bg-sui-sunken hover:text-sui-ink-body focus-visible:sui-ring"
      type="button"
      @click="$emit('dismiss')"
    >
      <svg
        aria-hidden="true"
        class="h-3 w-3"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="1.5"
        viewBox="0 0 12 12"
      >
        <path d="M9 3 3 9M3 3l6 6" />
      </svg>
    </button>
  </div>
</template>
