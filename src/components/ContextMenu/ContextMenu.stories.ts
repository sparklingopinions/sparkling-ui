import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test'

import type { DropdownMenuEntry } from '../../index'
import AlertDialog from '../AlertDialog/AlertDialog.vue'
import ContextMenu from './ContextMenu.vue'

const items: DropdownMenuEntry[] = [
  { type: 'action', label: 'Open', action: 'open', icon: 'external-link' },
  { type: 'action', label: 'Duplicate', action: 'duplicate', icon: 'copy', shortcut: 'D' },
  { type: 'action', label: 'Archive', action: 'archive', icon: 'archive' },
  { type: 'separator' },
  { type: 'action', label: 'Delete', action: 'delete', icon: 'trash', variant: 'danger', confirmed: true }
]

const posts = ['Behind the name', 'Customer story', 'We have a name']

const meta: Meta<typeof ContextMenu> = {
  title: 'Components/Actions/ContextMenu',
  component: ContextMenu,
  parameters: {
    docs: {
      description: {
        component:
          "DropdownMenu's items at the pointer. Right-click the target, or press Shift+F10 or the Menu key while it has focus: the menu opens at its top left with the first item focused. Make the target focusable, and keep every action reachable from a visible control too, such as the row's More menu: context menus aren't discoverable."
      }
    }
  },
  args: { items, label: 'Post actions' },
  render: (args) => ({
    components: { AlertDialog, ContextMenu },
    setup: () => ({ args, posts, chosen: ref('Nothing chosen yet') }),
    template: `
      <div class="flex w-96 flex-col gap-3 text-sm text-sui-ink">
        <ul class="m-0 flex list-none flex-col rounded-xl border border-sui-line-subtle bg-sui-surface p-0">
          <ContextMenu v-for="post in posts" :key="post" v-bind="args" :id="post" @click-item="chosen = $event.label + ' ' + $event.id">
            <li tabindex="0" class="px-4 py-2.5 outline-hidden focus-visible:sui-ring-inset">{{ post }}</li>
          </ContextMenu>
        </ul>
        <span>{{ chosen }}</span>
      </div>
      <AlertDialog />
    `
  })
}

export default meta
type Story = StoryObj<typeof ContextMenu>

export const Default: Story = {}

// Opened in the test, so axe checks the open menu too.
export const RightClick: Story = {
  play: async ({ canvasElement }) => {
    const row = within(canvasElement).getByText('Customer story')
    await fireEvent.contextMenu(row, {
      clientX: row.getBoundingClientRect().left + 40,
      clientY: row.getBoundingClientRect().top + 12
    })
    const menu = await within(document.body).findByRole('menu', { name: 'Post actions' })
    await waitFor(() => expect(getComputedStyle(menu).opacity).toBe('1'))
  }
}

export const FromTheKeyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const row = canvas.getByText('Behind the name')
    row.focus()
    await userEvent.keyboard('{Shift>}{F10}{/Shift}')
    const menu = await within(document.body).findByRole('menu', { name: 'Post actions' })
    await waitFor(() => expect(within(menu).getAllByRole('menuitem')[0]).toHaveFocus())
    await userEvent.keyboard('{ArrowDown}')
    await expect(within(menu).getByRole('menuitem', { name: /Duplicate/ })).toHaveFocus()
    await userEvent.keyboard('{End}')
    await expect(within(menu).getByRole('menuitem', { name: 'Delete' })).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(within(document.body).queryByRole('menu')).not.toBeInTheDocument())
    await expect(row).toHaveFocus()

    await userEvent.keyboard('{ContextMenu}')
    await within(document.body).findByRole('menu', { name: 'Post actions' })
    await userEvent.keyboard('{Enter}')
    await expect(await canvas.findByText('Open Behind the name')).toBeInTheDocument()
  }
}

export const NearTheEdge: Story = {
  decorators: [() => ({ template: '<div class="flex h-[20rem] items-end justify-end"><story /></div>' })],
  play: async ({ canvasElement }) => {
    const row = within(canvasElement).getByText('We have a name')
    const rect = row.getBoundingClientRect()
    await fireEvent.contextMenu(row, { clientX: rect.right - 4, clientY: rect.bottom - 4 })
    const menu = await within(document.body).findByRole('menu')
    await waitFor(() => {
      const box = menu.getBoundingClientRect()
      expect(box.right).toBeLessThanOrEqual(window.innerWidth)
      expect(box.bottom).toBeLessThanOrEqual(window.innerHeight)
    })
  }
}

export const Disabled: Story = { args: { disabled: true } }
