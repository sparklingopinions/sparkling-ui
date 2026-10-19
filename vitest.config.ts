import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // Until the first component lands; remove with it.
      passWithNoTests: true,
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
        {
          extends: true,
          plugins: [storybookTest({ configDir: '.storybook' })],
          // Found mid-run on a cold cache (always, in CI), Vite reloads the page and the run fails.
          optimizeDeps: { include: ['vue'] },
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              headless: true,
              provider: playwright(),
              instances: [{ browser: 'chromium' }]
            }
          }
        }
      ]
    }
  })
)
