import { reactive } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'

import Button from '../Button/Button.vue'
import Icon from '../Icon/Icon.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import Toolbar from './Toolbar.vue'

const formats = [
  { key: 'bold', label: 'Bold', icon: 'bold' },
  { key: 'italic', label: 'Italic', icon: 'italic' },
  { key: 'heading', label: 'Heading', icon: 'heading' },
  { key: 'quote', label: 'Quote', icon: 'quote' },
  { key: 'link', label: 'Link', icon: 'link' }
]

const meta: Meta<typeof Toolbar> = {
  title: 'Components/Actions/Toolbar',
  component: Toolbar,
  parameters: {
    docs: {
      description: {
        component:
          'A row of controls that Tab enters once: the arrow keys move between them, Home and End jump to the ends, and Tab leaves. Put your own Buttons in it; for toggles, give each one `pressed`. It draws no surface of its own.'
      }
    }
  },
  args: { label: 'Text formatting' },
  render: (args) => ({
    components: { Button, Icon, Toolbar, Tooltip },
    setup: () => ({ args, formats, on: reactive<Record<string, boolean>>({ bold: true }) }),
    template: `
      <div class="inline-flex rounded-lg bg-sui-inverse p-1 shadow-md">
        <Toolbar v-bind="args">
          <Tooltip v-for="format in formats" :key="format.key" :text="format.label">
            <Button
              :aria-label="format.label"
              icon-only
              :pressed="!!on[format.key]"
              size="sm"
              variant="ghost-inverse"
              @click="on[format.key] = !on[format.key]"
            >
              <Icon :name="format.icon" />
            </Button>
          </Tooltip>
        </Toolbar>
      </div>
    `
  })
}

export default meta
type Story = StoryObj<typeof Toolbar>

export const OnInverse: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const bold = canvas.getByRole('button', { name: 'Bold' })
    await expect(bold).toHaveAttribute('aria-pressed', 'true')
    await userEvent.tab()
    await expect(bold).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}{Enter}')
    await expect(canvas.getByRole('button', { name: 'Italic' })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.keyboard('{End}')
    await expect(canvas.getByRole('button', { name: 'Link' })).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(bold).toHaveFocus()
  }
}

export const OnSurface: Story = {
  render: (args) => ({
    components: { Button, Icon, Toolbar, Tooltip },
    setup: () => ({ args, formats, on: reactive<Record<string, boolean>>({ italic: true }) }),
    template: `
      <div class="inline-flex rounded-lg border border-sui-line-subtle bg-sui-surface p-1">
        <Toolbar v-bind="args">
          <Tooltip v-for="format in formats" :key="format.key" :text="format.label">
            <Button
              :aria-label="format.label"
              icon-only
              :pressed="!!on[format.key]"
              size="xs"
              variant="ghost"
              @click="on[format.key] = !on[format.key]"
            >
              <Icon :name="format.icon" />
            </Button>
          </Tooltip>
        </Toolbar>
      </div>
    `
  })
}
