import type { Preview } from '@storybook/vue3-vite'

import './preview.css'

const preview: Preview = {
  parameters: {
    // Story tests fail on any axe violation, colour contrast included.
    a11y: { test: 'error' },
    controls: { expanded: true },
    // The design system's groups, in its order.
    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundations',
          ['Color', 'Typography', 'Layout', 'Interaction', 'Content', 'Iconography'],
          'Components',
          [
            'Actions',
            ['Button', 'Toolbar', 'DropdownMenu', 'ContextMenu'],
            'Forms',
            [
              'Input',
              'Textarea',
              'FormField',
              'Checkbox',
              'Radio',
              'SegmentedControl',
              'Select',
              'Calendar',
              'ImageUpload',
              'ErrorSummary',
              'Editable',
              'PropertyList'
            ],
            'Data display',
            ['Avatar', 'Badge', 'Tag', 'Kbd', 'Icon', 'PropertyRow', 'Collapsible', 'Meter', 'PricingCard'],
            'Collections',
            ['Table', 'DataList', 'Board', 'FilterChip', 'FilterMenu', 'SortMenu', 'ActionBar', 'Pagination'],
            'Feedback',
            ['Alert', 'EmptyState', 'Toaster', 'Tooltip', 'Spinner', 'Skeleton', 'TypingIndicator'],
            'Overlays',
            ['Dialog', 'AlertDialog', 'Popover', 'PopoverDialog']
          ]
        ]
      }
    }
  },
  globalTypes: {
    mode: {
      description: 'Colour mode',
      toolbar: { title: 'Mode', icon: 'mirror', items: ['light', 'dark'], dynamicTitle: true }
    },
    theme: {
      description: 'Theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default' },
          { value: 'desk', title: 'Desk (a second theme)' }
        ],
        dynamicTitle: true
      }
    }
  },
  // The story tests run once per mode; see vitest.config.ts.
  initialGlobals: { mode: import.meta.env.STORY_MODE ?? 'light', theme: 'default' },
  decorators: [
    (story, context) => {
      const root = document.documentElement
      root.dataset.mode = context.globals.mode
      if (context.globals.theme === 'default') delete root.dataset.theme
      else root.dataset.theme = context.globals.theme
      return story()
    }
  ]
}

export default preview
