import axe from 'axe-core'

// jsdom can't compute colours; contrast is checked by the Storybook story tests in a real browser. Landmarks
// (region) are a page's concern, not a component's.
const options: axe.RunOptions = { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } }

export async function expectAccessible(element: Element) {
  const { violations } = await axe.run(element, options)
  const report = violations.map((v) => `${v.id}: ${v.help}\n  ${v.nodes.map((n) => n.html).join('\n  ')}`)
  expect(report).toEqual([])
}
