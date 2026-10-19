import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ContrastPairs from './ContrastPairs.vue'

const meta: Meta<typeof ContrastPairs> = {
  title: 'Foundations/Contrast gaps',
  component: ContrastPairs,
  // The page shows the failing pairs on purpose; everything around them is checked as usual.
  parameters: {
    layout: 'fullscreen',
    a11y: { config: { rules: [{ id: 'color-contrast', selector: ':not([data-specimen])' }] } }
  }
}

export default meta

export const Pairs: StoryObj<typeof ContrastPairs> = {}
