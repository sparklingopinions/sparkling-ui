import type { Hue } from '../../utils/hues'
import type { IconColor } from '../Icon/colors'

export type SelectValue = string | number

export interface SelectOption<T extends SelectValue = SelectValue> {
  value: T
  label: string
  /** Shows the option as a Tag of this hue. */
  color?: Hue | null
  /** An icon before the label, through the app's icon resolver: in the list, the trigger and its tags. */
  icon?: string
  /** The icon's colour; ink-subtle by default. */
  iconColor?: IconColor
  disabled?: boolean
}
