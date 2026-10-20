<script setup lang="ts">
import type { Hue } from '../../utils/hues'
import CloseSmallIcon from '../internal/CloseSmallIcon.vue'

export interface TagProps {
  /** The text; or use the default slot. */
  name?: string
  /** soft: a label people create, with an optional hue dot, removable. outline: a value from a fixed set (a stage, a status). */
  variant?: 'soft' | 'outline'
  /** soft only: a dot of the tag's own hue, on a neutral chip. */
  color?: Hue
  /** outline only: the quieter, superseded side, e.g. the "from" of a stage change. */
  muted?: boolean
  /** soft only. */
  removable?: boolean
  /** The remove button's accessible name. */
  removeLabel?: string
}

withDefaults(defineProps<TagProps>(), {
  name: undefined,
  variant: 'soft',
  color: undefined,
  removeLabel: 'Remove tag'
})

defineEmits<{ remove: [] }>()

const dots: Record<Hue, string> = {
  blue: 'bg-sui-hue-blue-ink',
  green: 'bg-sui-hue-green-ink',
  orange: 'bg-sui-hue-orange-ink',
  pink: 'bg-sui-hue-pink-ink',
  purple: 'bg-sui-hue-purple-ink',
  slate: 'bg-sui-hue-slate-ink',
  red: 'bg-sui-hue-red-ink',
  amber: 'bg-sui-hue-amber-ink',
  gray: 'bg-sui-ink'
}
</script>

<!-- A label: soft for the ones people create, outline for a value from a fixed set. -->
<template>
  <span
    v-if="variant === 'outline'"
    class="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs whitespace-nowrap"
    :class="
      muted ? 'border-sui-line-subtle text-sui-ink-muted' : 'border-sui-line bg-sui-sunken font-medium text-sui-ink'
    "
  >
    <slot>{{ name }}</slot>
  </span>
  <div
    v-else
    class="inline-flex items-center gap-1.5 rounded-md bg-sui-sunken px-2 py-0.5 text-xs font-medium text-sui-ink-body"
  >
    <span v-if="color" class="h-1.5 w-1.5 shrink-0 rounded-full" :class="dots[color]" />
    <span class="truncate"
      ><slot>{{ name }}</slot></span
    >
    <button
      v-if="removable"
      :aria-label="removeLabel"
      class="-mr-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full transition-colors hover:bg-sui-line focus-visible:sui-ring"
      type="button"
      @click="$emit('remove')"
    >
      <CloseSmallIcon class="fill-sui-ink-muted stroke-sui-ink-muted" />
    </button>
  </div>
</template>
