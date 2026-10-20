import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ColorRoles from './ColorRoles.vue'

const meta: Meta<typeof ColorRoles> = {
  title: 'Foundations/Color/Roles',
  component: ColorRoles,
  parameters: { layout: 'fullscreen' }
}

export default meta

export const Roles: StoryObj<typeof ColorRoles> = {}
