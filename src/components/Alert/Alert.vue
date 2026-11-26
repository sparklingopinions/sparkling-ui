<script setup lang="ts">
import { computed } from 'vue'

import Icon from '../Icon/Icon.vue'
import type { IconColor } from '../Icon/colors'

export type AlertTone = 'danger' | 'warning' | 'success' | 'info' | 'neutral'

export interface AlertProps {
  tone?: AlertTone
  /** An icon for the tile; without one, the banner shows a dot. */
  icon?: string
  dismissible?: boolean
  /** The dismiss button's accessible name. */
  dismissLabel?: string
  /** A rounded notice inside a card or form, instead of a full-width bar. */
  inset?: boolean
  /** Where the icon, dot and dismiss sit beside the text: centred on it, or on its first line for text that wraps. */
  align?: 'center' | 'start'
  /** A short line above the text, in the ink's strongest weight: what happened, with the text saying what it means. */
  title?: string
  /** Where the action slot sits: at the end of the row, or under the text, so it never squeezes text that wraps. */
  actionPlacement?: 'end' | 'below'
}

const props = withDefaults(defineProps<AlertProps>(), {
  tone: 'warning',
  icon: undefined,
  dismissLabel: 'Dismiss',
  align: 'center',
  title: undefined,
  actionPlacement: 'end'
})

defineEmits<{ dismiss: [] }>()

// The tile is a soft filled chip, its alpha tuned so each tone reads with equal weight on its own tinted ground.
const tones: Record<AlertTone, { bar: string; line: string; tile: string; icon: IconColor; dot: string }> = {
  danger: {
    bar: 'bg-sui-danger-soft',
    line: 'border-sui-danger-line',
    tile: 'bg-sui-danger-solid/20',
    icon: 'danger',
    dot: 'bg-sui-danger-solid'
  },
  success: {
    bar: 'bg-sui-success-soft',
    line: 'border-sui-success-line',
    tile: 'bg-sui-success-mid/20',
    icon: 'success-mid',
    dot: 'bg-sui-success-mid'
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
// A title or an action under the text makes several lines: everything sits on the first.
const start = computed(() => props.align === 'start' || !!props.title || props.actionPlacement === 'below')
const below = computed(() => props.actionPlacement === 'below')
</script>

<template>
  <div
    :class="[
      tone.bar,
      start ? 'items-start' : 'items-center',
      inset
        ? ['flex w-full gap-2.5 rounded-xl border px-3 py-2.5', tone.line]
        : 'flex w-full gap-3 border-b border-sui-line-subtle px-6 py-3'
    ]"
  >
    <slot v-if="$slots.leading" name="leading" />
    <span v-else-if="icon" class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" :class="tone.tile">
      <Icon class="h-4 w-4" :color="tone.icon" :name="icon" />
    </span>
    <span v-else class="h-1.5 w-1.5 shrink-0 rounded-full" :class="[tone.dot, start && 'mt-[11px]']" />

    <!-- On start, padded so its first line centres on the 28px tile, where the dot and dismiss sit too. -->
    <div class="min-w-0 flex-1 text-sm leading-snug text-sui-ink-body" :class="start && 'py-1'">
      <p v-if="title" class="m-0 font-semibold text-sui-ink">{{ title }}</p>
      <div :class="title && 'mt-0.5'"><slot /></div>
      <div v-if="below && $slots.action" class="mt-2.5 flex flex-wrap gap-2">
        <slot name="action" />
      </div>
    </div>

    <div v-if="!below && $slots.action" class="shrink-0">
      <slot name="action" />
    </div>

    <button
      v-if="dismissible"
      :aria-label="dismissLabel"
      class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-sui-ink-faint transition-colors hover:bg-sui-fill-hover hover:text-sui-ink-body focus-visible:sui-ring"
      :class="start && 'mt-0.5'"
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
