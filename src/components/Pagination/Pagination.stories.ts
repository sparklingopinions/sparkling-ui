import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Pagination from './Pagination.vue'

const meta: Meta<typeof Pagination> = {
  title: 'Components/Collections/Pagination',
  component: Pagination,
  args: { pageCount: 40 },
  render: (args, { parameters }) => ({
    components: { Pagination },
    setup: () => ({ args, page: ref(parameters.page ?? 8) }),
    template: '<Pagination v-bind="args" v-model:page="page" />'
  })
}

export default meta

type Story = StoryObj<typeof Pagination>

export const Middle: Story = {}

export const FirstPage: Story = { parameters: { page: 1 } }

export const LastPage: Story = { parameters: { page: 40 } }

export const FewPages: Story = { args: { pageCount: 5 }, parameters: { page: 2 } }

export const WithoutEnds: Story = { args: { showEnds: false } }

export const MoreSiblings: Story = { args: { siblingCount: 2, boundaryCount: 2 } }

export const Disabled: Story = { args: { disabled: true } }
