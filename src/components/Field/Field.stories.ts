import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Checkbox from '../Checkbox/Checkbox.vue'
import TextInput from '../TextInput/TextInput.vue'
import Textarea from '../Textarea/Textarea.vue'
import Field from './Field.vue'

const meta: Meta<typeof Field> = {
  title: 'Components/Field',
  component: Field,
  args: { label: 'Email' },
  render: (args, { parameters }) => ({
    components: { Field, TextInput, Textarea },
    setup: () => ({ args, value: ref(parameters.value ?? '') }),
    template: parameters.textarea
      ? '<div class="w-80"><Field v-bind="args"><Textarea v-model="value" :rows="3" /></Field></div>'
      : '<div class="w-80"><Field v-bind="args"><TextInput v-model="value" placeholder="name@company.com" /></Field></div>'
  })
}

export default meta
type Story = StoryObj<typeof Field>

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
    components: { Checkbox, Field },
    template:
      '<Field label="Terms" hint="You can change this later." v-slot="{ id, describedBy }"><div class="flex items-center gap-2"><Checkbox :id="id" :aria-describedby="describedBy" /><span class="text-sm">Accept the terms</span></div></Field>'
  })
}
