import { defineComponent, h, nextTick } from 'vue'

import { mount } from '@vue/test-utils'

import { iconSet } from '../../components/Icon/iconSet'
import { Icon, iconNames, setIconResolver } from '../../index'
import { expectAccessible } from '../support/axe'

const svg = (id: string) => defineComponent(() => () => h('svg', { 'data-icon': id, viewBox: '0 0 16 16' }))
const icons: Record<string, ReturnType<typeof svg>> = { plus: svg('plus'), close: svg('close'), mail: svg('mail') }

describe('Icon from the set', () => {
  beforeEach(() => setIconResolver(() => undefined))

  it('is hidden from assistive tech, or named with a label', async () => {
    const hidden = mount(Icon, { props: { name: 'bell-ring', color: 'warning' } })
    expect(hidden.attributes()).toMatchObject({
      'aria-hidden': 'true',
      width: '16',
      class: 'stroke-sui-warning fill-sui-warning'
    })

    const named = mount(Icon, { props: { name: 'bell-ring', label: 'Follow-up' }, attachTo: document.body })
    expect(named.attributes()).toMatchObject({ role: 'img', 'aria-label': 'Follow-up' })
    expect(named.attributes('aria-hidden')).toBeUndefined()
    await expectAccessible(named.element)
    named.unmount()
  })
})

describe('Icon', () => {
  beforeEach(() => setIconResolver((name) => icons[name]))

  it('renders the resolved icon, hidden from assistive tech', async () => {
    const wrapper = mount(Icon, { props: { name: 'plus' }, attachTo: document.body })

    expect(wrapper.attributes()).toMatchObject({ 'data-icon': 'plus', 'aria-hidden': 'true' })
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  it('names a meaningful icon', async () => {
    const wrapper = mount(Icon, { props: { name: 'close', label: 'Closed' }, attachTo: document.body })

    expect(wrapper.attributes()).toMatchObject({ role: 'img', 'aria-label': 'Closed' })
    expect(wrapper.attributes('aria-hidden')).toBeUndefined()
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('colours stroke and fill from a role', () => {
    const wrapper = mount(Icon, { props: { name: 'plus', color: 'ink-muted' } })

    expect(wrapper.classes()).toEqual(['stroke-sui-ink-muted', 'fill-sui-ink-muted'])
  })

  it('follows a change of name', async () => {
    const wrapper = mount(Icon, { props: { name: 'plus' } })
    await wrapper.setProps({ name: 'close' })
    await nextTick()

    expect(wrapper.attributes('data-icon')).toBe('close')
  })

  it('renders nothing and warns for an unknown name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(Icon, { props: { name: 'nope' } })

    expect(wrapper.html()).toBe('<!--v-if-->')
    expect(warn).toHaveBeenCalledWith('[sparkling-ui] No icon named "nope".')
    warn.mockRestore()
  })
  it("draws the library's set when the app has no icon of that name", () => {
    const wrapper = mount(Icon, { props: { name: 'users', color: 'ink-muted' } })

    expect(wrapper.element.tagName).toBe('svg')
    expect(wrapper.attributes()).toMatchObject({ viewBox: '0 0 16 16', 'stroke-width': '1.5', style: 'fill: none;' })
    expect(wrapper.find('path').exists()).toBe(true)
    expect(iconNames).toHaveLength(135)
  })

  it('draws every icon on the 16 grid, or the 8 or 24 one', () => {
    const offGrid = Object.entries(iconSet)
      .filter(([, icon]) => !['0 0 16 16', '0 0 8 8', '0 0 24 24'].includes(icon.viewBox))
      .map(([name, icon]) => `${name} (${icon.viewBox})`)

    expect(offGrid).toEqual([])
  })

  it('resolves older names, and fills the filled icons', () => {
    const wrapper = mount(Icon, { props: { name: 'dot-vertical' } })

    expect(wrapper.findAll('circle')).toHaveLength(3)
    expect(wrapper.attributes('style')).toBe('stroke: none;')
    expect(mount(Icon, { props: { name: 'people' } }).html()).toBe(mount(Icon, { props: { name: 'users' } }).html())
  })

  it('draws 24px-grid icons at the same visual stroke', () => {
    const wrapper = mount(Icon, { props: { name: 'thread' } })

    expect(wrapper.attributes('viewBox')).toBe('0 0 24 24')
    expect(wrapper.attributes('stroke-width')).toBe('2.25')
    expect(wrapper.html()).toBe(mount(Icon, { props: { name: 'messages' } }).html())
  })

  it('draws smile, lock, redo and keyboard, and resolves their common names', () => {
    for (const [name, alias] of [
      ['smile', 'emoji'],
      ['lock', 'lock-keyhole'],
      ['redo', 'redo-2'],
      ['keyboard', 'keys']
    ]) {
      const wrapper = mount(Icon, { props: { name } })
      expect(wrapper.attributes()).toMatchObject({ viewBox: '0 0 24 24', 'stroke-width': '2.25' })
      expect(mount(Icon, { props: { name: alias } }).html()).toBe(wrapper.html())
    }
  })

  it.each([
    'hourglass',
    'bell-ring',
    'snooze',
    'mail-x',
    'flag',
    'sprout',
    'compass',
    'flask',
    'heart',
    'trophy',
    'thermometer-low',
    'heart-crack',
    'phone',
    'calendar-users',
    'sticky-note',
    'sparkles',
    'circle-minus'
  ])('draws %s on the 24 grid at a 2.25 stroke', async (name) => {
    const wrapper = mount(Icon, { props: { name }, attachTo: document.body })

    expect(wrapper.element.tagName).toBe('svg')
    expect(wrapper.attributes()).toMatchObject({ viewBox: '0 0 24 24', 'stroke-width': '2.25' })
    expect(iconNames).toContain(name)
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it("lets the app add icons and replace the set's", () => {
    expect(mount(Icon, { props: { name: 'mail' } }).attributes('data-icon')).toBe('mail')
    expect(mount(Icon, { props: { name: 'plus' } }).attributes('data-icon')).toBe('plus')
  })
})
