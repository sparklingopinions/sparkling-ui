import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { useConfirm } from '../../composables/useConfirm'
import Button from '../Button/Button.vue'
import ConfirmDialog from './ConfirmDialog.vue'

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    docs: {
      description: {
        component:
          "Mount one `<ConfirmDialog />` near the app root. Anywhere below it, `const confirm = useConfirm()` and `if (await confirm({ title, message, confirmLabel, confirmVariant: 'danger' }))`: it resolves true when confirmed, false when cancelled or dismissed."
      }
    }
  },
  render: () => ({
    components: { Button, ConfirmDialog },
    setup() {
      const confirm = useConfirm()
      const answer = ref<string>('No answer yet')
      const ask = async () => {
        const confirmed = await confirm({
          title: 'Revoke Nightly import?',
          message: "Anything using this key stops working right away. This can't be undone.",
          confirmLabel: 'Revoke',
          confirmVariant: 'danger'
        })
        answer.value = confirmed ? 'Confirmed' : 'Cancelled'
      }
      return { ask, answer }
    },
    template: `
      <div class="flex items-center gap-3 text-sm text-sui-ink">
        <Button size="sm" @click="ask">Revoke key</Button>
        <span>{{ answer }}</span>
      </div>
      <ConfirmDialog />
    `
  })
}

export default meta

export const Default: StoryObj<typeof ConfirmDialog> = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Revoke key' }))
    const dialog = await within(document.body).findByRole('alertdialog')
    await waitFor(() => expect(getComputedStyle(dialog).opacity).toBe('1'))
  }
}
