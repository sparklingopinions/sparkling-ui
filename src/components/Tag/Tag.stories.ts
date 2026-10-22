import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'

import Tag from './Tag.vue'

const colors = ['gray', 'purple', 'red', 'green', 'orange', 'pink', 'blue', 'slate', 'amber']

const meta: Meta<typeof Tag> = {
  title: 'Components/Data display/Tag',
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

export const Outline: Story = { args: { name: 'Customer', variant: 'outline', color: undefined } }

export const OutlineChange: Story = {
  render: () => ({
    components: { Tag },
    template:
      '<div class="flex items-center gap-2 text-sm text-sui-ink-body"><Tag muted name="Lead" variant="outline" /> to <Tag name="Customer" variant="outline" /></div>'
  })
}

export const Pressable: Story = {
  render: () => ({
    components: { Tag },
    setup: () => {
      const slots = ref(['Morning'])
      const options = ['Morning', 'Midday', 'Evening', 'Weekend']
      const toggle = (slot: string, on: boolean) =>
        (slots.value = on ? [...slots.value, slot] : slots.value.filter((s) => s !== slot))
      return { slots, options, toggle }
    },
    template: `
      <div role="group" aria-label="Posting times" class="flex flex-wrap gap-2">
        <Tag
          v-for="option in options"
          :key="option"
          pressable
          :pressed="slots.includes(option)"
          @update:pressed="toggle(option, $event)"
        >{{ option }}</Tag>
        <Tag pressable disabled>Overnight</Tag>
        <Tag pressable disabled pressed>Always</Tag>
      </div>
    `
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const midday = canvas.getByRole('button', { name: 'Midday' })
    await expect(midday).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(midday)
    await expect(midday).toHaveAttribute('aria-pressed', 'true')
  }
}
