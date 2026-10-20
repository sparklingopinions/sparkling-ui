import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import Avatar from '../Avatar/Avatar.vue'
import Button from '../Button/Button.vue'
import Dialog from '../Dialog/Dialog.vue'
import { saveHint } from '../Dialog/focus'
import Collapsible from './Collapsible.vue'
import PropertyRow from './PropertyRow.vue'

const meta: Meta<typeof PropertyRow> = {
  title: 'Components/Data display/PropertyRow',
  component: PropertyRow,
  parameters: {
    docs: {
      description: {
        component:
          "A record's rows: `PropertyRow` (a quiet label beside a value) and `Collapsible` (rarely used fields, folded away). Here inside a `Dialog` with a `band` and a `hero`, as a record form; they work in a panel or a page too."
      }
    }
  },
  render: () => ({
    components: { Avatar, Button, Collapsible, PropertyRow, Dialog },
    setup: () => ({ open: ref(false), hint: saveHint() }),
    template: `
      <Button size="sm" @click="open = true">Open</Button>
      <Dialog v-model:open="open" band confirm-label="Add contact" :hint="hint" title="New contact" @confirm="open = false">
        <template #hero>
          <Avatar name="Ada Lovelace" size="xl" />
          <span class="text-lg font-semibold text-sui-ink">Ada Lovelace</span>
        </template>
        <PropertyRow label="Email">ada@example.com</PropertyRow>
        <PropertyRow label="Company">Analytical Engines</PropertyRow>
        <Collapsible summary="Phone, birthday">
          <PropertyRow label="Phone">+44 20 7946 0000</PropertyRow>
        </Collapsible>
      </Dialog>
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

export const Default: StoryObj<typeof PropertyRow> = {}
