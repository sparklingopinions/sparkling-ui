import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import Avatar from '../Avatar/Avatar.vue'
import Button from '../Button/Button.vue'
import LedgerRow from '../Ledger/LedgerRow.vue'
import TextInput from '../TextInput/TextInput.vue'
import Modal from './Modal.vue'
import { saveHint } from './focus'

const openAndCheck = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open' }))
  const dialog = await within(document.body).findByRole('dialog')
  // Past its scale-in, so axe checks it as drawn.
  await waitFor(() => expect(getComputedStyle(dialog).opacity).toBe('1'))
}

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  args: { title: 'Revoke key', confirmLabel: 'Revoke', size: 'md', closable: true, headerless: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'record', 'lg', 'xl'] },
    confirmVariant: { control: 'inline-radio', options: ['primary', 'danger', 'contrast'] }
  },
  render: (args) => ({
    components: { Button, Modal },
    setup: () => ({ args, open: ref(false) }),
    template: `
      <Button size="sm" @click="open = true">Open</Button>
      <Modal v-bind="args" v-model:open="open" @confirm="open = false">
        Anything using this key stops working right away. This can't be undone.
      </Modal>
    `
  }),
  play: openAndCheck
}

export default meta
type Story = StoryObj<typeof Modal>

export const Default: Story = {}

export const Danger: Story = { args: { size: 'sm', confirmVariant: 'danger' } }

export const Large: Story = { args: { size: 'lg', confirmLabel: undefined } }

export const RecordForm: Story = {
  render: () => ({
    components: { Avatar, Button, LedgerRow, Modal },
    setup: () => ({ open: ref(false), hint: saveHint() }),
    template: `
      <Button size="sm" @click="open = true">Open</Button>
      <Modal v-model:open="open" band="rgb(var(--sui-hue-blue-soft))" confirm-label="Save" :hint="hint" title="Company">
        <template #hero>
          <Avatar name="Analytical Engines" shape="square" size="xl" />
          <span class="text-lg font-semibold text-sui-ink">Analytical Engines</span>
        </template>
        <template #footer-start>
          <Button size="sm" variant="ghost">Delete</Button>
        </template>
        <LedgerRow label="Domain">engines.example</LedgerRow>
        <LedgerRow label="Stage" :divider="false">Customer</LedgerRow>
      </Modal>
    `
  })
}

export const WithAutofocus: Story = {
  render: (args) => ({
    components: { Button, Modal, TextInput },
    setup: () => ({ args, open: ref(false), name: ref('Nightly import') }),
    template: `
      <Button size="sm" @click="open = true">Open</Button>
      <Modal v-bind="args" v-model:open="open" title="Rename key" confirm-label="Save">
        <TextInput v-model="name" aria-label="Name" autofocus />
      </Modal>
    `
  })
}

export const CustomFooter: Story = {
  render: (args) => ({
    components: { Button, Modal },
    setup: () => ({ args, open: ref(false) }),
    template: `
      <Button size="sm" @click="open = true">Open</Button>
      <Modal v-bind="args" v-model:open="open">
        Body text.
        <template #footer>
          <Button variant="danger-outline" @click="open = false">Delete</Button>
          <Button variant="primary" @click="open = false">Done</Button>
        </template>
      </Modal>
    `
  })
}
