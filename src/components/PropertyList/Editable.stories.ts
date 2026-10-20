import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Editable from './Editable.vue'

const meta: Meta<typeof Editable> = {
  title: 'Components/Forms/Editable',
  component: Editable,
  args: { variant: 'text', placeholder: 'Add a role' },
  render: (args, { parameters }) => ({
    components: { Editable },
    setup: () => ({ args, value: ref(parameters.value ?? 'Head of growth') }),
    template: '<div class="max-w-md"><Editable v-bind="args" v-model="value" aria-label="Role" /></div>'
  })
}

export default meta
type Story = StoryObj<typeof Editable>

export const Text: Story = {}

export const Empty: Story = { parameters: { value: null } }

export const Multiline: Story = {
  args: { variant: 'multiline', placeholder: 'Add notes' },
  parameters: { value: 'Met at the conference.\nFollow up in May.' }
}

export const Title: Story = { args: { variant: 'title', placeholder: 'Name' }, parameters: { value: 'Ada Lovelace' } }

export const Disabled: Story = { args: { disabled: true } }
