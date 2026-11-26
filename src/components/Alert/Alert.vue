<script setup lang="ts">
import { computed } from 'vue'

import Icon from '../Icon/Icon.vue'
import type { IconColor } from '../Icon/colors'

export type AlertTone = 'danger' | 'warning' | 'success' | 'info' | 'neutral'

export interface AlertProps {
  tone?: AlertTone
  /** An icon in the tone's colour, on the first line; without one, the banner shows a dot. */
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

// A link in the actions takes the tone's ink, which holds 4.5:1 on its ground where the accent doesn't.
const tones: Record<AlertTone, { bar: string; line: string; icon: IconColor; dot: string; link: string }> = {
  danger: {
    bar: 'bg-sui-danger-soft',
    line: 'border-sui-danger-line',
    icon: 'danger',
    dot: 'bg-sui-danger-solid',
    link: '[&_[data-link]]:text-sui-danger [&_[data-link]_svg]:stroke-sui-danger'
  },
  success: {
    bar: 'bg-sui-success-soft',
    line: 'border-sui-success-line',
    icon: 'success-mid',
    dot: 'bg-sui-success-mid',
    link: '[&_[data-link]]:text-sui-success [&_[data-link]_svg]:stroke-sui-success'
  },
  warning: {
    bar: 'bg-sui-warning-soft',
    line: 'border-sui-warning-line',
    icon: 'warning-mid',
    dot: 'bg-sui-warning-mid',
    link: '[&_[data-link]]:text-sui-warning [&_[data-link]_svg]:stroke-sui-warning'
  },
  info: {
    bar: 'bg-sui-accent-soft',
    line: 'border-sui-accent-line',
    icon: 'accent',
    dot: 'bg-sui-accent-solid',
    link: ''
  },
  neutral: {
    bar: 'bg-sui-canvas',
    line: 'border-sui-line-subtle',
    icon: 'ink-muted',
    dot: 'bg-sui-mark-faint',
    link: ''
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
        ? ['flex w-full gap-2.5 rounded-xl border px-4.5 py-4', tone.line]
        : 'flex w-full gap-3 border-b border-sui-line-subtle px-6 py-3'
    ]"
  >
    <slot v-if="$slots.leading" name="leading" />
    <!-- The icon, dot and dismiss centre on the text's first line (20px) when it starts at the top. -->
    <span v-else-if="icon" class="flex h-5 shrink-0 items-center">
      <Icon class="h-4 w-4" :color="tone.icon" :name="icon" />
    </span>
    <span v-else class="h-1.5 w-1.5 shrink-0 rounded-full" :class="[tone.dot, start && 'mt-[7px]']" />

    <div class="min-w-0 flex-1 text-sm leading-5 text-sui-ink-body">
      <p v-if="title" class="m-0 font-semibold text-sui-ink">{{ title }}</p>
      <div :class="title && 'mt-0.5'"><slot /></div>
      <div v-if="below && $slots.action" class="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2" :class="tone.link">
        <slot name="action" />
      </div>
    </div>

    <div v-if="!below && $slots.action" class="shrink-0" :class="tone.link">
      <slot name="action" />
    </div>

    <button
      v-if="dismissible"
      :aria-label="dismissLabel"
      class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-sui-ink-faint transition-colors hover:bg-sui-fill-hover hover:text-sui-ink-body focus-visible:sui-ring"
      :class="start && '-mt-0.5'"
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
