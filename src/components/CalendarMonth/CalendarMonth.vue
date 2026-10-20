<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import {
  addDays,
  addMonths,
  differenceInDays,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek
} from '../../utils/dates'
import Tooltip from '../Tooltip/Tooltip.vue'
import ChevronIcon from '../internal/ChevronIcon.vue'

export interface CalendarMonthProps {
  /** Selects a day; with `end`, a range. */
  start?: Date | null
  end?: Date | null
  /** For the month's name; the browser's language by default. */
  locale?: string
  /** Monday first. */
  weekdays?: string[]
  previousLabel?: string
  nextLabel?: string
}

const props = withDefaults(defineProps<CalendarMonthProps>(), {
  start: null,
  end: null,
  locale: undefined,
  weekdays: () => ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  previousLabel: 'Previous month',
  nextLabel: 'Next month'
})

const emit = defineEmits<{ pick: [date: Date] }>()

const view = ref(startOfMonth(props.end ?? props.start ?? new Date()))

// Follows the selection to its month, when it's picked elsewhere (a shortcut, say).
watch(
  () => props.end ?? props.start,
  (date) => {
    if (date) view.value = startOfMonth(date)
  }
)

const title = computed(() =>
  new Intl.DateTimeFormat(props.locale, { month: 'long', year: 'numeric' }).format(view.value)
)

const shiftMonth = (months: number) => (view.value = addMonths(view.value, months))

const cells = computed(() => {
  const first = startOfWeek(view.value)
  const last = addDays(addMonths(view.value, 1), -1)
  const count = Math.ceil((differenceInDays(last, first) + 1) / 7) * 7
  const today = startOfDay(new Date())
  const [start, end] = [props.start, props.end].map((date) => (date ? startOfDay(date) : null))
  const ranged = !!start && !!end && !isSameDay(start, end)
  const [low, high] = ranged ? [start!, end!].sort((a, b) => a.getTime() - b.getTime()) : []

  return Array.from({ length: count }, (_, i) => {
    const date = addDays(first, i)
    const isStart = !!start && isSameDay(date, start)
    const isEnd = !!end && isSameDay(date, end)
    const selected = isStart || isEnd
    const inRange = ranged && date >= low! && date <= high!
    const isToday = isSameDay(date, today)
    const column = i % 7

    return {
      key: date.toISOString(),
      date,
      label: date.getDate(),
      selected,
      isToday,
      // The range is a band behind the days, rounded where it starts, ends or wraps.
      band: inRange
        ? ['bg-sui-accent-wash', (isStart || column === 0) && 'rounded-l-lg', (isEnd || column === 6) && 'rounded-r-lg']
        : '',
      classes: selected
        ? 'bg-sui-accent-solid font-semibold text-sui-on-accent'
        : [
            'hover:bg-sui-sunken',
            isToday
              ? 'font-semibold text-sui-accent ring-1 ring-sui-accent-line ring-inset'
              : inRange
                ? 'font-medium text-sui-accent'
                : !isSameMonth(date, view.value) || date > today
                  ? 'text-sui-ink-muted'
                  : 'text-sui-ink'
          ]
    }
  })
})
</script>

<!-- A month of days, weeks from Monday: today outlined with a dot, future days and other months muted. Picking a day
     emits it; the host decides what it selects. -->
<template>
  <div>
    <div class="flex h-11 items-center justify-between">
      <span class="pl-1.5 text-13 font-semibold text-sui-ink">{{ title }}</span>
      <div class="flex gap-0.5">
        <Tooltip :text="previousLabel">
          <button
            :aria-label="previousLabel"
            class="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-sui-sunken focus-visible:sui-ring"
            type="button"
            @click="shiftMonth(-1)"
          >
            <ChevronIcon class="h-4 w-4 fill-sui-ink-body stroke-sui-ink-body" direction="left" />
          </button>
        </Tooltip>
        <Tooltip :text="nextLabel">
          <button
            :aria-label="nextLabel"
            class="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-sui-sunken focus-visible:sui-ring"
            type="button"
            @click="shiftMonth(1)"
          >
            <ChevronIcon class="h-4 w-4 fill-sui-ink-body stroke-sui-ink-body" direction="right" />
          </button>
        </Tooltip>
      </div>
    </div>
    <div aria-hidden="true" class="grid h-5.5 grid-cols-7 items-center">
      <span v-for="(day, i) in weekdays" :key="i" class="text-center text-11 font-semibold text-sui-ink-muted">
        {{ day }}
      </span>
    </div>
    <div class="mt-0.5 grid grid-cols-7 gap-y-0.5">
      <button
        v-for="cell in cells"
        :key="cell.key"
        :aria-current="cell.isToday ? 'date' : undefined"
        :aria-label="cell.date.toLocaleDateString(locale, { dateStyle: 'full' })"
        :aria-pressed="cell.selected"
        :class="['group flex h-9 items-center justify-center outline-hidden', cell.band]"
        type="button"
        @click="emit('pick', cell.date)"
      >
        <span
          class="relative flex h-8.5 w-9 items-center justify-center rounded-lg text-13 tabular-nums transition-colors group-focus-visible:sui-ring"
          :class="cell.classes"
        >
          {{ cell.label }}
          <span
            v-if="cell.isToday"
            class="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
            :class="cell.selected ? 'bg-sui-on-accent' : 'bg-sui-accent-solid'"
          />
        </span>
      </button>
    </div>
  </div>
</template>
