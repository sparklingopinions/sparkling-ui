import { mount } from '@vue/test-utils'

import { List } from '../../index'
import { expectAccessible } from '../support/axe'

const groups = [
  {
    id: 'waiting',
    name: 'Waiting on them',
    items: [
      { id: 1, name: 'Intro to Acme' },
      { id: 2, name: 'Pricing' }
    ]
  },
  { id: 'done', name: 'Done', count: 40, items: [{ id: 3, name: 'Kickoff' }] }
]

describe('List', () => {
  it('renders named groups with counts, and rows with slots', async () => {
    const wrapper = mount(List, {
      props: { groups },
      slots: { meta: '<template #meta="{ item }"><span>#{{ item.id }}</span></template>' },
      attachTo: document.body
    })

    expect(wrapper.findAll('h3').map((h) => h.text())).toEqual(['Waiting on them', 'Done'])
    expect(wrapper.findAll('header').map((h) => h.text())).toEqual(['Waiting on them2', 'Done40'])
    expect(wrapper.findAll('li')).toHaveLength(3)
    expect(wrapper.find('li').text()).toBe('Intro to Acme#1')
    expect(wrapper.find('[data-list-row]').attributes('tabindex')).toBeUndefined()
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('collapses a group', async () => {
    const wrapper = mount(List, {
      props: { groups, collapsed: [], 'onUpdate:collapsed': (collapsed) => wrapper.setProps({ collapsed }) }
    })
    const toggle = wrapper.find('header button')

    expect(toggle.attributes()).toMatchObject({ 'aria-expanded': 'true', 'aria-label': 'Collapse group' })
    await toggle.trigger('click')
    expect(wrapper.props('collapsed')).toEqual(['waiting'])
    expect(toggle.attributes()).toMatchObject({ 'aria-expanded': 'false', 'aria-label': 'Expand group' })
    expect(wrapper.find('ul').isVisible()).toBe(false)
  })

  it('opens rows on click and Enter, and moves with the arrow keys and j k', async () => {
    const onRowClick = vi.fn()
    const wrapper = mount(List, { props: { groups, onRowClick }, attachTo: document.body })
    const rows = wrapper.findAll('[data-list-row]')

    expect(rows[0].attributes()).toMatchObject({ role: 'button', tabindex: '0' })
    await rows[0].trigger('click')
    ;(rows[0].element as HTMLElement).focus()
    await rows[0].trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(rows[1].element)
    await rows[1].trigger('keydown', { key: 'j' })
    expect(document.activeElement).toBe(rows[2].element)
    await rows[2].trigger('keydown', { key: 'k' })
    expect(document.activeElement).toBe(rows[1].element)
    await rows[1].trigger('keydown', { key: 'Enter' })
    expect(onRowClick.mock.calls).toEqual([[groups[0].items[0]], [groups[0].items[1]]])
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('selects with the checkbox gutter and x, showing every checkbox once anything is selected', async () => {
    const wrapper = mount(List, {
      props: {
        groups,
        selectable: true,
        selected: [],
        'onUpdate:selected': (selected) => wrapper.setProps({ selected })
      },
      attachTo: document.body
    })
    const gutter = () => wrapper.find('li > span')

    expect(gutter().classes()).toContain('opacity-0')
    await wrapper.find('li input').setValue(true)
    expect(wrapper.props('selected')).toEqual([1])
    expect(gutter().classes()).toContain('opacity-100')
    expect(wrapper.find('li').classes()).toContain('bg-sui-accent-wash')
    await wrapper.findAll('[data-list-row]')[2].trigger('keydown', { key: 'x' })
    expect(wrapper.props('selected')).toEqual([1, 3])
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('adds to a group with a named + button', async () => {
    const onNew = vi.fn()
    const wrapper = mount(List, { props: { groups, onNew } })

    await wrapper.find('[aria-label="New in Done"]').trigger('click')
    expect(onNew).toHaveBeenCalledWith(groups[1])
  })

  it('indents children, and shows skeletons while loading and the empty slot when empty', async () => {
    const wrapper = mount(List, {
      props: { groups: [{ id: 'a', items: [{ id: 1, name: 'Child', depth: 2 }] }] },
      slots: { empty: '<p>Nothing here</p>' }
    })

    expect(wrapper.find('li').attributes('style')).toContain('padding-left: 44px')
    expect(wrapper.find('header').exists()).toBe(false)
    await wrapper.setProps({ loading: true })
    expect(wrapper.find('[aria-busy="true"]').exists()).toBe(true)
    await wrapper.setProps({ loading: false, groups: [{ id: 'a', items: [] }] })
    expect(wrapper.text()).toBe('Nothing here')
  })
})
