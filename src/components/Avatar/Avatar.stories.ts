import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Avatar from './Avatar.vue'

const photo =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#c96"/><circle cx="32" cy="26" r="12" fill="#fed"/></svg>'
  )

const meta: Meta<typeof Avatar> = {
  title: 'Components/Data display/Avatar',
  component: Avatar,
  args: { name: 'Ada Lovelace', size: 'md', shape: 'circle', badge: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
    hue: { control: 'select', options: ['blue', 'green', 'orange', 'pink', 'purple', 'slate', 'red', 'amber', 'gray'] }
  }
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {}

export const Sizes: Story = {
  render: (args) => ({
    components: { Avatar },
    setup: () => ({ args }),
    template: `
      <div class="flex items-center gap-3">
        <Avatar v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size" v-bind="args" :size="size" />
      </div>
    `
  })
}

export const Hues: Story = {
  render: (args) => ({
    components: { Avatar },
    setup: () => ({ args }),
    template: `
      <div class="flex items-center gap-3">
        <Avatar
          v-for="hue in ['blue', 'green', 'orange', 'pink', 'purple', 'slate', 'red', 'amber', 'gray']"
          :key="hue"
          v-bind="args"
          :hue="hue"
        />
      </div>
    `
  })
}

export const Square: Story = { args: { name: 'Acme', shape: 'square', size: 'lg' } }

export const WithBadge: Story = { args: { badge: true } }

export const Photo: Story = { args: { image: photo, size: 'lg' } }

export const NoName: Story = { args: { name: null } }
