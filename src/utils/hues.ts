/** The categorical hues, for colour that tells things apart without meaning anything. */
export type Hue = 'blue' | 'green' | 'orange' | 'pink' | 'purple' | 'slate' | 'red' | 'amber' | 'gray'

// Not purple (the accent), red (errors) or gray (no name), so a derived colour never reads as status or intent.
const derived = ['blue', 'green', 'orange', 'pink'] as const

/** A stable hue for a name, from its first letter, so it holds while the name is typed. */
export function hueFor(name?: string | null): Hue {
  const initial = (name || '').trim().charAt(0).toLowerCase()
  if (!initial) return 'gray'
  return derived[initial.charCodeAt(0) % derived.length]!
}
