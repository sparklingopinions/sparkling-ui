import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import Avatar from '../Avatar/Avatar.vue'
import Button from '../Button/Button.vue'
import Modal from '../Modal/Modal.vue'
import { saveHint } from '../Modal/focus'
import LedgerMore from './LedgerMore.vue'
import LedgerRow from './LedgerRow.vue'

const meta: Meta<typeof LedgerRow> = {
  title: 'Components/Ledger',
  component: LedgerRow,
  parameters: {
    docs: {
      description: {
        component:
          "A record's rows: `LedgerRow` (a quiet label beside a value) and `LedgerMore` (rarely used fields, folded away). Here inside a `Modal` with a `band` and a `hero`, as a record form; they work in a panel or a page too."
      }
    }
  },
  render: () => ({
    components: { Avatar, Button, LedgerMore, LedgerRow, Modal },
    setup: () => ({ open: ref(false), hint: saveHint() }),
    template: `
      <Button size="sm" @click="open = true">Open</Button>
      <Modal v-model:open="open" band confirm-label="Add contact" :hint="hint" title="New contact" @confirm="open = false">
        <template #hero>
          <Avatar name="Ada Lovelace" size="xl" />
          <span class="text-lg font-semibold text-sui-ink">Ada Lovelace</span>
        </template>
        <LedgerRow label="Email">ada@example.com</LedgerRow>
        <LedgerRow label="Company">Analytical Engines</LedgerRow>
        <LedgerMore summary="Phone, birthday">
          <LedgerRow label="Phone">+44 20 7946 0000</LedgerRow>
        </LedgerMore>
      </Modal>
    `
  }),
  // Opened in the test, so axe checks the open dialog.
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open' }))
    const dialog = await within(document.body).findByRole('dialog')
    await waitFor(() => expect(getComputedStyle(dialog).opacity).toBe('1'))
  }
}

export default meta

export const Default: StoryObj<typeof LedgerRow> = {}
