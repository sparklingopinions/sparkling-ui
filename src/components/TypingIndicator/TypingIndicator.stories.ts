import type { Meta, StoryObj } from '@storybook/vue3-vite'

import TypingIndicator from './TypingIndicator.vue'

const meta: Meta<typeof TypingIndicator> = {
  title: 'Components/Feedback/TypingIndicator',
  component: TypingIndicator
}

export default meta

export const Default: StoryObj<typeof TypingIndicator> = {}

export const InContext: StoryObj<typeof TypingIndicator> = {
  render: () => ({
    components: { TypingIndicator },
    template: '<p class="flex items-center gap-2 text-sm text-sui-ink-body">Drafting a reply <TypingIndicator /></p>'
  })
}
