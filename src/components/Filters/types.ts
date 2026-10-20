export type FilterFieldType = 'text' | 'enum' | 'person' | 'company' | 'date' | 'number' | 'boolean'

export interface FilterField {
  name: string
  label: string
  type: FilterFieldType
  /** A heading the picker lists the field under, e.g. "Activity". */
  group?: string
}

export interface FilterOperator {
  value: string
  label: string
  /** "is empty" and the like: no editor shows. */
  noValue?: boolean
}

export interface FilterOption {
  value: string | number
  label: string
  /** A hue dot before the label. */
  color?: string
  /** How many records have it, on the right. */
  count?: number
}

export type FilterValue = string | number | boolean | (string | number)[] | null

export interface ViewSort {
  name: string
  dir: 'asc' | 'desc'
}
