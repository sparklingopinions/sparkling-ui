import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.ts'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: { name: '@storybook/vue3-vite', options: { docgen: 'vue-component-meta' } },
  // vite.config.ts builds the library; Storybook builds an app from the same plugins.
  viteFinal: (viteConfig) => {
    if (viteConfig.build) delete viteConfig.build.lib
    return viteConfig
  }
}

export default config
