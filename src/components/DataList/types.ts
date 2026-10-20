export interface DataListGroup<T> {
  id: string
  /** Without a name the group has no header. */
  name?: string
  /** Shown instead of the number of items, e.g. a total beyond the loaded page. */
  count?: number
  items: T[]
}
