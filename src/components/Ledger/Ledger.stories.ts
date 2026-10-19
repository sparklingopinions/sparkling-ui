import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import Avatar from '../Avatar/Avatar.vue'
import Button from '../Button/Button.vue'
import LedgerModal from './LedgerModal.vue'
import LedgerMore from './LedgerMore.vue'
import LedgerRow from './LedgerRow.vue'

const meta: Meta<typeof LedgerModal> = {
  title: 'Components/Ledger',
  component: LedgerModal,
  parameters: {
    docs: {
      description: {
        component:
          "A record's form: `LedgerModal` (a tinted band with the title and a centred hero, a footer that saves on ⌘ or Ctrl Enter), `LedgerRow` (a quiet label beside a value) and `LedgerMore` (rarely used fields, folded away)."
      }
    }
  },
  render: () => ({
    components: { Avatar, Button, LedgerModal, LedgerMore, LedgerRow },
    setup: () => ({ open: ref(false) }),
    template: `
      <Button size="sm" @click="open = true">Open</Button>
      <LedgerModal v-model:open="open" band-class="bg-sui-accent-wash" confirm-label="Add contact" title="New contact" @submit="open = false">
        <template #band>
          <Avatar name="Ada Lovelace" size="xl" />
          <span class="text-lg font-semibold text-sui-ink">Ada Lovelace</span>
        </template>
        <LedgerRow label="Email">ada@example.com</LedgerRow>
        <LedgerRow label="Company">Analytical Engines</LedgerRow>
        <LedgerMore :filled="false" summary="Phone, birthday">
          <LedgerRow label="Phone">+44 20 7946 0000</LedgerRow>
        </LedgerMore>
      </LedgerModal>
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

export const Default: StoryObj<typeof LedgerModal> = {}
