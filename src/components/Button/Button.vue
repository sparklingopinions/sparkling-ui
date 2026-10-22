<script setup lang="ts">
import { computed } from 'vue'

import { Primitive, type PrimitiveProps } from 'reka-ui'

export type ButtonVariant =
  'primary' | 'secondary' | 'tinted' | 'ghost' | 'contrast' | 'danger' | 'danger-outline' | 'ghost-inverse'
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
  /** A toggle's state, as `aria-pressed`. Drawn on for ghost, ghost-inverse and secondary; leave it unset on a plain
   *  button. */
  pressed?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
  as: 'button',
  variant: 'secondary',
  size: 'md',
  iconPosition: 'start',
  pressed: undefined
})

const variants: Record<ButtonVariant, string> = {
  primary:
    'border border-sui-accent-solid bg-sui-accent-solid text-sui-on-accent not-data-disabled:hover:border-sui-accent-hover not-data-disabled:hover:bg-sui-accent-hover [&_svg]:stroke-sui-on-accent',
  secondary:
    'border border-sui-line bg-sui-surface text-sui-ink-emphasis shadow-(--sui-shadow-raised) not-data-disabled:hover:border-sui-line-strong not-data-disabled:hover:bg-sui-canvas [&_svg]:stroke-sui-ink-emphasis',
  tinted:
    'border border-sui-accent-line bg-sui-accent-wash text-sui-accent not-data-disabled:hover:bg-sui-accent-soft [&_svg]:stroke-sui-accent',
  ghost:
    'border border-transparent bg-transparent text-sui-ink-subtle not-data-disabled:hover:bg-sui-sunken not-data-disabled:hover:text-sui-ink-emphasis',
  contrast:
    'border border-sui-contrast bg-sui-contrast text-sui-on-contrast not-data-disabled:hover:border-sui-contrast-hover not-data-disabled:hover:bg-sui-contrast-hover',
  // No border: it's 2px narrower than the other variants.
  danger: 'bg-sui-danger-solid text-sui-on-danger not-data-disabled:hover:bg-sui-danger-hover',
  'danger-outline':
    'border border-sui-danger-line bg-sui-surface text-sui-danger not-data-disabled:hover:bg-sui-danger-soft [&_svg]:stroke-sui-danger',
  // For inverse grounds: toasts, dark bands.
  'ghost-inverse':
    'border border-transparent bg-transparent text-sui-on-inverse not-data-disabled:hover:bg-sui-on-inverse/[0.12] not-data-disabled:active:bg-sui-on-inverse/[0.2] [&_svg]:stroke-sui-on-inverse'
}

// On is a step past hover, and hovering it deepens it again. On inverse, 22% is as deep as white text keeps 4.5:1.
const pressedVariants: Partial<Record<ButtonVariant, string>> = {
  secondary:
    'border border-sui-accent-line bg-sui-accent-wash text-sui-accent shadow-(--sui-shadow-raised) not-data-disabled:hover:border-sui-accent-bright not-data-disabled:hover:bg-sui-accent-soft [&_svg]:stroke-sui-accent',
  ghost:
    'border border-transparent bg-sui-accent-wash text-sui-accent not-data-disabled:hover:bg-sui-accent-soft [&_svg]:stroke-sui-accent',
  'ghost-inverse':
    'border border-transparent bg-sui-on-inverse/[0.18] text-sui-on-inverse not-data-disabled:hover:bg-sui-on-inverse/[0.22] [&_svg]:stroke-sui-on-inverse'
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
  // no-underline: as a link, it shouldn't pick up the app's link styles.
  'flex items-center justify-center font-medium text-nowrap no-underline transition-all duration-200 ease-in-out data-disabled:opacity-50',
  props.variant === 'ghost-inverse' ? 'focus-visible:sui-ring-inverse' : 'focus-visible:sui-ring',
  (props.pressed && pressedVariants[props.variant]) || variants[props.variant],
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
    :aria-pressed="pressed === undefined ? undefined : String(pressed)"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :data-disabled="disabled ? '' : undefined"
    :disabled="isNativeButton ? disabled : undefined"
  >
    <slot />
  </Primitive>
</template>
