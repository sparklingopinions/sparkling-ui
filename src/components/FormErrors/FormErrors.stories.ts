import type { Meta, StoryObj } from '@storybook/vue3-vite'

import FormErrors from './FormErrors.vue'

const meta: Meta<typeof FormErrors> = {
  title: 'Components/FormErrors',
  component: FormErrors,
  args: { errors: ['Name is required', 'Email is not a valid address'] }
}

export default meta

export const Default: StoryObj<typeof FormErrors> = {}
