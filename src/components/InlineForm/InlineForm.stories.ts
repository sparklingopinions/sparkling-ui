import { markRaw, ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import InlineForm from './InlineForm.vue'
import InlineFormInputSelect from './InlineFormInputSelect.vue'
import InlineFormInputText from './InlineFormInputText.vue'
import InlineFormInputTitle from './InlineFormInputTitle.vue'

const fields = [
  { id: 'role', label: 'Role', component: markRaw(InlineFormInputText), placeholder: 'Add a role' },
  {
    id: 'stage',
    label: 'Stage',
    component: markRaw(InlineFormInputSelect),
    placeholder: 'Pick a stage',
    props: {
      options: [
        { label: 'Lead', value: 'lead' },
        { label: 'Customer', value: 'customer' }
      ]
    }
  },
  {
    id: 'notes',
    label: 'Notes',
    component: markRaw(InlineFormInputText),
    placeholder: 'Add notes',
    props: { multipleRows: true }
  }
]

const meta: Meta<typeof InlineForm> = {
  title: 'Components/InlineForm',
  component: InlineForm,
  parameters: {
    docs: {
      description: {
        component:
          "A record's details, each value edited where it is: click or Enter to edit, Enter or leaving to save, Escape to undo. Fields name their editor (`InlineFormInputText`, `InlineFormInputSelect`, or your own); `change` reports the one field that changed."
      }
    }
  },
  render: () => ({
    components: { InlineForm, InlineFormInputTitle },
    setup: () => ({
      fields,
      name: ref('Ada Lovelace'),
      model: ref({ role: 'Head of growth', stage: 'customer', notes: null })
    }),
    template: `
      <div class="w-96">
        <InlineFormInputTitle v-model="name" aria-label="Name" placeholder="Name" />
        <InlineForm v-model="model" class="mt-2" :fields="fields" />
      </div>
    `
  })
}

export default meta

export const Default: StoryObj<typeof InlineForm> = {}
