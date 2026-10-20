import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Input from './Input.vue'

const meta: Meta<typeof Input> = {
  title: 'Components/Forms/Input',
  component: Input,
  args: { modelValue: '', invalid: false, disabled: false },
  render: (args) => ({
    components: { Input },
    setup: () => ({ args }),
    template:
      '<Input v-bind="args" v-model="args.modelValue" aria-label="Workspace name" placeholder="Workspace name" />'
  })
}

export default meta
type Story = StoryObj<typeof Input>

export const Empty: Story = {}

export const Filled: Story = { args: { modelValue: 'Acme Inc' } }

export const Invalid: Story = { args: { modelValue: 'ac', invalid: true } }

export const Disabled: Story = { args: { modelValue: 'Locked', disabled: true } }

export const Readonly: Story = {
  render: () => ({
    components: { Input },
    template: '<Input aria-label="Email" model-value="ada@example.com" readonly />'
  })
}
