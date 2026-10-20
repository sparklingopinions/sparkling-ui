import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Checkbox from '../Checkbox/Checkbox.vue'
import Input from '../Input/Input.vue'
import Textarea from '../Textarea/Textarea.vue'
import FormField from './FormField.vue'

const meta: Meta<typeof FormField> = {
  title: 'Components/Forms/FormField',
  component: FormField,
  args: { label: 'Email' },
  render: (args, { parameters }) => ({
    components: { FormField, Input, Textarea },
    setup: () => ({ args, value: ref(parameters.value ?? '') }),
    template: parameters.textarea
      ? '<div class="w-80"><FormField v-bind="args"><Textarea v-model="value" :rows="3" /></FormField></div>'
      : '<div class="w-80"><FormField v-bind="args"><Input v-model="value" placeholder="name@company.com" /></FormField></div>'
  })
}

export default meta
type Story = StoryObj<typeof FormField>

export const WithHint: Story = { args: { hint: 'We only use it for replies.' } }

export const Required: Story = { args: { required: true } }

export const Optional: Story = { args: { label: 'Role', optional: true } }

export const WithError: Story = {
  args: { required: true, error: 'Enter an email like name@company.com' },
  parameters: { value: 'ada@' }
}

export const Counter: Story = {
  args: { label: 'Bio', optional: true, maxLength: 160, hint: 'Shown on your profile.' },
  parameters: { textarea: true, value: 'Mathematician and writer.' }
}

export const OverTheLimit: Story = {
  args: { label: 'Bio', maxLength: 20 },
  parameters: { textarea: true, value: 'Mathematician and writer.' }
}

export const Inline: Story = { args: { label: 'Email', layout: 'inline', hint: 'We only use it for replies.' } }

export const AnyControl: Story = {
  render: () => ({
    components: { Checkbox, FormField },
    template:
      '<FormField label="Terms" hint="You can change this later." v-slot="{ id, describedBy }"><div class="flex items-center gap-2"><Checkbox :id="id" :aria-describedby="describedBy" /><span class="text-sm">Accept the terms</span></div></FormField>'
  })
}
