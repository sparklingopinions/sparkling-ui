import type { Meta, StoryObj } from '@storybook/vue3-vite'

import TypingDots from './TypingDots.vue'

const meta: Meta<typeof TypingDots> = {
  title: 'Components/TypingDots',
  component: TypingDots
}

export default meta

export const Default: StoryObj<typeof TypingDots> = {}

export const InContext: StoryObj<typeof TypingDots> = {
  render: () => ({
    components: { TypingDots },
    template: '<p class="flex items-center gap-2 text-sm text-sui-ink-body">Drafting a reply <TypingDots /></p>'
  })
}
