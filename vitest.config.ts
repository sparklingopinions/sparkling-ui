import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config.ts'

// Every story runs as a browser test in each mode, so axe checks contrast in both.
const storyProject = (mode: 'light' | 'dark') => ({
  extends: true,
  plugins: [storybookTest({ configDir: '.storybook' })],
  define: { 'import.meta.env.STORY_MODE': JSON.stringify(mode) },
  // Found mid-run on a cold cache (always, in CI), Vite reloads the page and the run fails.
  optimizeDeps: { include: ['vue', 'reka-ui'] },
  test: {
    name: `stories-${mode}`,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' as const }]
    }
  }
})

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            globals: true,
            environment: 'jsdom',
            include: ['src/tests/**/*.test.ts']
          }
        },
        storyProject('light'),
        storyProject('dark')
      ]
    }
  })
)
