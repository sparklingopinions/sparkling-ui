import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Icon from './Icon.vue'
import { iconColors } from './colors'
import { iconNames } from './resolver'

const meta: Meta<typeof Icon> = {
  title: 'Components/Data display/Icon',
  component: Icon,
  args: { name: 'plus' },
  argTypes: {
    name: { control: 'select', options: iconNames },
    color: { control: 'select', options: Object.keys(iconColors) }
  },
  parameters: {
    docs: {
      description: {
        component:
          "A 16px icon from the library's set, by name, coloured by a role. Older names (`people`, `companies`, `dot-vertical`...) still resolve. An app adds or replaces icons with `setIconResolver((name) => component)`; names it returns a component for win."
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof Icon>

export const Default: Story = {}

export const Coloured: Story = { args: { color: 'accent' } }

export const Labelled: Story = { args: { name: 'check', label: 'Done', color: 'success' } }

export const Colours: Story = {
  render: () => ({
    components: { Icon },
    setup: () => ({ colors: Object.keys(iconColors) }),
    template: `
      <ul class="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-3 text-13 text-sui-ink">
        <li v-for="color in colors" :key="color" class="flex items-center gap-2">
          <Icon :color="color" name="inbox" />
          <code>{{ color }}</code>
        </li>
      </ul>
    `
  })
}

export const Set: Story = {
  render: () => ({
    components: { Icon },
    setup: () => ({ names: iconNames }),
    template: `
      <ul class="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-3 text-13 text-sui-ink">
        <li v-for="name in names" :key="name" class="flex items-center gap-2">
          <Icon color="ink-body" :name="name" />
          <code>{{ name }}</code>
        </li>
      </ul>
    `
  })
}
