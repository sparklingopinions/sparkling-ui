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

3. Import its stylesheet into the app's Tailwind entry, after Tailwind itself:

   ```css
   @import 'tailwindcss';
   @import 'sparkling-ui/tailwind.css';
   ```

   The app's Tailwind build then generates the classes the components use, next to its own.

4. Import components where they're used:

   ```ts
   import { Avatar } from 'sparkling-ui'
   ```

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
npm run test:stories   # Every story as a browser test, failing on any axe violation
npm run changeset      # Describe a change for the next release
```

## Releasing

Every PR that changes what apps get adds a changeset (`npm run changeset`). Merging to `main` opens a "Version packages" PR; merging that one publishes the new version to GitHub Packages and tags it.
