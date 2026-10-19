import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ContrastPairs from './ContrastPairs.vue'

const meta: Meta<typeof ContrastPairs> = {
  title: 'Foundations/Contrast',
  component: ContrastPairs,
  parameters: { layout: 'fullscreen' }
}

export default meta

export const Pairs: StoryObj<typeof ContrastPairs> = {}
