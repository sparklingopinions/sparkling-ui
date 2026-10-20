import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ErrorSummary from './ErrorSummary.vue'

const meta: Meta<typeof ErrorSummary> = {
  title: 'Components/Forms/ErrorSummary',
  component: ErrorSummary,
  args: { errors: ['Name is required', 'Email is not a valid address'] }
}

export default meta

export const Default: StoryObj<typeof ErrorSummary> = {}
