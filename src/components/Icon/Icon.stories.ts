import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Icon from './Icon.vue'
import { iconColors } from './colors'
import { iconNames } from './resolver'

const meta: Meta<typeof Icon> = {
  title: 'Components/Data display/Icon',
  component: Icon,
  args: { name: 'plus' },
  argTypes: {
    name: { control: 'select', options: iconNames },
    color: { control: 'select', options: Object.keys(iconColors) }
  },
  parameters: {
    docs: {
      description: {
        component:
          "A 16px icon from the library's set, by name, coloured by a role. Older names (`people`, `companies`, `dot-vertical`...) still resolve. An app adds or replaces icons with `setIconResolver((name) => component)`; names it returns a component for win."
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof Icon>

export const Default: Story = {}

export const Coloured: Story = { args: { color: 'accent' } }

export const Labelled: Story = { args: { name: 'check', label: 'Done', color: 'success' } }

export const Colours: Story = {
  render: () => ({
    components: { Icon },
    setup: () => ({ colors: Object.keys(iconColors) }),
    template: `
      <ul class="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-3 text-13 text-sui-ink">
        <li v-for="color in colors" :key="color" class="flex items-center gap-2">
          <Icon :color="color" name="inbox" />
          <code>{{ color }}</code>
        </li>
      </ul>
    `
  })
}

export const Set: Story = {
  render: () => ({
    components: { Icon },
    setup: () => ({ names: iconNames }),
    template: `
      <ul class="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-3 text-13 text-sui-ink">
        <li v-for="name in names" :key="name" class="flex items-center gap-2">
          <Icon color="ink-body" :name="name" />
          <code>{{ name }}</code>
        </li>
      </ul>
    `
  })
}

const groups = {
  Content: [
    'lightbulb',
    'square-pen',
    'message-square',
    'messages',
    'message-quote',
    'reply',
    'send',
    'image',
    'images',
    'captions',
    'smile',
    'globe',
    'webhook',
    'external-link'
  ],
  Scheduling: ['calendar-check', 'calendar-x', 'calendar-clock', 'clock', 'history'],
  Editing: ['split', 'merge', 'layers', 'undo-2', 'redo', 'list-checks', 'keyboard'],
  Layout: ['maximize', 'minimize', 'panel-right', 'panel-right-close', 'sun-moon', 'sun', 'moon'],
  State: ['circle-dashed', 'circle-half', 'circle-check', 'circle-alert', 'triangle-alert', 'key-round', 'lock']
}

const statusIcons = [
  'hourglass',
  'bell-ring',
  'snooze',
  'mail-x',
  'flag',
  'sprout',
  'compass',
  'flask',
  'heart',
  'trophy',
  'thermometer-low',
  'heart-crack',
  'phone',
  'calendar-users',
  'sticky-note',
  'sparkles',
  'circle-minus',
  'sparkle',
  'circle-help',
  'info',
  'command',
  'mail'
]

export const StatusIcons: Story = {
  render: () => ({
    components: { Icon },
    setup: () => ({ names: statusIcons }),
    template: `
      <div class="flex flex-col gap-5 text-13 text-sui-ink">
        <section v-for="size in ['size-4', 'size-6']" :key="size">
          <h3 class="m-0 mb-2 text-xs font-medium text-sui-ink-muted">{{ size === 'size-4' ? '16px' : '24px' }}</h3>
          <ul class="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-3 p-0">
            <li v-for="name in names" :key="name" class="flex items-center gap-2">
              <Icon :class="size" color="ink-body" :name="name" />
              <code>{{ name }}</code>
            </li>
          </ul>
        </section>
      </div>
    `
  })
}

export const ByJob: Story = {
  name: 'By job',
  render: () => ({
    components: { Icon },
    setup: () => ({ groups }),
    template: `
      <div class="flex flex-col gap-5 text-13 text-sui-ink">
        <section v-for="(names, group) in groups" :key="group">
          <h3 class="m-0 mb-2 text-xs font-medium text-sui-ink-muted">{{ group }}</h3>
          <ul class="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-3 p-0">
            <li v-for="name in names" :key="name" class="flex items-center gap-2">
              <Icon color="ink-body" :name="name" />
              <code>{{ name }}</code>
            </li>
          </ul>
        </section>
      </div>
    `
  })
}
