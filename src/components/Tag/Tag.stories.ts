import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Tag from './Tag.vue'

const colors = ['gray', 'purple', 'red', 'green', 'orange', 'pink', 'blue', 'slate', 'amber']

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  args: { name: 'Investors', color: 'green', removable: false },
  argTypes: { color: { control: 'select', options: colors } }
}

export default meta
type Story = StoryObj<typeof Tag>

export const Default: Story = {}

export const Colours: Story = {
  render: (args) => ({
    components: { Tag },
    setup: () => ({ args, colors }),
    template:
      '<div class="flex flex-wrap gap-2"><Tag v-for="color in colors" :key="color" v-bind="args" :color="color" :name="color" /></div>'
  })
}

export const Plain: Story = { args: { color: undefined } }

export const Removable: Story = { args: { removable: true } }
