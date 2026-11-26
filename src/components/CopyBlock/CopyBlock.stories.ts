import type { Meta, StoryObj } from '@storybook/vue3-vite'

import CopyBlock from './CopyBlock.vue'

const meta: Meta<typeof CopyBlock> = {
  title: 'Components/Data display/CopyBlock',
  component: CopyBlock,
  args: { text: 'Summarise this week’s notes in five bullet points, then list what’s still open.' },
  render: (args) => ({
    components: { CopyBlock },
    setup: () => ({ args }),
    template: '<div class="max-w-xl"><CopyBlock v-bind="args" /></div>'
  })
}

export default meta
type Story = StoryObj<typeof CopyBlock>

export const Default: Story = {}

export const Small: Story = { args: { size: 'sm' } }

export const LongText: Story = {
  args: {
    text: 'Read the notes from this week, one by one.\nGroup them by theme, and give each theme a short title.\nUnder each title, list what was decided and what’s still open, in the words the notes use.\nEnd with three questions worth asking next week.'
  }
}

export const RichContent: Story = {
  render: (args) => ({
    components: { CopyBlock },
    setup: () => ({ args }),
    template: `<div class="max-w-xl"><CopyBlock v-bind="args">
      <p class="m-0 font-medium">Ask me one question at a time:</p>
      <ul class="m-0 mt-1 list-disc pl-4.5">
        <li>What changed this week</li>
        <li>What’s blocked, and on whom</li>
      </ul>
    </CopyBlock></div>`
  }),
  args: { text: 'Ask me one question at a time:\n- What changed this week\n- What’s blocked, and on whom' }
}
