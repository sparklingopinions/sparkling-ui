import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import Avatar from '../Avatar/Avatar.vue'
import Button from '../Button/Button.vue'
import DropdownMenu from '../DropdownMenu/DropdownMenu.vue'
import Input from '../Input/Input.vue'
import Popover from '../Popover/Popover.vue'
import PropertyRow from '../PropertyRow/PropertyRow.vue'
import Select from '../Select/Select.vue'
import Dialog from './Dialog.vue'
import { saveHint } from './focus'

const openAndCheck = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open' }))
  const dialog = await within(document.body).findByRole('dialog')
  // Past its scale-in, so axe checks it as drawn.
  await waitFor(() => expect(getComputedStyle(dialog).opacity).toBe('1'))
}

const meta: Meta<typeof Dialog> = {
  title: 'Components/Overlays/Dialog',
  component: Dialog,
  args: { title: 'Revoke key', confirmLabel: 'Revoke', size: 'md', closable: true, headerless: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'record', 'lg', 'xl'] },
    confirmVariant: { control: 'inline-radio', options: ['primary', 'danger', 'contrast'] }
  },
  render: (args) => ({
    components: { Button, Dialog },
    setup: () => ({ args, open: ref(false) }),
    template: `
      <Button size="sm" @click="open = true">Open</Button>
      <Dialog v-bind="args" v-model:open="open" @confirm="open = false">
        Anything using this key stops working right away. This can't be undone.
      </Dialog>
    `
  }),
  play: openAndCheck
}

export default meta
type Story = StoryObj<typeof Dialog>

export const Default: Story = {}

export const Danger: Story = { args: { size: 'sm', confirmVariant: 'danger' } }

export const Large: Story = { args: { size: 'lg', confirmLabel: undefined } }

export const RecordForm: Story = {
  render: () => ({
    components: { Avatar, Button, PropertyRow, Dialog },
    setup: () => ({ open: ref(false), hint: saveHint() }),
    template: `
      <Button size="sm" @click="open = true">Open</Button>
      <Dialog v-model:open="open" band="rgb(var(--sui-hue-blue-soft))" confirm-label="Save" :hint="hint" title="Company">
        <template #hero>
          <Avatar name="Analytical Engines" shape="square" size="xl" />
          <span class="text-lg font-semibold text-sui-ink">Analytical Engines</span>
        </template>
        <template #footer-start>
          <Button size="sm" variant="ghost">Delete</Button>
        </template>
        <PropertyRow label="Domain">engines.example</PropertyRow>
        <PropertyRow label="Stage" :divider="false">Customer</PropertyRow>
      </Dialog>
    `
  })
}

export const WithAutofocus: Story = {
  render: (args) => ({
    components: { Button, Dialog, Input },
    setup: () => ({ args, open: ref(false), name: ref('Nightly import') }),
    template: `
      <Button size="sm" @click="open = true">Open</Button>
      <Dialog v-bind="args" v-model:open="open" title="Rename key" confirm-label="Save">
        <Input v-model="name" aria-label="Name" autofocus />
      </Dialog>
    `
  })
}

export const CustomFooter: Story = {
  render: (args) => ({
    components: { Button, Dialog },
    setup: () => ({ args, open: ref(false) }),
    template: `
      <Button size="sm" @click="open = true">Open</Button>
      <Dialog v-bind="args" v-model:open="open">
        Body text.
        <template #footer>
          <Button variant="danger-outline" @click="open = false">Delete</Button>
          <Button variant="primary" @click="open = false">Done</Button>
        </template>
      </Dialog>
    `
  })
}

// What's drawn at the middle of a panel belongs to it: it isn't under the dialog.
const expectOnTop = (panel: HTMLElement) => {
  const box = panel.getBoundingClientRect()
  return expect(panel.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2))).toBe(true)
}

export const WithOverlaysInside: Story = {
  render: () => ({
    components: { Button, Dialog, DropdownMenu, Input, Popover, Select },
    setup: () => ({
      open: ref(false),
      popover: ref(),
      company: ref<number | null>(null),
      note: ref(''),
      companies: ['Analytical Engines', 'Babbage & Co', 'Difference Ltd'].map((label, index) => ({
        value: index + 1,
        label
      })),
      items: [
        { type: 'action', label: 'Duplicate' },
        { type: 'action', label: 'Archive' }
      ]
    }),
    template: `
      <Button size="sm" @click="open = true">Open</Button>
      <Dialog v-model:open="open" title="Edit person" confirm-label="Save">
        <div class="flex items-center gap-2">
          <Select v-model="company" aria-label="Company" class="w-56" :options="companies" searchable />
          <Button size="sm" @click="popover.toggle($event)">Add note</Button>
          <Popover ref="popover" aria-label="Add note" class="p-3">
            <Input v-model="note" aria-label="Note" autofocus />
          </Popover>
          <DropdownMenu :items="items" />
        </div>
      </Dialog>
    `
  }),
  play: async (context) => {
    await openAndCheck(context)
    const body = within(document.body)
    const user = userEvent

    await user.click(body.getByRole('button', { name: /Company/ }))
    const list = await body.findByRole('listbox')
    await waitFor(() => expectOnTop(list))
    await user.keyboard('Babb')
    await user.click(body.getByRole('option', { name: 'Babbage & Co' }))
    await waitFor(() => expect(body.getByRole('button', { name: /Company/ })).toHaveTextContent('Babbage & Co'))

    await user.click(body.getByRole('button', { name: 'Add note' }))
    const note = await body.findByRole('dialog', { name: 'Add note' })
    await waitFor(() => expectOnTop(note))
    await user.keyboard('Call back')
    await expect(body.getByRole('textbox', { name: 'Note' })).toHaveValue('Call back')
    await user.keyboard('{Escape}')

    await user.click(body.getByRole('button', { name: 'More actions' }))
    const menu = await body.findByRole('menu')
    await waitFor(() => expectOnTop(menu))
    await user.keyboard('{Escape}')
    await expect(body.getByRole('dialog', { name: 'Edit person' })).toBeVisible()
  }
}
