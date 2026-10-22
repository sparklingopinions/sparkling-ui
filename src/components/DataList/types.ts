export interface DataListGroup<T> {
  id: string
  /** Without a name (or a `header`) the group has no header. */
  name?: string
  /** Text in place of the name and count; for richer content, the `group-header` slot. Give such a group a `label`. */
  header?: string
  /** The group's accessible name, when its header isn't just its name. */
  label?: string
  /** Shown instead of the number of items, e.g. a total beyond the loaded page. */
  count?: number
  items: T[]
}
