<script setup lang="ts">
import { useId } from 'vue'

import Badge from '../Badge/Badge.vue'
import Button from '../Button/Button.vue'

export interface PricingCardProps {
  /** The plan's name; it labels the card and finishes the button's accessible name. */
  name: string
  /** Already formatted, with its currency. */
  price: string
  /** What the price covers, under it: the billing period, taxes. */
  period: string
  /** One line under the period. */
  description?: string
  /** A short accent pill next to the name. */
  badge?: string
  /** The recommended option: an accent border and a primary button. */
  highlighted?: boolean
  actionLabel?: string
  /** Disables the button and shows a spinner in it while the choice is being handled. */
  loading?: boolean
  disabled?: boolean
}

withDefaults(defineProps<PricingCardProps>(), {
  description: undefined,
  badge: undefined,
  actionLabel: 'Choose'
})

defineEmits<{ select: [] }>()

const nameId = useId()
</script>

<template>
  <article
    :aria-labelledby="nameId"
    class="flex flex-col rounded-xl border bg-sui-surface p-5"
    :class="highlighted ? 'border-sui-accent-line' : 'border-sui-line-subtle'"
  >
    <div class="flex flex-wrap items-center gap-2">
      <p :id="nameId" class="m-0 text-13 leading-5 text-sui-ink-muted">{{ name }}</p>
      <Badge v-if="badge" :dot="false" :label="badge" tone="accent" />
    </div>
    <p class="m-0 mt-1 text-[1.75rem] leading-9 font-semibold tracking-tight text-sui-ink tabular-nums">{{ price }}</p>
    <p class="m-0 text-13 leading-5 text-sui-ink-muted">{{ period }}</p>
    <p v-if="description" class="m-0 mt-1 text-13 leading-5 text-sui-ink-body">{{ description }}</p>
    <div class="mt-4">
      <slot name="action">
        <Button
          :aria-busy="loading ? 'true' : undefined"
          class="w-full"
          :disabled="disabled || loading"
          :variant="highlighted ? 'primary' : 'secondary'"
          @click="$emit('select')"
        >
          <svg
            v-if="loading"
            aria-hidden="true"
            class="size-4 shrink-0 origin-center animate-sui-spinner-rotate"
            viewBox="25 25 50 50"
          >
            <circle
              class="animate-sui-spinner-dash"
              cx="50"
              cy="50"
              fill="none"
              r="20"
              stroke-dasharray="89, 200"
              stroke-linecap="round"
              stroke-width="6"
            />
          </svg>
          {{ actionLabel }}<span class="sr-only">, {{ name }}</span>
        </Button>
      </slot>
    </div>
    <div v-if="$slots.default" class="mt-4">
      <slot />
    </div>
  </article>
</template>
