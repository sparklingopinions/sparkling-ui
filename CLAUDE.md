# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product

sparkling-ui is a product-agnostic Vue 3 component library for calm, dense, work-focused software. Its first consumers are MustLoop and Tamable, where it replaces PrimeVue, but it belongs to neither.

- **Product-agnostic.** No logo, no product vocabulary: component names, props, default copy, stories, docs and changesets use neutral words (an inbox, a record, people by stage), never a product's names or terms. Products bring their own names, marks and copy through props and theming.
- **Vue 3 only.** No multi-framework abstractions.
- **Reka UI is an implementation detail.** It provides accessibility, focus, keyboard and positioning. Apps never import from `reka-ui`: they import only from `sparkling-ui`, whose components, props, slots and events are ours. If Reka ever has to go, only this repo changes.
- **Styled, not headless.** Components ship styled by our semantic tokens, and each app themes them.
- **The design system is the reference.** v1 was extracted from MustLoop's design system. Its look and API now follow the Sparkling UI design system, a Design System artifact in Claude (https://claude.ai/artifact/BjVaiu6EYEUKLMwMKaWT66, read with the Artifact tool; the standalone Claude Design project it came from no longer changes). Under `project/`: `components/sui.css`, each component's `components/<Name>/` (`README.md`, `.d.ts`, `preview.html`), the `.jsx` sources in `components/src/`, and `tokens/`. It fixes the original's gaps (focus, contrast, an undesigned paginator) and consolidates components: one Dialog, one Select, one Toaster, one Editable. Names follow common UI-library conventions (Radix, shadcn, MUI); former names stay exported from `src/aliases.ts`, marked deprecated. A change the design system doesn't show is agreed first. Tamable's "Desk" look is a theming fixture that proves the token model, never a reason to change a component.

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
  stories/             Storybook's Foundations pages (colours, contrast); never built or published
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
- Package exports: `.` (components and composables), `./tailwind.css` and `./base.css`. Published publicly to npm as `@sparklingopinions/sparkling-ui`; apps alias it to `sparkling-ui`.

### Tokens and classes

- **Tokens are how apps brand the library**: every colour, size and shape a component could reasonably differ by between products is a `--sui-*` variable, never a hard-coded value. The defaults sit in `:where()` selectors, at zero specificity, so an app's plain `:root` override wins wherever it is in its CSS; keep it that way.
- **Colour roles** are RGB channel variables, `--sui-<role>`, with the base theme's values (MustLoop's originally) as the light and dark defaults in `tailwind.css`, including the WCAG AA fix Claude Design made to them (`Contrast Fix.dc.html` in the MustLoop design project) and the fixes from the Sparkling UI design system (`Fixes.html`: `line-control`, a darker light ink ramp, the orange hue, Desk's status inks). Each maps to one step of MustLoop's ramps (`surface` is `--g-0`, `ink-muted` and `ink-faint` are `--g-50`, `accent` is `--p-100` and `accent-solid` `--p-90`, a status's `-soft` and `-line` are its 10 and 20); `.storybook/desk.css` applies the same mapping to Tamable's ramps. Add a role with the first component that needs it, with the design system's values, in both files.
- **Text roles and fill roles are separate**, so every text pair keeps 4.5:1 in both modes. `accent` and `danger` colour text; fills with white text on them use `accent-solid` and `danger-solid`, whose hovers (`accent-hover`, `danger-hover`) deepen in both modes. `ink-faint` is text (placeholders); a faint mark that isn't text (a dot, a scrollbar) uses `mark-faint`. A checkbox's or radio's boundary uses `line-control`, which holds 3:1 for WCAG 1.4.11. Text fields, textareas and select triggers rest on `line-strong` and darken to `ink-muted` on hover: agreed on purpose (calmer forms, a visible hover), though their resting border is below 3:1. `line` and `line-subtle` are for dividers and containers.
- **Focus is one ring**, the `sui-ring` utilities in `tailwind.css`, always behind a variant: `focus-visible:sui-ring` (outside, 2px gap) for buttons and small controls, `focus-visible:sui-ring-field` for fields (a soft 3px `focus-ring` halo, with the field's border turned `accent`, which carries the contrast), `focus-visible:sui-ring-inset` for menu items, segments and options, and `sui-ring-inverse` on inverse surfaces. A field's border turns `accent` on `:focus`. Never a `ring-*` utility or the browser's outline.
- **Sizes and shapes** (`--sui-button-height`, `--sui-radius-button`, `--sui-shadow-raised`...) are plain CSS values, mode-independent, used through Tailwind's variable shorthand: `h-(--sui-button-height)`, `rounded-(--sui-radius-button)`, `shadow-(--sui-shadow-raised)`, `text-(length:--sui-button-text)`. Desk overrides them too.
- Colour classes are prefixed, `bg-sui-surface`, `text-sui-ink`, so they never meet an app's own colour names. Their theme values end in `/ 1`, the shape MustLoop's PostCSS rewrites opacity modifiers on into plain alpha.
- Components are compiled by each app's Tailwind, so a class must mean the same in plain Tailwind 4 (Storybook, Tamable) and in MustLoop, whose JS theme keeps Tailwind 3's names and replaces the default theme:
  - Not `rounded-sm`, `shadow`, `shadow-sm`, `blur`, `blur-sm`, bare `ring` or `outline-none`; their sizes moved between 3 and 4. `rounded`, `rounded-md`/`-lg`/`-xl`/`-full`, `shadow-md`/`-lg`/`-xl`, `ring-<n>` and `outline-hidden` are safe.
  - Spacing, sizes and widths only from MustLoop's scale (Tailwind 3's plus 0.75, 1.25, 1.75, 3.25, 4.5, 5.5, 7.5, 8.5, 9.5, 10.5, 13, 18, 22, 62, 85; `max-w-` only 0, 90, 95, 130, 140 and the named sizes up to 7xl, but not `3xs`/`2xs`, which differ). Anything else as an arbitrary value: `max-w-[16rem]`.
  - Custom font sizes (`text-13`, `text-12.5`) and tracking (`tracking-caps`) are defined in `tailwind.css` with MustLoop's values; never redefine a shared name with a different value.
- Apps may load `@tailwindcss/forms` (MustLoop and Tamable do): its `[type='text']:focus` and similar rules outrank plain utilities, so a bare field inside a component also cancels them with `focus:` classes (`focus:border-none focus:shadow-none focus:ring-0`).
- Never copy a class MustLoop's theme doesn't define (`bg-blue-500`, `text-gray-600`): it renders nothing there, but would render in an app with Tailwind's default palette.

### Layers

Every floating layer (Dialog, Popover, Select, DropdownMenu, ContextMenu, the filter panels, Tooltip) is `z-[1100]`, and layers on one z-index stack in the order their portals mount: a menu inside a dialog mounts after it, so it's on top. Above them sit the floating ActionBar (`1150`), the AlertDialog (`1160`: an app mounts it once near the root, before any dialog, and a confirmation always belongs on top) and the Toaster (`1200`).

### Icons

`Icon` draws the library's set (`components/Icon/iconSet.ts`: the design system's 114 icons with neutral names, plus `iconAliases` for older and common names). An app adds icons or replaces some with `setIconResolver`; its components win. A library component that needs a glyph of its own (close, chevron, check) draws it inline as an internal component, so an app's overrides never change it. Icon colours are a lookup of full class strings per role (`colors.ts`), as with any class.

### Tests and stories

Every component gets three things in the same commit:

- **A unit test** in `src/tests/` (Vitest + Vue Test Utils, jsdom) that ends with `await expectAccessible(wrapper.element)` from `tests/support/axe.ts`. Mount with `attachTo: document.body`. Colour contrast is off there: jsdom can't compute it. `tests/support/setup.ts` fills in what jsdom lacks (`scrollIntoView`).
- **Stories** in `<Name>.stories.ts`, covering each variant and state, titled by the design system's group: `Components/<Actions | Forms | Data display | Collections | Feedback | Overlays>/<Name>`, with the order in `.storybook/preview.ts`'s `storySort`; foundation pages go under `Foundations/<Color | Typography | Layout | Interaction | Content | Iconography>`. Story tests run every story in Chromium, once in light and once in dark (the `stories-light` and `stories-dark` projects), and fail on any axe violation, contrast included.
  - Every text pair meets WCAG AA in both modes, and no story turns the contrast rule off. Foundations/Contrast (`src/stories/ContrastPairs.vue`) lists every text pair the components use with live ratios; add a pair there when a component introduces one. axe doesn't check every text (it skipped single-letter avatar initials), so a new pair's ratio is checked there too.
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
