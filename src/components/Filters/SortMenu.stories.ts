import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import Button from '../Button/Button.vue'
import Icon from '../Icon/Icon.vue'
import FilterMenu from './FilterMenu.vue'
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

export const GhostInHeader: Story = {
  render: () => ({
    components: { FilterMenu, SortMenu },
    setup: () => ({ fields, sort: ref<ViewSort | null>({ name: 'lastContact', dir: 'desc' }) }),
    template: `
      <header class="flex items-center gap-1 border-b border-sui-line-subtle pb-3">
        <h2 class="m-0 mr-auto text-base font-semibold text-sui-ink">People</h2>
        <FilterMenu as="button" variant="ghost" :fields="fields" :in-use="['stage']" />
        <SortMenu v-model="sort" as="button" variant="ghost" :options="fields" />
      </header>
    `
  })
}

export const CustomTriggers: Story = {
  render: () => ({
    components: { Button, FilterMenu, Icon, SortMenu },
    setup: () => ({ fields, sort: ref<ViewSort | null>(null), sortOpen: ref(false), filterOpen: ref(false) }),
    template: `
      <header class="flex items-center gap-1 border-b border-sui-line-subtle pb-3">
        <h2 class="m-0 mr-auto text-base font-semibold text-sui-ink">Posts</h2>
        <FilterMenu v-model:open="filterOpen" :fields="fields" :in-use="['stage', 'vip']">
          <template #trigger="{ count, props }">
            <Button v-bind="props" icon-only aria-label="Filters" size="sm" :variant="count ? 'tinted' : 'ghost'">
              <Icon name="filter" />
            </Button>
          </template>
        </FilterMenu>
        <SortMenu v-model="sort" v-model:open="sortOpen" :options="fields">
          <template #trigger="{ active, label, props }">
            <Button v-bind="props" size="sm" :variant="active ? 'tinted' : 'ghost'">
              <Icon name="sort" />{{ active ? label : 'Sort' }}
            </Button>
          </template>
        </SortMenu>
      </header>
    `
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Sort' }))
    const panel = await within(document.body).findByRole('dialog', { name: 'Sort by' })
    await userEvent.click(within(panel).getByRole('radio', { name: 'Name' }))
    await expect(await canvas.findByRole('button', { name: 'Name, A → Z' })).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Name, A → Z' })).toHaveFocus())
  }
}
