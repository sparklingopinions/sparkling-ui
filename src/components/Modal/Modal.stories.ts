import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import Button from '../Button/Button.vue'
import TextInput from '../TextInput/TextInput.vue'
import Modal from './Modal.vue'

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
  argTypes: { size: { control: 'inline-radio', options: ['md', 'lg', 'xl'] } },
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

export const Large: Story = { args: { size: 'lg', confirmLabel: undefined } }

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
