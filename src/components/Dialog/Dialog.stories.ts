import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import Avatar from '../Avatar/Avatar.vue'
import Button from '../Button/Button.vue'
import Input from '../Input/Input.vue'
import PropertyRow from '../PropertyRow/PropertyRow.vue'
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
