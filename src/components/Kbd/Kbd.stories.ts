import type { Meta, StoryObj } from '@storybook/vue3-vite'

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

export const Default: StoryObj<typeof Kbd> = {}
