import type { Hue } from '../../utils/hues'

export type SelectValue = string | number

export interface SelectOption<T extends SelectValue = SelectValue> {
  value: T
  label: string
  /** Shows the option as a Tag of this hue. */
  color?: Hue | null
  disabled?: boolean
}
