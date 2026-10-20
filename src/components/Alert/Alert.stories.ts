import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Button from '../Button/Button.vue'
import Alert from './Alert.vue'

const meta: Meta<typeof Alert> = {
  title: 'Components/Feedback/Alert',
  component: Alert,
  args: { tone: 'warning', inset: false, dismissible: false },
  argTypes: { tone: { control: 'select', options: ['danger', 'warning', 'info', 'neutral'] } },
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: '<Alert v-bind="args">Your Gmail connection expired. Reconnect it to keep syncing.</Alert>'
  })
}

export default meta
type Story = StoryObj<typeof Alert>

export const Warning: Story = {}

export const Tones: Story = {
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: `
      <div class="flex flex-col gap-3">
        <Alert v-for="tone in ['danger', 'warning', 'info', 'neutral']" :key="tone" v-bind="args" :tone="tone">
          A {{ tone }} banner.
        </Alert>
      </div>
    `
  })
}

export const InsetWithIcon: Story = { ...Tones, args: { inset: true, icon: 'inbox' } }

export const WithAction: Story = {
  args: { tone: 'info', icon: 'inbox', dismissible: true },
  render: (args) => ({
    components: { Alert, Button },
    setup: () => ({ args }),
    template: `
      <Alert v-bind="args">
        Your Gmail connection expired.
        <template #action><Button size="sm">Reconnect</Button></template>
      </Alert>
    `
  })
}
