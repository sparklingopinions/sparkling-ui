import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import InlineField from './InlineField.vue'
import InlineForm from './InlineForm.vue'

const fields = [
  { id: 'role', label: 'Role', placeholder: 'Add a role' },
  {
    id: 'stage',
    label: 'Stage',
    type: 'select' as const,
    placeholder: 'Pick a stage',
    options: [
      { label: 'Lead', value: 'lead' },
      { label: 'Customer', value: 'customer' }
    ]
  },
  { id: 'notes', label: 'Notes', type: 'multiline' as const, placeholder: 'Add notes' },
  { id: 'source', label: 'Source', placeholder: 'Imported', disabled: true }
]

const meta: Meta<typeof InlineForm> = {
  title: 'Components/InlineForm',
  component: InlineForm,
  parameters: {
    docs: {
      description: {
        component:
          "A record's details, each value an `InlineField` edited where it is: click or Enter to edit, Enter or leaving to save, Escape to undo. A field's `type` is `text`, `multiline` or `select`; `change` reports the one field that changed. `InlineField` alone, with `variant=\"title\"`, edits a record's name."
      }
    }
  },
  render: () => ({
    components: { InlineField, InlineForm },
    setup: () => ({
      fields,
      name: ref('Ada Lovelace'),
      model: ref({ role: 'Head of growth', stage: 'customer', notes: null, source: null })
    }),
    template: `
      <div class="w-96">
        <InlineField v-model="name" aria-label="Name" placeholder="Name" variant="title" />
        <InlineForm v-model="model" class="mt-2" :fields="fields" />
      </div>
    `
  })
}

export default meta

export const Default: StoryObj<typeof InlineForm> = {}
