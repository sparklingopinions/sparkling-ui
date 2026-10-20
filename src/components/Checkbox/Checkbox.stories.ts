import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Checkbox from './Checkbox.vue'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Forms/Checkbox',
  component: Checkbox,
  args: { modelValue: false, invalid: false, disabled: false },
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args }),
    template: `
      <label class="flex items-center gap-2 text-sm text-sui-ink">
        <Checkbox v-bind="args" v-model="args.modelValue" />
        Track opens
      </label>
    `
  })
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Unchecked: Story = {}

export const Checked: Story = { args: { modelValue: true } }

export const Invalid: Story = { args: { invalid: true } }

export const Disabled: Story = { args: { modelValue: true, disabled: true } }

export const Indeterminate: Story = { args: { indeterminate: true } }
