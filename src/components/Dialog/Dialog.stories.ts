import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { useConfirm } from '../../composables/useConfirm'
import AlertDialog from '../AlertDialog/AlertDialog.vue'
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

const sheetOf = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open' }))
  const sheet = await within(document.body).findByRole('dialog')
  // Past its slide-in, so axe checks it as drawn.
  await waitFor(() => expect(getComputedStyle(sheet).transform).toBe('none'))
  return sheet
}
const openSheet = async (context: { canvasElement: HTMLElement }) => {
  await sheetOf(context)
}

const sheetRender: Story['render'] = (args) => ({
  components: { Button, Dialog, Input, PropertyRow },
  setup: () => ({ args, open: ref(false), title: ref('Spring launch') }),
  template: `
    <Button size="sm" @click="open = true">Open</Button>
    <Dialog v-bind="args" v-model:open="open" @confirm="open = false">
      <div class="flex flex-col gap-3">
        <Input v-model="title" aria-label="Title" />
        <p v-for="n in args.paragraphs ?? 1" :key="n" class="m-0">
          The post goes out in the next free slot on each channel, and you can still edit it until then.
        </p>
      </div>
    </Dialog>
  `
})

export const Sheet: Story = {
  args: { presentation: 'sheet', title: 'Schedule post', confirmLabel: 'Schedule', hint: 'Posts at 9:00 tomorrow' },
  render: sheetRender,
  play: openSheet
}

export const SheetScrolling: Story = {
  args: { ...Sheet.args, paragraphs: 14 } as Story['args'],
  render: sheetRender,
  play: openSheet
}

export const SheetWithoutClose: Story = {
  args: { ...Sheet.args, closable: false },
  render: sheetRender,
  play: async (context) => {
    const sheet = await sheetOf(context)
    const close = within(sheet).getByRole('button', { name: 'Close' })
    await expect(getComputedStyle(close).opacity).toBe('0')
    await userEvent.tab()
    await expect(close).toHaveFocus()
    await waitFor(() => expect(getComputedStyle(close).opacity).toBe('1'))
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument())
  }
}

export const SheetDragToDismiss: Story = {
  args: Sheet.args,
  render: sheetRender,
  play: async (context) => {
    const sheet = await sheetOf(context)
    const handle = sheet.querySelector<HTMLElement>('[data-modal-header]')!
    const { left, top } = handle.getBoundingClientRect()
    const at = (y: number) => ({ clientX: left + 40, clientY: top + y, pointerId: 1, button: 0, bubbles: true })
    handle.dispatchEvent(new PointerEvent('pointerdown', at(4)))
    handle.dispatchEvent(new PointerEvent('pointermove', at(40)))
    await waitFor(() => expect(sheet.style.transform).toBe('translateY(36px)'))
    await new Promise((resolve) => setTimeout(resolve, 200))
    handle.dispatchEvent(new PointerEvent('pointerup', at(40)))
    await waitFor(() => expect(sheet.style.transform).toBe(''))
    handle.dispatchEvent(new PointerEvent('pointerdown', at(4)))
    handle.dispatchEvent(new PointerEvent('pointerup', at(4 + sheet.offsetHeight / 2)))
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument())
  }
}

export const Auto: Story = {
  args: { ...Sheet.args, presentation: 'auto' },
  parameters: {
    docs: { description: { story: 'A sheet on viewports narrower than `sheetBelow` (640px), a dialog above it.' } }
  },
  render: sheetRender,
  play: openAndCheck
}

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

// The app-wide AlertDialog mounts before any dialog, as near the app root, and still confirms on top of one.
export const ConfirmFromInside: Story = {
  render: () => ({
    components: { AlertDialog, Button, Dialog },
    setup() {
      const confirm = useConfirm()
      const answer = ref('No answer yet')
      const ask = async () => {
        const confirmed = await confirm({
          title: 'Delete this view?',
          message: "The records stay; only the view goes. This can't be undone.",
          confirmLabel: 'Delete',
          confirmVariant: 'danger'
        })
        answer.value = confirmed ? 'Deleted' : 'Kept'
      }
      return { open: ref(false), ask, answer }
    },
    template: `
      <AlertDialog />
      <Button size="sm" @click="open = true">Open</Button>
      <Dialog v-model:open="open" title="Edit view" confirm-label="Save">
        <div class="flex items-center gap-3">
          <Button size="sm" variant="danger-outline" @click="ask">Delete view</Button>
          <span>{{ answer }}</span>
        </div>
      </Dialog>
    `
  }),
  play: async (context) => {
    await openAndCheck(context)
    const body = within(document.body)
    await userEvent.click(body.getByRole('button', { name: 'Delete view' }))
    const alert = await body.findByRole('alertdialog')
    await waitFor(() => expect(getComputedStyle(alert).opacity).toBe('1'))
    await expectOnTop(alert)
    await userEvent.click(within(alert).getByRole('button', { name: 'Delete' }))
    await waitFor(() => expect(body.getByText('Deleted')).toBeVisible())
  }
}
