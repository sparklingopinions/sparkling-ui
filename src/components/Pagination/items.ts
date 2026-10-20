export type PaginationItem = number | 'gap-start' | 'gap-end'

const range = (from: number, to: number) => Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i)

/**
 * The pages to show: `boundary` pages at each end, `siblings` around the current one, and a gap where pages are
 * skipped (1 … 7 8 9 … 40). The count stays the same as the current page moves, so the controls don't shift.
 */
export function paginationItems(page: number, count: number, siblings = 1, boundary = 1): PaginationItem[] {
  if (count <= boundary * 2 + siblings * 2 + 3) return range(1, count)
  const low = Math.max(Math.min(page - siblings, count - boundary - siblings * 2 - 1), boundary + 2)
  const high = Math.min(Math.max(page + siblings, boundary + siblings * 2 + 2), count - boundary - 1)
  return [
    ...range(1, boundary),
    low > boundary + 2 ? 'gap-start' : boundary + 1,
    ...range(low, high),
    high < count - boundary - 1 ? 'gap-end' : count - boundary,
    ...range(count - boundary + 1, count)
  ]
}
