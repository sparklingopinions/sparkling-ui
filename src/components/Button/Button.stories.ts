import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Button from './Button.vue'

// Until Icon lands: a plus, drawn the way MustLoop's icons are (stroked, no fill).
const plus =
  '<svg aria-hidden="true" class="size-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>'

// See Foundations/Contrast gaps: MustLoop's colours, kept until a fix is agreed.
const contrastGap = { a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } }

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: { variant: 'secondary', size: 'md', pill: false, iconOnly: false, iconPosition: 'start', disabled: false },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tinted', 'ghost', 'contrast', 'danger', 'danger-outline']
    },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
    iconPosition: { control: 'inline-radio', options: ['start', 'end'] }
  },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args">Add contact</Button>'
  })
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = { args: { variant: 'primary' } }

export const Secondary: Story = {}

export const Contrast: Story = { args: { variant: 'contrast' } }

export const DangerOutline: Story = { args: { variant: 'danger-outline' } }

// accent on accent-wash: 4.46 light, 3.53 dark.
export const Tinted: Story = { args: { variant: 'tinted' }, parameters: contrastGap }

// ink-subtle on the canvas: 4.32 light.
export const Ghost: Story = { args: { variant: 'ghost' }, parameters: contrastGap }

// on-danger on danger: 3.00 dark.
export const Danger: Story = { args: { variant: 'danger' }, parameters: contrastGap }

export const Sizes: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `
      <div class="flex items-center gap-3">
        <Button v-bind="args" size="xs">Extra small</Button>
        <Button v-bind="args" size="sm">Small</Button>
        <Button v-bind="args" size="md">Medium</Button>
        <Button v-bind="args" size="lg">Large</Button>
      </div>
    `
  })
}

export const WithIcon: Story = {
  args: { variant: 'primary' },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `<Button v-bind="args">${plus}Add contact</Button>`
  })
}

export const IconAtEnd: Story = {
  args: { iconPosition: 'end' },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `<Button v-bind="args">Add contact${plus}</Button>`
  })
}

export const IconOnly: Story = {
  args: { iconOnly: true },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `<Button v-bind="args" aria-label="Add contact">${plus}</Button>`
  })
}

export const Pill: Story = { args: { variant: 'primary', pill: true } }

export const Disabled: Story = { args: { variant: 'primary', disabled: true } }

export const AsLink: Story = {
  args: { variant: 'primary', asChild: true },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: '<Button v-bind="args"><a href="#people">Open people</a></Button>'
  })
}
