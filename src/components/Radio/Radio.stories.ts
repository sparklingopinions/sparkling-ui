import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Radio from './Radio.vue'

// No `component`: Radio is generic over its value, which Storybook's component typing can't take.
const meta: Meta = {
  title: 'Components/Radio',
  render: (args) => ({
    components: { Radio },
    setup: () => ({ args, keep: ref('ada') }),
    template: `
      <fieldset class="flex flex-col gap-2 text-sm text-sui-ink">
        <legend class="mb-1 font-medium">Keep which record?</legend>
        <label class="flex items-center gap-2"><Radio v-bind="args" v-model="keep" name="keep" value="ada" /> Ada Lovelace</label>
        <label class="flex items-center gap-2"><Radio v-bind="args" v-model="keep" name="keep" value="bea" /> Bea Smith</label>
      </fieldset>
    `
  })
}

export default meta
type Story = StoryObj

export const Group: Story = {}

export const Disabled: Story = { args: { disabled: true } }
