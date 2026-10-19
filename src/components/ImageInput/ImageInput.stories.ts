import { ref } from 'vue'

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import ImageInput from './ImageInput.vue'

const photo =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#c96"/><circle cx="32" cy="26" r="12" fill="#fed"/></svg>'
  )

const meta: Meta<typeof ImageInput> = {
  title: 'Components/ImageInput',
  component: ImageInput,
  args: { variant: 'circle', size: 64 },
  argTypes: { variant: { control: 'inline-radio', options: ['circle', 'square'] } },
  render: (args) => ({
    components: { ImageInput },
    setup: () => ({ args, image: ref<File | null>(null), url: ref<string | null>(args.imageUrl ?? null) }),
    template: '<ImageInput v-bind="args" v-model:image="image" v-model:image-url="url" />'
  })
}

export default meta
type Story = StoryObj<typeof ImageInput>

export const Empty: Story = {}

export const WithImage: Story = { args: { imageUrl: photo } }

export const Square: Story = { args: { variant: 'square', size: 96, imageUrl: photo, label: 'Choose a logo' } }
