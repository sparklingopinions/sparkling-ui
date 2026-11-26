import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Button from '../Button/Button.vue'
import Alert from './Alert.vue'

const meta: Meta<typeof Alert> = {
  title: 'Components/Feedback/Alert',
  component: Alert,
  args: { tone: 'warning', inset: false, dismissible: false, align: 'center' },
  argTypes: {
    tone: { control: 'select', options: ['danger', 'warning', 'success', 'info', 'neutral'] },
    align: { control: 'inline-radio', options: ['center', 'start'] },
    actionPlacement: { control: 'inline-radio', options: ['end', 'below'] }
  },
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
        <Alert v-for="tone in ['danger', 'warning', 'success', 'info', 'neutral']" :key="tone" v-bind="args" :tone="tone">
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

export const AlignedToTheFirstLine: Story = {
  args: { tone: 'info', icon: 'info', inset: true, dismissible: true, align: 'start' },
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: `
      <div class="max-w-[18rem]">
        <Alert v-bind="args">
          If someone else edits a scheduled record, it goes back to review. It keeps its time and goes out once
          approved again.
        </Alert>
      </div>
    `
  })
}

export const WithTitle: Story = {
  args: { inset: true },
  render: (args) => ({
    components: { Alert, Button },
    setup: () => ({ args }),
    template: `
      <div class="flex max-w-[34rem] flex-col gap-3">
        <Alert v-bind="args" icon="circle-check" title="Synced" tone="success">Every record is up to date.</Alert>
        <Alert v-bind="args" icon="circle-alert" title="Sync stopped" tone="danger">
          The connection was refused. Reconnect it to keep syncing.
        </Alert>
        <Alert v-bind="args" action-placement="below" icon="info" title="Not synced yet" tone="neutral">
          Syncing it uses one of your 40 syncs left this month.
          <template #action><Button size="sm" variant="secondary">Sync now</Button></template>
        </Alert>
        <Alert v-bind="args" action-placement="below" icon="triangle-alert" title="Sync failed" tone="warning">
          Try again in a few minutes.
          <template #action><Button size="sm" variant="secondary">Try again</Button></template>
        </Alert>
      </div>
    `
  })
}
