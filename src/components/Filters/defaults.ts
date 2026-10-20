import type { FilterFieldType, FilterOperator, FilterOption, FilterValue } from './types'

const op = (value: string, noValue = false): FilterOperator => ({ value, label: value, noValue })
const empties = [op('is empty', true), op('is not empty', true)]
const choice = [op('is any of'), op('is none of'), ...empties]

// The operators each field type offers by default; English labels, so pass `operators` to translate.
export const filterOperators: Record<FilterFieldType, FilterOperator[]> = {
  text: [op('contains'), op('does not contain'), op('is'), ...empties],
  enum: choice,
  person: choice,
  company: choice,
  date: [op('is within'), op('is before'), op('is after'), op('is empty', true)],
  number: [op('is'), op('is more than'), op('is less than')],
  boolean: [op('is')]
}

export const datePresets = ['Today', 'Last 7 days', 'Last 30 days', 'This quarter', 'This year']

// Sort directions worded for the field's type: ascending first.
export const sortDirections: Record<FilterFieldType, [string, string]> = {
  text: ['A → Z', 'Z → A'],
  enum: ['First to last', 'Last to first'],
  person: ['A → Z', 'Z → A'],
  company: ['A → Z', 'Z → A'],
  date: ['Oldest first', 'Newest first'],
  number: ['Low to high', 'High to low'],
  boolean: ['No first', 'Yes first']
}

/** The value as the chip reads it: up to two names, then "{count} {valueLabel}". */
export function describeFilter(
  value: FilterValue,
  options: FilterOption[],
  labels: { valueLabel: string; yesLabel: string; noLabel: string }
) {
  if (Array.isArray(value)) {
    const names = value.map((v) => options.find((o) => o.value === v)?.label ?? String(v))
    return names.length > 2 ? `${names.length} ${labels.valueLabel}` : names.join(', ')
  }
  if (typeof value === 'boolean') return value ? labels.yesLabel : labels.noLabel
  return value == null ? '' : String(value)
}
