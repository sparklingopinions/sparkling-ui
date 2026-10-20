// The few calendar sums Calendar needs, on local dates.

export const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)

export const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)

/** From the first of a month only, so no day overflows into the next month. */
export const addMonths = (monthStart: Date, months: number) =>
  new Date(monthStart.getFullYear(), monthStart.getMonth() + months, 1)

/** The Monday on or before the date. */
export const startOfWeek = (date: Date) => addDays(startOfDay(date), -((date.getDay() + 6) % 7))

export const isSameDay = (a: Date, b: Date) => startOfDay(a).getTime() === startOfDay(b).getTime()

export const isSameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()

// Rounded, so a day that changes with daylight saving still counts as one.
export const differenceInDays = (later: Date, earlier: Date) =>
  Math.round((startOfDay(later).getTime() - startOfDay(earlier).getTime()) / 86_400_000)
