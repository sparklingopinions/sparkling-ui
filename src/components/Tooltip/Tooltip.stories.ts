import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'

import Button from '../Button/Button.vue'
import Tooltip from './Tooltip.vue'

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Feedback/Tooltip',
  component: Tooltip,
  args: { text: 'Archive this conversation', side: 'top', disabled: false },
  argTypes: { side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] } },
  parameters: { layout: 'centered' },
  render: (args) => ({
    components: { Button, Tooltip },
    setup: () => ({ args }),
    template: '<Tooltip v-bind="args"><Button size="sm">Archive</Button></Tooltip>'
  })
}

export default meta
type Story = StoryObj<typeof Tooltip>

// Opened by keyboard focus, so the story test checks the tooltip itself, contrast included.
export const Top: Story = {
  play: async ({ canvasElement }) => {
    within(canvasElement).getByRole('button').focus()
    await expect(await within(document.body).findByRole('tooltip')).toHaveTextContent('Archive this conversation')
  }
}

export const Bottom: Story = { args: { side: 'bottom' } }

export const Right: Story = { args: { side: 'right' } }

export const Multiline: Story = { args: { text: 'Archive this conversation\nYou can find it under Done' } }

export const RichContent: Story = {
  render: (args) => ({
    components: { Button, Tooltip },
    setup: () => ({ args }),
    template: `
      <Tooltip v-bind="args">
        <Button size="sm">Archive</Button>
        <template #content>Archive <strong>Acme Inc</strong></template>
      </Tooltip>
    `
  })
}

export const Disabled: Story = { args: { disabled: true } }
