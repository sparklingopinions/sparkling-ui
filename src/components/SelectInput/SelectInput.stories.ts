import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import Chip from '../Chip/Chip.vue'
import SelectInput from './SelectInput.vue'
import type { SelectInputItem } from './types'

const companies: SelectInputItem[] = ['Acme Inc', 'Globex', 'Initech', 'Umbrella', 'Hooli'].map((name, i) => ({
  id: String(i + 1),
  name
}))

const field = `
  <template #trigger="{ onClick }">
    <button
      class="flex h-9 w-full cursor-pointer items-center gap-2 rounded-lg border border-sui-line bg-sui-surface px-3 text-left text-sm text-sui-ink"
      type="button"
      @click="onClick"
    >
      <span v-if="!value || (Array.isArray(value) && !value.length)" class="text-sui-ink-muted">Pick a company</span>
      <span v-else>{{ Array.isArray(value) ? value.map((v) => v.name).join(', ') : value.name }}</span>
    </button>
  </template>
`

const meta: Meta<typeof SelectInput> = {
  title: 'Components/SelectInput',
  component: SelectInput,
  args: { items: companies, label: 'Companies', inputPlaceholder: 'Find a company' },
  parameters: {
    docs: {
      description: {
        component:
          'The `trigger` slot draws the field and gets `onClick` to open the panel. Type to filter, arrow keys and Enter to pick. `multiple` collects several as tags; `can-create` with `create-fn` offers to create what was typed; `query-change` reports the query, for searching elsewhere.'
      }
    }
  },
  render: (args) => ({
    components: { SelectInput },
    setup: () => ({ args, value: ref(null) }),
    template: `<div class="w-72"><SelectInput v-bind="args" v-model="value">${field}</SelectInput></div>`
  })
}

export default meta
type Story = StoryObj<typeof SelectInput>

// Opened in the test, so axe checks the open list too.
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Pick a company' }))
    const list = await within(document.body).findByRole('listbox', { name: 'Companies' })
    await waitFor(() => expect(list).toBeVisible())
  }
}

export const Multiple: Story = {
  args: { multiple: true },
  render: (args) => ({
    components: { SelectInput },
    setup: () => ({ args, value: ref([companies[0], companies[2]]) }),
    template: `<div class="w-72"><SelectInput v-bind="args" v-model="value">${field}</SelectInput></div>`
  })
}

export const CanCreate: Story = {
  args: {
    canCreate: true,
    createColored: false,
    createFn: (item: { name: string }) => ({ id: item.name, ...item })
  }
}

export const ManyOptions: Story = {
  args: { items: Array.from({ length: 200 }, (_, i) => ({ id: String(i), name: `Company ${i + 1}` })) }
}

export const Loading: Story = { args: { loading: true } }

export const Inline: Story = {
  args: { inline: true, items: ['Open', 'Snoozed', 'Done'].map((name) => ({ id: name, name })), label: 'Status' },
  render: (args) => ({
    components: { Chip, SelectInput },
    setup: () => ({ args, value: ref({ id: 'Open', name: 'Open' }) }),
    template: `
      <SelectInput v-bind="args" v-model="value">
        <template #trigger="{ onClick }">
          <button class="cursor-pointer" type="button" @click="onClick"><Chip>{{ value?.name ?? 'Set a status' }}</Chip></button>
        </template>
        <template #option="{ item }">{{ item.name }}</template>
      </SelectInput>
    `
  })
}
