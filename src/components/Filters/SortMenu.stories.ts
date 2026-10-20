import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import SortMenu from './SortMenu.vue'
import type { FilterField, ViewSort } from './types'

const fields: FilterField[] = [
  { name: 'name', label: 'Name', type: 'text', group: 'Person' },
  { name: 'stage', label: 'Stage', type: 'enum', group: 'Person' },
  { name: 'company', label: 'Company', type: 'company', group: 'Person' },
  { name: 'vip', label: 'VIP', type: 'boolean', group: 'Person' },
  { name: 'lastContact', label: 'Last contact', type: 'date', group: 'Activity' },
  { name: 'replies', label: 'Replies', type: 'number', group: 'Activity' }
]
const meta: Meta = { title: 'Components/Collections/SortMenu' }

export default meta
type Story = StoryObj

const sortStory = (sort: ViewSort | null, open = false): Story => ({
  render: () => ({
    components: { SortMenu },
    setup: () => ({ fields, sort: ref(sort) }),
    template: `
      <div class="flex items-center gap-3">
        <SortMenu v-model="sort" as="button" :options="fields" />
        <SortMenu v-model="sort" :options="fields" />
      </div>
    `
  }),
  play: open
    ? async ({ canvasElement }) => {
        await userEvent.click(within(canvasElement).getByRole('button', { name: 'Sort' }))
        await waitFor(() => expect(within(document.body).getByRole('dialog')).toBeVisible())
      }
    : undefined
})

export const Sorted = sortStory({ name: 'lastContact', dir: 'desc' })

export const Open = sortStory({ name: 'name', dir: 'asc' }, true)

export const Unsorted = sortStory(null)
