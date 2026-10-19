import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { contrastGap } from '../../stories/contrast'
import Kbd from './Kbd.vue'

const meta: Meta<typeof Kbd> = {
  title: 'Components/Kbd',
  component: Kbd,
  render: () => ({
    components: { Kbd },
    template: '<p class="text-sm text-sui-ink-body">Press <Kbd>Esc</Kbd> to close</p>'
  })
}

export default meta

// ink-faint on the canvas: 1.95 light, 2.92 dark.
export const Default: StoryObj<typeof Kbd> = { parameters: contrastGap }
