export interface TableColumn {
  key: string
  label?: string
  /** A CSS width, e.g. 160 or '20%'. Columns without one share the rest. */
  width?: number | string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  /** Lets the cell's content wrap onto more lines, e.g. a name over a summary; cells otherwise truncate to one. */
  wrap?: boolean
}

export interface TableSort {
  key: string
  dir: 'asc' | 'desc'
}
