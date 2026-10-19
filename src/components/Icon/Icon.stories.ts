import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { storyIcons } from '../../stories/icons'
import Icon from './Icon.vue'
import { iconColors } from './colors'

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  args: { name: 'plus' },
  argTypes: {
    name: { control: 'select', options: Object.keys(storyIcons) },
    color: { control: 'select', options: Object.keys(iconColors) }
  },
  parameters: {
    docs: {
      description: {
        component:
          "Renders one of the app's icons by name. Register them once with `setIconResolver((name) => component)`, e.g. SVG files imported as components. Storybook registers a few stand-ins."
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
          <Icon :color="color" name="mail" />
          <code>{{ color }}</code>
        </li>
      </ul>
    `
  })
}
