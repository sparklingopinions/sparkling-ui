import type { Component } from 'vue'

/** Turns an icon name into its component, e.g. an SVG file imported as a component. */
export type IconResolver = (name: string) => Component | undefined

let resolver: IconResolver | undefined

/** Registers the app's icons, once, before anything renders an Icon. */
export function setIconResolver(next: IconResolver) {
  resolver = next
}

export function resolveIcon(name: string): Component | undefined {
  if (!resolver) {
    console.warn(`[sparkling-ui] Icon "${name}" can't render: call setIconResolver() first.`)
    return undefined
  }
  const icon = resolver(name)
  if (!icon) console.warn(`[sparkling-ui] No icon named "${name}".`)
  return icon
}
