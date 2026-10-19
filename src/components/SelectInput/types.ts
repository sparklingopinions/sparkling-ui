import type { Hue } from '../../utils/hues'

export interface SelectInputItem {
  id: string | number
  name: string
  color?: Hue | null
  [key: string]: unknown
}
