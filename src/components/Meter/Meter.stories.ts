import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Meter from './Meter.vue'

const meta: Meta<typeof Meter> = {
  title: 'Components/Data display/Meter',
  component: Meter,
  args: { label: 'Items this month', value: 9, reserved: 3, max: 25, tone: 'neutral' },
  argTypes: { tone: { control: 'inline-radio', options: ['neutral', 'warning', 'accent'] } },
  render: (args) => ({
    components: { Meter },
    setup: () => ({ args }),
    template: '<div class="max-w-sm"><Meter v-bind="args" /></div>'
  })
}

export default meta
type Story = StoryObj<typeof Meter>

export const Default: Story = {}

export const NearlyFull: Story = { args: { value: 170, reserved: 34, max: 250, tone: 'warning' } }

export const Full: Story = { args: { label: 'People', value: 2, reserved: 0, max: 2 } }

export const Accent: Story = { args: { value: 2, reserved: 0, max: 3, tone: 'accent' } }

export const InARow: Story = {
  render: () => ({
    components: { Meter },
    template: `
      <div class="flex max-w-2xl flex-col divide-y divide-sui-line-subtle rounded-xl border border-sui-line-subtle bg-sui-surface">
        <div class="flex items-center gap-6 px-4 py-3">
          <div class="w-40 shrink-0">
            <div class="text-sm text-sui-ink">Items this month</div>
            <div class="text-xs text-sui-ink-muted">170 done, 34 scheduled</div>
          </div>
          <Meter
            class="flex-1"
            label="Items this month"
            :max="250"
            :reserved="34"
            tone="warning"
            :value="170"
            value-text="204 of 250, 46 left"
          />
          <div class="w-20 shrink-0 text-right tabular-nums">
            <div class="text-sm text-sui-ink">204 of 250</div>
            <div class="text-xs text-sui-warning">46 left</div>
          </div>
        </div>
        <div class="flex items-center gap-6 px-4 py-3">
          <div class="w-40 shrink-0 text-sm text-sui-ink">Projects</div>
          <Meter class="flex-1" label="Projects" :max="3" :value="2" value-text="2 of 3, 1 left" />
          <div class="w-20 shrink-0 text-right tabular-nums">
            <div class="text-sm text-sui-ink">2 of 3</div>
            <div class="text-xs text-sui-ink-muted">1 left</div>
          </div>
        </div>
      </div>
    `
  })
}
