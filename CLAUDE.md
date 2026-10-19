# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product

sparkling-ui is the shared Vue 3 component library for MustLoop, Tamable and every Vue project after them. It replaces PrimeVue in both apps.

- **Vue 3 only.** No multi-framework abstractions.
- **Reka UI is an implementation detail.** It provides accessibility, focus, keyboard and positioning. Apps never import from `reka-ui`: they import only from `sparkling-ui`, whose components, props, slots and events are ours. If Reka ever has to go, only this repo changes.
- **Styled, not headless.** Components ship styled by our semantic tokens, and each app themes them.
- **MustLoop is the reference.** v1 is an extraction of MustLoop's design system (`MustLoop/frontend/src/design-system/`): keep its behaviour and look identical. Note anything that should improve and don't change it unless agreed. Tamable's "Desk" look is a theming fixture that proves the token model, never a reason to change a component.

## Commands

```bash
npm run dev            # Storybook on :6006
npm run build          # vite build (library mode) + vue-tsc declarations into dist/
npm run type-check     # vue-tsc only
npm run lint           # ESLint with auto-fix
npm run format         # Prettier on src/ and .storybook/
npm run test:unit      # Vitest, jsdom
npm run test:stories   # Stories as Vitest browser tests (Playwright Chromium) with axe
npx vitest run src/tests/path/to/file.test.ts
npm run changeset
```

Use Node 22.12 or later (`.nvmrc`); Vitest 5 and Changesets 3 refuse older versions.

## Architecture

### Layout

```
src/
  components/<Name>/   <Name>.vue, its parts, <Name>.stories.ts, index.ts
  composables/         useConfirm, useToast, useColorMode
  styles/              tailwind.css (tokens, theme keys, dark variant) and the optional base.css: what apps import
  stories/             Storybook's Foundations pages (colours, contrast gaps); never built or published
  tests/               unit tests mirroring components/, plus support/ (the axe helper)
  index.ts             the public API: everything apps can import
.storybook/            Storybook config; preview.css loads Tailwind, Inter and the library styles, desk.css the Desk fixture
.changeset/            pending release notes
```

### Build and how apps get the styles

- Vite library mode, ESM only, one output file per module (`preserveModules`) so apps bundle only what they import. `vue`, `reka-ui` and `@tanstack/vue-virtual` stay external.
- Type declarations come from `vue-tsc -p tsconfig.build.json`. Because they keep import paths as written, **the library imports relatively; there is no `@/` alias** (ESLint enforces it).
- **No compiled CSS ships.** Components are styled with Tailwind classes in their templates, and anything a class can't express lives in `src/styles/` (in `@layer components`). Apps import `sparkling-ui/tailwind.css` into their own Tailwind 4 build; its `@source` points at `dist/`, so one build generates the app's classes and the components' together. Consequences:
  - Never build a class name at runtime (`` `bg-${hue}-10` ``): Tailwind can't see it. Use a lookup of full class strings, or an inline style.
  - Don't write `<style>` blocks in components; they would be compiled here and not in the app.
- Apps import `tailwind.css` at the end of their Tailwind entry: an app theme that resets a namespace (Tamable's `--color-*: initial`) would otherwise remove ours. MustLoop's PostCSS inlines imports with `postcss-import` before Tailwind runs; it has to skip `sparkling-ui`, because only Tailwind's resolver reads `exports`.
- Package exports: `.` (components and composables), `./tailwind.css` and `./base.css`. Published to GitHub Packages as `@sparklingopinions/sparkling-ui`; apps alias it to `sparkling-ui`.

### Tokens and classes

- **Tokens are how apps brand the library**: every colour, size and shape a component could reasonably differ by between products is a `--sui-*` variable, never a hard-coded value. The defaults sit in `:where()` selectors, at zero specificity, so an app's plain `:root` override wins wherever it is in its CSS; keep it that way.
- **Colour roles** are RGB channel variables, `--sui-<role>`, with MustLoop's values as the light and dark defaults in `tailwind.css`. Each maps to one step of MustLoop's ramps (`surface` is `--g-0`, `ink-muted` is `--g-50`, `accent` is `--p-100`, a status's `-soft`, `-line`, `-mid` and solid are its 10, 20, 90 and 100); `.storybook/desk.css` applies the same mapping to Tamable's ramps. Add a role with the first component that needs it, from the step MustLoop uses, in both files.
- **Sizes and shapes** (`--sui-button-height`, `--sui-radius-button`, `--sui-shadow-raised`...) are plain CSS values, mode-independent, used through Tailwind's variable shorthand: `h-(--sui-button-height)`, `rounded-(--sui-radius-button)`, `shadow-(--sui-shadow-raised)`, `text-(length:--sui-button-text)`. Desk overrides them too.
- Colour classes are prefixed, `bg-sui-surface`, `text-sui-ink`, so they never meet an app's own colour names. Their theme values end in `/ 1`, the shape MustLoop's PostCSS rewrites opacity modifiers on into plain alpha.
- Components are compiled by each app's Tailwind, so a class must mean the same in plain Tailwind 4 (Storybook, Tamable) and in MustLoop, whose JS theme keeps Tailwind 3's names and replaces the default theme:
  - Not `rounded`, `rounded-sm`, `shadow`, `shadow-sm`, `blur`, bare `ring` or `outline-none`; their sizes moved between 3 and 4. `rounded-md`/`-lg`/`-xl`/`-full`, `shadow-md`/`-lg`/`-xl`, `ring-<n>` and `outline-hidden` are safe.
  - Spacing, sizes and widths only from MustLoop's scale (Tailwind 3's plus 0.75, 1.25, 1.75, 3.25, 4.5, 5.5, 7.5, 8.5, 9.5, 10.5, 13, 18, 22, 62, 85; `max-w-` only 0, 90, 95, 130, 140 and the named sizes up to 7xl, but not `3xs`/`2xs`, which differ). Anything else as an arbitrary value: `max-w-[16rem]`.
  - Custom font sizes (`text-13`, `text-12.5`) and tracking (`tracking-caps`) are defined in `tailwind.css` with MustLoop's values; never redefine a shared name with a different value.
- Never copy a class MustLoop's theme doesn't define (`bg-blue-500`, `text-gray-600`): it renders nothing there, but would render in an app with Tailwind's default palette.

### Tests and stories

Every component gets three things in the same commit:

- **A unit test** in `src/tests/` (Vitest + Vue Test Utils, jsdom) that ends with `await expectAccessible(wrapper.element)` from `tests/support/axe.ts`. Mount with `attachTo: document.body`. Colour contrast is off there: jsdom can't compute it.
- **Stories** in `<Name>.stories.ts`, covering each variant and state. Story tests run every story in Chromium, once in light and once in dark (the `stories-light` and `stories-dark` projects), and fail on any axe violation, contrast included.
  - MustLoop's colours keep some text pairs below WCAG AA. Foundations/Contrast gaps (`src/stories/ContrastPairs.vue`) lists every text pair the components use with live ratios in both modes; add a pair there when a component introduces one. A story that shows one turns off only the `color-contrast` rule (`parameters.a11y.config.rules`), with a comment naming the pair. Fixing a gap changes the look, so it waits for agreement.
- **An export** from `src/index.ts`, with its prop types.

Pre-bundle any new dependency the stories need in `optimizeDeps.include` (`vitest.config.ts`); found mid-run on a cold cache, it reloads the page and fails the run.

### Versioning

Changesets. Stay on 0.x until both apps are migrated. A PR that changes what apps get adds a changeset written for the app developer reading the changelog.

## Code style

- Vue 3 Composition API with `<script setup lang="ts">`, TypeScript `strict` (the public types are what apps code against)
- Prettier: no semicolons, single quotes, 120 print width, no trailing commas; imports sorted by `@trivago/prettier-plugin-sort-imports` (`vue`, `reka-ui`, other packages, relative). Run `npm run format` after adding imports
- Components are imported where they're used, never registered globally, and written in PascalCase in templates
- Every user-visible string is a prop with a sentence-case English default (`closeLabel`, `cancelLabel`), so apps can translate
- Minimal comments: only a short, non-obvious "why"
- Never use em-dashes anywhere: code, comments, docs, commits, copy
- Sentence case in UI copy, no emoji

## Dependencies

The agreed runtime dependencies are `reka-ui` and `@tanstack/vue-virtual` (each added with the first component that uses it), with `vue` and `tailwindcss` as peers. **Ask before adding any other runtime dependency.** Dev dependencies are fine.
