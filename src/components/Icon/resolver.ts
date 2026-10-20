import { type Component, type FunctionalComponent, h } from 'vue'

import { type IconDefinition, iconAliases, iconSet } from './iconSet'

/** Turns an icon name into its component, e.g. an SVG file imported as a component. */
export type IconResolver = (name: string) => Component | undefined

let resolver: IconResolver | undefined

/** Adds or replaces icons: names the resolver returns a component for win over the library's set. */
export function setIconResolver(next: IconResolver) {
  resolver = next
}

/** Every name in the library's set (not counting aliases). */
export const iconNames = Object.keys(iconSet)

const builtins = new Map<string, FunctionalComponent>()

// Inline styles, so a colour class (stroke-* fill-*) only paints the half the icon is drawn with.
function draw(icon: IconDefinition): FunctionalComponent {
  const small = icon.viewBox.endsWith(' 8 8')
  return () =>
    h('svg', {
      width: small ? 8 : 16,
      height: small ? 8 : 16,
      viewBox: icon.viewBox,
      fill: icon.filled ? 'currentColor' : 'none',
      stroke: icon.filled ? 'none' : 'currentColor',
      style: icon.filled ? 'stroke: none' : 'fill: none',
      'stroke-width': icon.stroke,
      'stroke-linecap': icon.cap,
      'stroke-linejoin': icon.join,
      innerHTML: icon.body
    })
}

export function resolveIcon(name: string): Component | undefined {
  const own = resolver?.(name)
  if (own) return own
  const key = iconSet[name] ? name : iconAliases[name]
  if (!key) {
    console.warn(`[sparkling-ui] No icon named "${name}".`)
    return undefined
  }
  if (!builtins.has(key)) builtins.set(key, draw(iconSet[key]))
  return builtins.get(key)
}
