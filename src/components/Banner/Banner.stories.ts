import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Button from '../Button/Button.vue'
import Banner from './Banner.vue'

const meta: Meta<typeof Banner> = {
  title: 'Components/Banner',
  component: Banner,
  args: { tone: 'warning', inset: false, dismissible: false },
  argTypes: { tone: { control: 'select', options: ['danger', 'warning', 'info', 'neutral'] } },
  render: (args) => ({
    components: { Banner },
    setup: () => ({ args }),
    template: '<Banner v-bind="args">Your Gmail connection expired. Reconnect it to keep syncing.</Banner>'
  })
}

export default meta
type Story = StoryObj<typeof Banner>

export const Warning: Story = {}

export const Tones: Story = {
  render: (args) => ({
    components: { Banner },
    setup: () => ({ args }),
    template: `
      <div class="flex flex-col gap-3">
        <Banner v-for="tone in ['danger', 'warning', 'info', 'neutral']" :key="tone" v-bind="args" :tone="tone">
          A {{ tone }} banner.
        </Banner>
      </div>
    `
  })
}

export const InsetWithIcon: Story = { ...Tones, args: { inset: true, icon: 'inbox' } }

export const WithAction: Story = {
  args: { tone: 'info', icon: 'inbox', dismissible: true },
  render: (args) => ({
    components: { Banner, Button },
    setup: () => ({ args }),
    template: `
      <Banner v-bind="args">
        Your Gmail connection expired.
        <template #action><Button size="sm">Reconnect</Button></template>
      </Banner>
    `
  })
}
