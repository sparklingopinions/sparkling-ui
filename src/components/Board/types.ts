import type { IconColor } from '../Icon/colors'

export interface BoardColumn<T> {
  id: string
  name: string
  /** An icon before the name, through the app's icon resolver. */
  icon?: string
  iconColor?: IconColor
  items: T[]
}
