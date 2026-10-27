<script setup lang="ts">
import { computed } from 'vue'

export type MeterTone = 'neutral' | 'warning' | 'accent'

export interface MeterProps {
  /** How much is used. */
  value: number
  /** How much is held but not used yet, drawn after `value` in a lighter shade. */
  reserved?: number
  max: number
  /** `warning` when the limit is close; `accent` to tie the bar to the product's colour. */
  tone?: MeterTone
  /** Its accessible name. */
  label: string
  /** Read out instead of the number, e.g. "204 of 250, 46 left". */
  valueText?: string
}

const props = withDefaults(defineProps<MeterProps>(), { reserved: 0, tone: 'neutral', valueText: undefined })

// Text roles, not fills: they're the ones that hold 3:1 against the track in both modes.
const fills: Record<MeterTone, string> = {
  neutral: 'bg-sui-ink-muted',
  warning: 'bg-sui-warning',
  accent: 'bg-sui-accent'
}

const max = computed(() => Math.max(props.max, 0))
const used = computed(() => Math.min(Math.max(props.value, 0), max.value))
const held = computed(() => Math.min(Math.max(props.reserved, 0), max.value - used.value))
const percent = (amount: number) => (max.value > 0 ? `${(amount * 100) / max.value}%` : '0%')
</script>

<template>
  <div
    :aria-label="label"
    :aria-valuemax="max"
    aria-valuemin="0"
    :aria-valuenow="used + held"
    :aria-valuetext="valueText"
    class="flex h-1 w-full overflow-hidden rounded-full bg-sui-line-subtle"
    role="meter"
  >
    <div class="h-full shrink-0" :class="fills[tone]" :style="{ width: percent(used) }" />
    <div class="h-full shrink-0 opacity-40" :class="fills[tone]" :style="{ width: percent(held) }" />
  </div>
</template>
