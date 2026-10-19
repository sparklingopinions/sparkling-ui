import type { Preview } from '@storybook/vue3-vite'

import './preview.css'

const preview: Preview = {
  parameters: {
    // Story tests fail on any axe violation, colour contrast included.
    a11y: { test: 'error' },
    controls: { expanded: true }
  },
  globalTypes: {
    mode: {
      description: 'Colour mode',
      toolbar: { title: 'Mode', icon: 'mirror', items: ['light', 'dark'], dynamicTitle: true }
    }
  },
  initialGlobals: { mode: 'light' },
  decorators: [
    (story, context) => {
      document.documentElement.dataset.mode = context.globals.mode
      return story()
    }
  ]
}

export default preview
