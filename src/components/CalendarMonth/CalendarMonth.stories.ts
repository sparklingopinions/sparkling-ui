import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import CalendarMonth from './CalendarMonth.vue'

const now = new Date()
const day = (d: number) => new Date(now.getFullYear(), now.getMonth(), d)

const meta: Meta<typeof CalendarMonth> = {
  title: 'Components/CalendarMonth',
  component: CalendarMonth,
  args: { locale: 'en-US' },
  render: (args) => ({
    components: { CalendarMonth },
    setup: () => ({ args }),
    template: '<div class="w-72"><CalendarMonth v-bind="args" /></div>'
  })
}

export default meta
type Story = StoryObj<typeof CalendarMonth>

export const Today: Story = {}

export const Day: Story = { args: { start: day(9) } }

export const Range: Story = { args: { start: day(4), end: day(15) } }

export const PickARange: Story = {
  render: (args) => ({
    components: { CalendarMonth },
    setup() {
      const range = ref<[Date | null, Date | null]>([null, null])
      // The host decides: the first pick starts a range, the second ends it.
      const pick = (date: Date) => {
        const [start, end] = range.value
        range.value = start && !end ? [start, date] : [date, null]
      }
      return { args, range, pick }
    },
    template: '<div class="w-72"><CalendarMonth v-bind="args" :end="range[1]" :start="range[0]" @pick="pick" /></div>'
  })
}
