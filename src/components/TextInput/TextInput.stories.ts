import type { Meta, StoryObj } from '@storybook/vue3-vite'

import TextInput from './TextInput.vue'

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  args: { modelValue: '', invalid: false, disabled: false },
  render: (args) => ({
    components: { TextInput },
    setup: () => ({ args }),
    template:
      '<TextInput v-bind="args" v-model="args.modelValue" aria-label="Workspace name" placeholder="Workspace name" />'
  })
}

export default meta
type Story = StoryObj<typeof TextInput>

export const Empty: Story = {}

export const Filled: Story = { args: { modelValue: 'Acme Inc' } }

export const Invalid: Story = { args: { modelValue: 'ac', invalid: true } }

export const Disabled: Story = { args: { modelValue: 'Locked', disabled: true } }

export const Readonly: Story = {
  render: () => ({
    components: { TextInput },
    template: '<TextInput aria-label="Email" model-value="ada@example.com" readonly />'
  })
}
