import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Button from '../Button/Button.vue'
import Drawer from './Drawer.vue'

const meta: Meta<typeof Drawer> = {
  title: 'Components/Overlays/Drawer',
  component: Drawer,
  args: { side: 'end', width: '300px', floating: false },
  argTypes: { side: { control: 'inline-radio', options: ['start', 'end'] } },
  render: (args) => ({
    components: { Drawer, Button },
    setup: () => ({ args, open: ref(true) }),
    template: `
      <div class="relative h-[22rem] overflow-clip rounded-xl border border-sui-line-subtle bg-sui-surface">
        <div class="mx-auto max-w-[32rem] p-8 text-sm text-sui-ink-body">
          <Button size="sm" @click="open = !open">{{ open ? 'Close' : 'Open' }} the drawer</Button>
          <p class="mt-4">A record's text stays where it is while the drawer slides over its edge.</p>
        </div>
        <Drawer v-bind="args" :open="open">
          <aside aria-label="Details" class="h-full w-full border-sui-line-subtle bg-sui-canvas p-4 text-sm text-sui-ink-body" :class="args.side === 'start' ? 'border-r' : 'border-l'">
            Details about the record.
          </aside>
        </Drawer>
      </div>
    `
  })
}

export default meta
type Story = StoryObj<typeof Drawer>

export const FromTheEnd: Story = {}

export const FromTheStart: Story = { args: { side: 'start' } }

export const Floating: Story = { args: { floating: true } }
