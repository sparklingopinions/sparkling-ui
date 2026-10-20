import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Textarea from './Textarea.vue'

const meta: Meta<typeof Textarea> = {
  title: 'Components/Forms/Textarea',
  component: Textarea,
  args: { modelValue: '', autoResize: false, invalid: false, disabled: false },
  render: (args) => ({
    components: { Textarea },
    setup: () => ({ args }),
    template:
      '<Textarea v-bind="args" v-model="args.modelValue" aria-label="Reply" placeholder="Write a reply" rows="3" />'
  })
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Empty: Story = {}

export const AutoResize: Story = {
  args: { autoResize: true, modelValue: 'A first line.\nA second line.\nAnd a third, so the field grows to fit.' }
}

export const Invalid: Story = { args: { invalid: true } }

export const Disabled: Story = { args: { modelValue: 'Sent', disabled: true } }
