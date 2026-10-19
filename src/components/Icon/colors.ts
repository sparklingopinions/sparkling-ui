// Full class strings, so Tailwind finds them: a class built at runtime (`stroke-${color}`) is never generated.
export const iconColors = {
  ink: 'stroke-sui-ink fill-sui-ink',
  'ink-emphasis': 'stroke-sui-ink-emphasis fill-sui-ink-emphasis',
  'ink-body': 'stroke-sui-ink-body fill-sui-ink-body',
  'ink-subtle': 'stroke-sui-ink-subtle fill-sui-ink-subtle',
  'ink-muted': 'stroke-sui-ink-muted fill-sui-ink-muted',
  'ink-faint': 'stroke-sui-ink-faint fill-sui-ink-faint',
  'mark-faint': 'stroke-sui-mark-faint fill-sui-mark-faint',
  accent: 'stroke-sui-accent fill-sui-accent',
  'accent-solid': 'stroke-sui-accent-solid fill-sui-accent-solid',
  'on-accent': 'stroke-sui-on-accent fill-sui-on-accent',
  'on-contrast': 'stroke-sui-on-contrast fill-sui-on-contrast',
  'on-danger': 'stroke-sui-on-danger fill-sui-on-danger',
  'on-inverse': 'stroke-sui-on-inverse fill-sui-on-inverse',
  'success-mid': 'stroke-sui-success-mid fill-sui-success-mid',
  success: 'stroke-sui-success fill-sui-success',
  'warning-mid': 'stroke-sui-warning-mid fill-sui-warning-mid',
  warning: 'stroke-sui-warning fill-sui-warning',
  'danger-mid': 'stroke-sui-danger-mid fill-sui-danger-mid',
  danger: 'stroke-sui-danger fill-sui-danger',
  'info-mid': 'stroke-sui-info-mid fill-sui-info-mid',
  info: 'stroke-sui-info fill-sui-info'
} as const

export type IconColor = keyof typeof iconColors
