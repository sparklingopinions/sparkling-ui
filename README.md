# sparkling-ui

The shared Vue 3 component library for MustLoop, Tamable and every Vue project after them. Components ship styled by semantic tokens, and each app themes them. Accessibility, focus, keyboard and positioning come from Reka UI underneath, but apps only ever import from sparkling-ui.

For architecture and conventions, see [`CLAUDE.md`](CLAUDE.md).

## Requirements

- Node.js 22.12+ (CI uses the version in `.nvmrc`)
- In the app: Vue 3.5+ and Tailwind CSS 4

## Using it in an app

The package is published privately to GitHub Packages as `@sparklingopinions/sparkling-ui`. Apps install it under the name `sparkling-ui`, so imports read `from 'sparkling-ui'`.

1. Point the scope at GitHub Packages in the app's `.npmrc`:

   ```
   @sparklingopinions:registry=https://npm.pkg.github.com
   ```

   Locally, add a GitHub token with `read:packages` to `~/.npmrc` (`//npm.pkg.github.com/:_authToken=...`). In GitHub Actions, give the app's repository access to the package and pass `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}` to `npm ci`.

2. Install it:

   ```bash
   npm install sparkling-ui@npm:@sparklingopinions/sparkling-ui
   ```

3. Import its stylesheet at the end of the app's Tailwind entry, after the app's own theme:

   ```css
   @import 'tailwindcss';

   @theme {
     /* the app's theme */
   }

   @import 'sparkling-ui/tailwind.css';
   ```

   The app's Tailwind build then generates the classes the components use, next to its own. It has to come after the theme: a theme that resets a namespace (`--color-*: initial`) would remove the library's colours too. If the app's PostCSS inlines imports before Tailwind runs (`postcss-import`), leave `sparkling-ui` imports to Tailwind, which reads the package's `exports`.

   For pages without defaults of their own (text colour, canvas, selection, scrollbars), also import `sparkling-ui/base.css`.

4. Brand the components by overriding any token, in any CSS file of the app. The library's defaults have zero specificity, so a plain `:root` rule wins wherever it sits:

   ```css
   /* One value for both modes */
   :root,
   [data-mode] {
     --sui-radius-button: 0.375rem;
   }

   /* Or one per mode: colours are RGB channels */
   :root,
   [data-mode='light'] {
     --sui-accent: 47 79 201;
     --sui-accent-hover: 39 66 174;
   }

   [data-mode='dark'] {
     --sui-accent: 143 168 255;
     --sui-accent-hover: 166 185 255;
   }
   ```

   Include `[data-mode]` in the selector, so a section that sets its own mode (`<div data-mode="dark">`) gets the app's values too. A colour set only for light also applies in dark (`:root` is the page in either mode), replacing the dark default: set both, as above. Colour roles (`--sui-surface`, `--sui-ink`, `--sui-accent`, `--sui-danger` and the rest) are listed in Storybook under Foundations/Colors; sizes and shapes are `--sui-button-height`, `--sui-button-padding-x`, `--sui-button-text`, `--sui-radius-button` and `--sui-shadow-raised`. The defaults are MustLoop's, and Storybook's toolbar switches to a second theme (Tamable's Desk) to show what an override set looks like (`.storybook/desk.css`).

5. Import components where they're used:

   ```ts
   import { Button } from 'sparkling-ui'
   ```

6. To use `Icon`, register the app's icons once, before mounting. With SVG files imported as components (e.g. `vite-svg-loader`):

   ```ts
   import { defineAsyncComponent } from 'vue'

   import { setIconResolver } from 'sparkling-ui'

   setIconResolver((name) => defineAsyncComponent(() => import(`./assets/icons/${name}.svg`)))
   ```

   Then `<Icon name="mail" color="ink-muted" />`. Icons the library's own components need (a dialog's close button, a select's chevron) are built in.

## Local setup

```bash
npm install
npx playwright install chromium   # once, for the story tests
npm run dev                       # Storybook on http://localhost:6006
```

To try unreleased changes in an app, install the local checkout: `npm install sparkling-ui@file:../sparkling-ui` in the app, then `npm run build` here after each change.

## Commands

```bash
npm run dev            # Storybook
npm run build          # Library build into dist/, with type declarations
npm run type-check     # vue-tsc only
npm run lint           # ESLint with auto-fix
npm run format         # Prettier on src/ and .storybook/
npm run test:unit      # Vitest unit tests (jsdom, with an axe check per component)
npm run test:stories   # Every story as a browser test, in light and dark, failing on any axe violation
npm run changeset      # Describe a change for the next release
```

## Releasing

Every PR that changes what apps get adds a changeset (`npm run changeset`). Merging to `main` opens a "Version packages" PR; merging that one publishes the new version to GitHub Packages and tags it.
