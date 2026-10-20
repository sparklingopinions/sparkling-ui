import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import AlertDialog from '../AlertDialog/AlertDialog.vue'
import Button from '../Button/Button.vue'
import Icon from '../Icon/Icon.vue'
import DropdownMenu, { type DropdownMenuEntry } from './DropdownMenu.vue'

const items: DropdownMenuEntry[] = [
  { type: 'action', label: 'Rename', action: 'rename', icon: 'search', shortcut: 'R' },
  { type: 'action', label: 'Send an email', action: 'email', icon: 'inbox' },
  { type: 'separator' },
  { type: 'action', label: 'Delete', action: 'delete', icon: 'close', variant: 'danger', confirmed: true }
]

const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/Actions/DropdownMenu',
  component: DropdownMenu,
  args: { items, buttonIcon: 'chevron-down', tooltip: 'More actions' },
  render: (args) => ({
    components: { AlertDialog, DropdownMenu },
    setup: () => ({ args, chosen: ref('Nothing chosen yet') }),
    template: `
      <div class="flex items-center gap-3 text-sm text-sui-ink">
        <DropdownMenu v-bind="args" @click-item="chosen = 'Chose ' + $event.action" />
        <span>{{ chosen }}</span>
      </div>
      <AlertDialog />
    `
  })
}

export default meta
type Story = StoryObj<typeof DropdownMenu>

// Opened in the test, so axe checks the open menu too.
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'More actions' }))
    const menu = await within(document.body).findByRole('menu')
    await waitFor(() => expect(getComputedStyle(menu).opacity).toBe('1'))
  }
}

export const WithLabel: Story = { args: { buttonLabel: 'Actions' } }

export const AlignEnd: Story = {
  args: { align: 'end' },
  decorators: [() => ({ template: '<div class="flex w-80 justify-end"><story /></div>' })]
}

export const CustomTrigger: Story = {
  render: (args) => ({
    components: { Button, Icon, DropdownMenu },
    setup: () => ({ args }),
    template: `
      <DropdownMenu v-bind="args" :tooltip="null">
        <template #trigger>
          <Button icon-position="end" size="sm">Member <Icon name="chevron-down" /></Button>
        </template>
      </DropdownMenu>
    `
  })
}
