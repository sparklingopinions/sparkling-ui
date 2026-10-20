export interface TableColumn {
  key: string
  label?: string
  /** A CSS width, e.g. 160 or '20%'. Columns without one share the rest. */
  width?: number | string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
}

export interface TableSort {
  key: string
  dir: 'asc' | 'desc'
}
