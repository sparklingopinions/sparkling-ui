import { type FunctionalComponent, h } from 'vue'

// Stand-ins for an app's icons, drawn like the design system's: 16px, stroked, a fixed colour Icon's `color` replaces.
const paths: Record<string, string> = {
  plus: 'M8 3.5v9M3.5 8h9',
  check: 'M3.5 8.5l3 3 6-7',
  close: 'M4 4l8 8M12 4l-8 8',
  'chevron-down': 'M4.5 6.5L8 10l3.5-3.5',
  search: 'M7.25 12a4.75 4.75 0 1 0 0-9.5 4.75 4.75 0 0 0 0 9.5zM13.5 13.5l-2.9-2.9',
  mail: 'M2.5 4.5h11v7h-11zM2.5 4.5L8 9l5.5-4.5',
  calendar: 'M3 4h10v9H3zM3 7h10M5.5 2.5v3M10.5 2.5v3',
  users:
    'M6 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM1.5 13.5c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4M10.5 2.6a2.5 2.5 0 0 1 0 4.8M12 9.7c1.5.5 2.5 1.8 2.5 3.8',
  building: 'M3 14V2.5h7V14M10 6h3v8M1.5 14h13M5.5 5h2M5.5 8h2M5.5 11h2',
  inbox: 'M2 9h3.5l1 2h3l1-2H14M2 9l2-6h8l2 6v4H2z',
  'dot-vertical': 'M8 3.5v.01M8 8v.01M8 12.5v.01',
  edit: 'M10.5 3l2.5 2.5L6 12.5H3.5V10z',
  trash: 'M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9',
  archive: 'M2 3h12v3H2zM3 6v7h10V6M6.5 8.5h3',
  filter: 'M2.5 3.5h11l-4.25 5v4l-2.5 1v-5z',
  pipeline: 'M2.5 3.5h3v9h-3zM6.5 3.5h3v6h-3zM10.5 3.5h3v3h-3z'
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
