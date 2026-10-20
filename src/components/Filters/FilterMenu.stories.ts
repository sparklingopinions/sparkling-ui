import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import FilterMenu from './FilterMenu.vue'
import type { FilterField } from './types'

const fields: FilterField[] = [
  { name: 'name', label: 'Name', type: 'text', group: 'Person' },
  { name: 'stage', label: 'Stage', type: 'enum', group: 'Person' },
  { name: 'company', label: 'Company', type: 'company', group: 'Person' },
  { name: 'vip', label: 'VIP', type: 'boolean', group: 'Person' },
  { name: 'lastContact', label: 'Last contact', type: 'date', group: 'Activity' },
  { name: 'replies', label: 'Replies', type: 'number', group: 'Activity' }
]
const meta: Meta = { title: 'Components/Collections/FilterMenu' }

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => ({
    components: { FilterMenu },
    setup: () => ({ fields, picked: ref('') }),
    template: `
      <div class="flex items-center gap-3">
        <FilterMenu :fields="fields" :in-use="['stage']" @pick="picked = $event" />
        <FilterMenu as="button" :fields="fields" :in-use="['stage']" @pick="picked = $event" />
        <span class="text-13 text-sui-ink-muted">{{ picked }}</span>
      </div>
    `
  })
}

export const Open: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getAllByRole('button', { name: 'Filter' })[0])
    const search = await within(document.body).findByRole('textbox', { name: 'Filter by…' })
    await userEvent.type(search, 'st')
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(within(document.body).getByRole('option', { name: /Last contact/ })).toBeVisible())
  }
}
