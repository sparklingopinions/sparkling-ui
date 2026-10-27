import type { Meta, StoryObj } from '@storybook/vue3-vite'

import PricingCard from './PricingCard.vue'

const meta: Meta<typeof PricingCard> = {
  title: 'Components/Data display/PricingCard',
  component: PricingCard,
  args: { name: 'Pro, monthly', price: '€15', period: 'per month, plus VAT', actionLabel: 'Choose' },
  render: (args) => ({
    components: { PricingCard },
    setup: () => ({ args }),
    template: '<div class="max-w-xs"><PricingCard v-bind="args" /></div>'
  })
}

export default meta
type Story = StoryObj<typeof PricingCard>

export const Default: Story = {}

export const Highlighted: Story = {
  args: {
    name: 'Pro, yearly',
    price: '€150',
    period: 'per year, plus VAT',
    badge: 'Two months free',
    highlighted: true
  }
}

export const SideBySide: Story = {
  render: () => ({
    components: { PricingCard },
    template: `
      <div class="grid max-w-2xl gap-4 sm:grid-cols-2">
        <PricingCard name="Pro, monthly" price="€15" period="per month, plus VAT" description="Cancel any time." />
        <PricingCard
          name="Pro, yearly"
          price="€150"
          period="per year, plus VAT"
          description="Billed once a year."
          badge="Two months free"
          highlighted
        />
      </div>
    `
  })
}

export const WithList: Story = {
  render: (args) => ({
    components: { PricingCard },
    setup: () => ({ args }),
    template: `
      <div class="max-w-xs">
        <PricingCard v-bind="args">
          <ul class="m-0 flex list-none flex-col gap-1.5 p-0 text-13 leading-5 text-sui-ink-body">
            <li>Unlimited records</li>
            <li>Three projects</li>
            <li>Two people, invites included</li>
          </ul>
        </PricingCard>
      </div>
    `
  })
}

export const Loading: Story = { args: { ...Highlighted.args, loading: true } }

export const Disabled: Story = { args: { disabled: true, actionLabel: 'Current plan' } }
