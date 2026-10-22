<script setup lang="ts">
import type { Hue } from '../../utils/hues'
import Icon from '../Icon/Icon.vue'
import type { IconColor } from '../Icon/colors'
import CloseSmallIcon from '../internal/CloseSmallIcon.vue'

export interface TagProps {
  /** The text; or use the default slot. */
  name?: string
  /** soft: a label people create, with an optional hue dot, removable. outline: a value from a fixed set (a stage, a status). */
  variant?: 'soft' | 'outline'
  /** soft only: a dot of the tag's own hue, on a neutral chip. */
  color?: Hue
  /** soft and outline: a 14px icon before the name, through the app's icon resolver, in place of the dot. */
  icon?: string
  /** The icon's colour; ink-subtle by default. */
  iconColor?: IconColor
  /** outline only: the quieter, superseded side, e.g. the "from" of a stage change. */
  muted?: boolean
  /** soft only. */
  removable?: boolean
  /** The remove button's accessible name. */
  removeLabel?: string
  /** A toggle button for quick choices, bound to `v-model:pressed`. Group several in a `role="group"` with a label. */
  pressable?: boolean
  /** pressable only. */
  disabled?: boolean
  /** pressable only: md is 28px, sm 22px for a dense row of filters. */
  size?: 'sm' | 'md'
}

withDefaults(defineProps<TagProps>(), {
  name: undefined,
  variant: 'soft',
  color: undefined,
  icon: undefined,
  iconColor: 'ink-subtle',
  removeLabel: 'Remove tag',
  size: 'md'
})

defineEmits<{ remove: [] }>()

const pressed = defineModel<boolean>('pressed', { default: false })

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

<!-- A label: soft for the ones people create, outline for a value from a fixed set; or, pressable, a toggle chip. -->
<template>
  <button
    v-if="pressable"
    :aria-pressed="pressed"
    class="inline-flex cursor-pointer items-center rounded-md border leading-none font-medium whitespace-nowrap transition-colors duration-150 outline-hidden focus-visible:sui-ring disabled:cursor-default disabled:opacity-50"
    :class="[
      size === 'sm' ? 'h-5.5 gap-1 px-2 text-xs' : 'h-7 gap-1.5 px-3 text-13',
      pressed
        ? 'border-sui-accent-line bg-sui-accent-wash text-sui-accent enabled:hover:border-sui-accent-bright enabled:hover:bg-sui-accent-soft enabled:active:border-sui-accent-solid enabled:active:bg-sui-accent-soft'
        : 'border-sui-line bg-sui-surface text-sui-ink-body enabled:hover:border-sui-line-strong enabled:hover:bg-sui-canvas enabled:hover:text-sui-ink enabled:active:bg-sui-sunken'
    ]"
    :disabled="disabled"
    type="button"
    @click="pressed = !pressed"
  >
    <svg
      v-if="pressed"
      aria-hidden="true"
      class="-ml-0.5 size-3 shrink-0 fill-none stroke-current"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.75"
      viewBox="0 0 16 16"
    >
      <path d="M3.5 8.25l3 3 6-6.5" />
    </svg>
    <slot>{{ name }}</slot>
  </button>
  <span
    v-else-if="variant === 'outline'"
    class="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs whitespace-nowrap"
    :class="
      muted ? 'border-sui-line-subtle text-sui-ink-muted' : 'border-sui-line bg-sui-sunken font-medium text-sui-ink'
    "
  >
    <Icon v-if="icon" class="size-3.5 shrink-0" :color="iconColor" :name="icon" />
    <slot>{{ name }}</slot>
  </span>
  <div
    v-else
    class="inline-flex items-center gap-1.5 rounded-md bg-sui-sunken px-2 py-0.5 text-xs font-medium text-sui-ink-body"
  >
    <Icon v-if="icon" class="size-3.5 shrink-0" :color="iconColor" :name="icon" />
    <span v-else-if="color" class="h-1.5 w-1.5 shrink-0 rounded-full" :class="dots[color]" />
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
