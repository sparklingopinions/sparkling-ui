<script setup lang="ts">
import { computed } from 'vue'

export type PillTone = 'neutral' | 'accent' | 'success' | 'warning' | 'info' | 'danger'

export interface PillProps {
  tone?: PillTone
  /** `soft` is a tinted chip; `text` is a dot and a coloured label, lighter. */
  variant?: 'soft' | 'text'
  dot?: boolean
  label?: string
}

const props = withDefaults(defineProps<PillProps>(), { tone: 'neutral', variant: 'soft', dot: true, label: undefined })

const tones: Record<PillTone, { chip: string; text: string; dot: string }> = {
  neutral: { chip: 'bg-sui-sunken text-sui-ink-subtle', text: 'text-sui-ink-muted', dot: 'bg-sui-mark-faint' },
  accent: { chip: 'bg-sui-accent-wash text-sui-accent', text: 'text-sui-accent', dot: 'bg-sui-accent-solid' },
  success: {
    chip: 'bg-sui-success-soft text-sui-success',
    text: 'text-sui-success',
    dot: 'bg-sui-success-mid'
  },
  warning: {
    chip: 'bg-sui-warning-soft text-sui-warning',
    text: 'text-sui-warning',
    dot: 'bg-sui-warning-bright'
  },
  info: { chip: 'bg-sui-info-soft text-sui-info', text: 'text-sui-info', dot: 'bg-sui-info-mid' },
  danger: { chip: 'bg-sui-danger-soft text-sui-danger', text: 'text-sui-danger', dot: 'bg-sui-danger-solid' }
}

const tone = computed(() => tones[props.tone])
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap"
    :class="variant === 'soft' ? ['h-6 rounded-md px-2.5', tone.chip] : tone.text"
  >
    <span v-if="dot" class="h-1.5 w-1.5 shrink-0 rounded-full" :class="tone.dot" />
    <slot>{{ label }}</slot>
  </span>
</template>
