<script setup lang="ts">
import { computed } from 'vue'

import { Primitive, type PrimitiveProps } from 'reka-ui'

export type ButtonVariant = 'primary' | 'secondary' | 'tinted' | 'ghost' | 'contrast' | 'danger' | 'danger-outline'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

export interface ButtonProps extends PrimitiveProps {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Fully rounded ends. */
  pill?: boolean
  /** Square, for a single icon; give it an `aria-label`. */
  iconOnly?: boolean
  /** Where the icon sits next to the label; it's spaced from the text on the other side. */
  iconPosition?: 'start' | 'end'
  disabled?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
  as: 'button',
  variant: 'secondary',
  size: 'md',
  iconPosition: 'start'
})

const variants: Record<ButtonVariant, string> = {
  primary:
    'border border-sui-accent bg-sui-accent text-sui-on-accent not-data-disabled:hover:border-sui-accent-hover not-data-disabled:hover:bg-sui-accent-hover [&_svg]:stroke-sui-on-accent',
  secondary:
    'border border-sui-line bg-sui-surface text-sui-ink-emphasis shadow-(--sui-shadow-raised) not-data-disabled:hover:border-sui-line-strong not-data-disabled:hover:bg-sui-canvas [&_svg]:stroke-sui-ink-emphasis',
  tinted:
    'border border-sui-accent-line bg-sui-accent-wash text-sui-accent not-data-disabled:hover:bg-sui-accent-soft [&_svg]:stroke-sui-accent',
  ghost:
    'border border-transparent bg-transparent text-sui-ink-subtle not-data-disabled:hover:bg-sui-sunken not-data-disabled:hover:text-sui-ink-emphasis',
  contrast:
    'border border-sui-contrast bg-sui-contrast text-sui-on-contrast not-data-disabled:hover:border-sui-contrast-hover not-data-disabled:hover:bg-sui-contrast-hover',
  // No border, as in MustLoop: it's 2px narrower than the other variants.
  danger: 'bg-sui-danger text-sui-on-danger not-data-disabled:hover:bg-sui-danger-mid',
  'danger-outline':
    'border border-sui-danger-line bg-sui-surface text-sui-danger not-data-disabled:hover:bg-sui-danger-soft [&_svg]:stroke-sui-danger'
}

const heights: Record<ButtonSize, string> = {
  xs: 'h-6',
  sm: 'h-7',
  md: 'h-(--sui-button-height)',
  lg: 'h-12'
}

const paddings: Record<ButtonSize, string> = {
  xs: 'px-2',
  sm: 'px-2.5',
  md: 'px-(--sui-button-padding-x)',
  lg: 'px-(--sui-button-padding-x)'
}

const texts: Record<ButtonSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-(length:--sui-button-text) leading-5',
  lg: 'text-(length:--sui-button-text) leading-5'
}

const classes = computed(() => [
  'flex items-center justify-center font-medium text-nowrap transition-all duration-200 ease-in-out data-disabled:opacity-50',
  variants[props.variant],
  heights[props.size],
  texts[props.size],
  props.iconOnly ? 'aspect-square px-0' : paddings[props.size],
  // xs uses rounded-md: rounded-lg reads as a pill at that height.
  props.pill ? 'rounded-full' : props.size === 'xs' ? 'rounded-md' : 'rounded-(--sui-radius-button)',
  props.iconOnly ? '' : props.iconPosition === 'end' ? '[&_svg]:ml-2' : '[&_svg:first-child]:mr-2'
])

// A link or custom element can't be natively disabled: it says so to assistive tech instead.
const isNativeButton = computed(() => props.as === 'button' && !props.asChild)
</script>

<template>
  <Primitive
    :aria-disabled="disabled && !isNativeButton ? 'true' : undefined"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-disabled="disabled ? '' : undefined"
    :disabled="isNativeButton ? disabled : undefined"
  >
    <slot />
  </Primitive>
</template>
