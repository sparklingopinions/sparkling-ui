import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Skeleton from './Skeleton.vue'

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  args: { shape: 'rectangle', width: '100%', height: '1rem' },
  argTypes: { shape: { control: 'inline-radio', options: ['rectangle', 'circle'] } }
}

export default meta
type Story = StoryObj<typeof Skeleton>

export const Rectangle: Story = {}

export const Circle: Story = { args: { shape: 'circle', size: '2rem' } }

export const LoadingRow: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="flex max-w-90 items-center gap-3">
        <Skeleton shape="circle" size="2rem" />
        <div class="flex flex-1 flex-col gap-2">
          <Skeleton height="0.85rem" width="40%" />
          <Skeleton height="0.7rem" width="80%" />
        </div>
      </div>
    `
  })
}
