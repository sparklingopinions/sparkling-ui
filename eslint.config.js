import js from '@eslint/js'
import vueConfigPrettier from '@vue/eslint-config-prettier'
import storybook from 'eslint-plugin-storybook'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

export default [
  { ignores: ['dist', 'storybook-static', 'node_modules', '!.storybook'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...storybook.configs['flat/recommended'],
  vueConfigPrettier,

  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    }
  },

  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    }
  },

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  },

  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // Type declarations keep `@/` paths, which apps can't resolve, so the library imports relatively.
      'no-restricted-imports': ['error', { patterns: ['@/*'] }],
      // Single-word names (Avatar, Banner, Modal) are the public API; apps import them, so they never clash with HTML.
      'vue/multi-word-component-names': 'off',
      'vue/order-in-components': 'error',
      'vue/component-name-in-template-casing': ['error', 'PascalCase', { registeredComponentsOnly: true }],
      'vue/attributes-order': [
        'error',
        {
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            'UNIQUE',
            'SLOT',
            'TWO_WAY_BINDING',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT'
          ],
          alphabetical: true
        }
      ]
    }
  }
]
