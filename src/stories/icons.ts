import { type FunctionalComponent, h } from 'vue'

// Stand-ins for an app's icons, drawn like MustLoop's: 16px, stroked, a fixed colour Icon's `color` replaces.
const paths: Record<string, string> = {
  plus: 'M8 3.5v9M3.5 8h9',
  check: 'M3.5 8.5l3 3 6-7',
  close: 'M4 4l8 8M12 4l-8 8',
  'chevron-down': 'M4.5 6.5L8 10l3.5-3.5',
  search: 'M7.25 12a4.75 4.75 0 1 0 0-9.5 4.75 4.75 0 0 0 0 9.5zM13.5 13.5l-2.9-2.9',
  mail: 'M2.5 4.5h11v7h-11zM2.5 4.5L8 9l5.5-4.5',
  calendar: 'M3 4h10v9H3zM3 7h10M5.5 2.5v3M10.5 2.5v3'
}

export const storyIcons: Record<string, FunctionalComponent> = Object.fromEntries(
  Object.entries(paths).map(([name, d]) => [
    name,
    () =>
      h(
        'svg',
        {
          width: 16,
          height: 16,
          viewBox: '0 0 16 16',
          fill: 'none',
          'fill-opacity': 0,
          stroke: '#0A0A0A',
          'stroke-width': 1.5,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round'
        },
        [h('path', { d })]
      )
  ])
)
