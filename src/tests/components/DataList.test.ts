import { h } from 'vue'

import { flushPromises, mount } from '@vue/test-utils'

import { DataList, type DropdownMenuEntry } from '../../index'
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

describe('DataList', () => {
  it('renders named groups with counts, and rows with slots', async () => {
    const wrapper = mount(DataList, {
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

  it('draws each group as its own card, headers not sticky', async () => {
    const wrapper = mount(DataList, { props: { groups, variant: 'cards' }, attachTo: document.body })
    const sections = wrapper.findAll('section')

    expect(wrapper.classes()).toContain('gap-3')
    expect(wrapper.classes()).not.toContain('border')
    expect(sections.every((s) => s.classes().includes('rounded-xl') && s.classes().includes('border'))).toBe(true)
    expect(wrapper.find('header').classes()).toContain('bg-sui-surface')
    expect(wrapper.find('header').classes()).not.toContain('sticky')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('renders a custom group header inside the heading, named by the group label', async () => {
    const wrapper = mount(DataList, {
      props: {
        groups: [
          { ...groups[0]!, name: undefined, label: 'In review', header: undefined },
          { id: 'text', label: 'Done', header: 'Done, 40 total', items: [{ id: 3, name: 'Kickoff' }] }
        ],
        onNew: () => {}
      },
      slots: {
        'group-header':
          '<template #group-header="{ group, count, collapsed }"><span class="badge">{{ group.label }}</span><span>{{ count }}</span><span>{{ collapsed }}</span></template>'
      },
      attachTo: document.body
    })
    const [first, second] = wrapper.findAll('section')

    expect(first!.attributes('aria-label')).toBe('In review')
    expect(first!.find('h3 .badge').text()).toBe('In review')
    expect(first!.find('h3').text()).toBe('In review2false')
    expect(first!.find('button[aria-label="New in In review"]').exists()).toBe(true)
    expect(second!.attributes('aria-label')).toBe('Done')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('shows a group header given as text', () => {
    const wrapper = mount(DataList, {
      props: { groups: [{ id: 'text', label: 'Done', header: 'Done, 40 total', items: [{ id: 3, name: 'Kickoff' }] }] }
    })

    expect(wrapper.find('h3').text()).toBe('Done, 40 total')
    expect(wrapper.find('section').attributes('aria-labelledby')).toBeUndefined()
  })

  it('collapses a group', async () => {
    const wrapper = mount(DataList, {
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
    const wrapper = mount(DataList, { props: { groups, onRowClick }, attachTo: document.body })
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
    const wrapper = mount(DataList, {
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
    const wrapper = mount(DataList, { props: { groups, onNew } })

    await wrapper.find('[aria-label="New in Done"]').trigger('click')
    expect(onNew).toHaveBeenCalledWith(groups[1])
  })

  it('indents children, and shows skeletons while loading and the empty slot when empty', async () => {
    const wrapper = mount(DataList, {
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

  describe('drawn denser, as cards', () => {
    const mountSelectable = (props: Record<string, unknown> = {}) => {
      const wrapper = mount(DataList, {
        props: {
          groups,
          selectable: true,
          checkboxPlacement: 'leading' as const,
          selected: [],
          'onUpdate:selected': (selected: unknown[]) => wrapper.setProps({ selected }),
          onRowClick: vi.fn(),
          ...props
        },
        slots: {
          leading: ({ selected, selecting }: { selected: boolean; selecting: boolean }) =>
            h('span', { 'data-mark': '', 'data-selected': selected, 'data-selecting': selecting }, '•')
        },
        attachTo: document.body
      })
      return wrapper
    }
    const rows = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('[data-list-row]')

    it('sets header tone, header and row heights, and drops the chevron when not collapsible', async () => {
      const wrapper = mount(DataList, {
        props: {
          groups: [groups[0]!, { ...groups[1]!, collapsible: true }],
          variant: 'cards',
          groupHeaderTone: 'canvas',
          groupHeaderHeight: 40,
          rowHeight: 44,
          collapsible: false,
          dividers: true
        },
        slots: { 'group-actions': () => h('button', 'Hide') },
        attachTo: document.body
      })
      const headers = wrapper.findAll('header')

      expect(wrapper.attributes('style')).toBe('--sui-list-row: 44px; --sui-list-header: 40px;')
      expect(headers[0]!.classes()).toEqual(expect.arrayContaining(['bg-sui-canvas', 'pl-4']))
      expect(headers[0]!.find('[aria-expanded]').exists()).toBe(false)
      expect(headers[1]!.find('[aria-expanded]').exists()).toBe(true)
      expect(headers[0]!.text()).toContain('Hide')
      expect(wrapper.find('li').classes()).toEqual(
        expect.arrayContaining(['h-[var(--sui-list-row,2.5rem)]', '[&+&]:border-t'])
      )
      expect(mount(DataList, { props: { groups } }).attributes('style')).toBeUndefined()
      await expectAccessible(wrapper.element)
      wrapper.unmount()
    })

    it('puts the checkbox over the leading mark, outside the row, and tells the slot', async () => {
      const wrapper = mountSelectable()
      const check = () => wrapper.find('[data-list-check]')

      expect(check().element.closest('[data-list-row]')).toBeNull()
      expect(check().classes()).toContain('hidden')
      expect(wrapper.find('[data-mark]').attributes('data-selecting')).toBe('false')
      await rows(wrapper)[0]!.trigger('click', { metaKey: true })
      expect(wrapper.props('selected')).toEqual([1])
      expect(check().classes()).not.toContain('hidden')
      expect(wrapper.find('[data-mark]').attributes()).toMatchObject({
        'data-selected': 'true',
        'data-selecting': 'true'
      })
      await expectAccessible(wrapper.element)
      wrapper.unmount()
    })

    it('selects a range with shift-click, toggles with Cmd or Ctrl, and toggles with a plain click while selecting', async () => {
      const wrapper = mountSelectable()

      await rows(wrapper)[0]!.trigger('click', { ctrlKey: true })
      await rows(wrapper)[2]!.trigger('click', { shiftKey: true })
      expect(wrapper.props('selected')).toEqual([1, 2, 3])
      await rows(wrapper)[1]!.trigger('click', { metaKey: true })
      expect(wrapper.props('selected')).toEqual([1, 3])
      await rows(wrapper)[1]!.trigger('click')
      expect(wrapper.props('selected')).toEqual([1, 3, 2])
      expect(wrapper.props('onRowClick')).not.toHaveBeenCalled()

      await wrapper.setProps({ selected: [] })
      await rows(wrapper)[1]!.trigger('click')
      expect(wrapper.props('onRowClick')).toHaveBeenCalledWith(groups[0]!.items[1])
      wrapper.unmount()
    })

    it('extends with Shift and the arrow keys, and selects a range with Shift+Space', async () => {
      const wrapper = mountSelectable({ checkboxPlacement: 'gutter' })

      await rows(wrapper)[0]!.trigger('keydown', { key: 'ArrowDown', shiftKey: true })
      expect(wrapper.props('selected')).toEqual([1, 2])
      expect(document.activeElement).toBe(rows(wrapper)[1]!.element)

      await wrapper.setProps({ selected: [] })
      await rows(wrapper)[0]!.trigger('keydown', { key: 'x' })
      await rows(wrapper)[2]!.trigger('keydown', { key: ' ', shiftKey: true })
      expect(wrapper.props('selected')).toEqual([1, 2, 3])
      wrapper.unmount()
    })

    it('opens a context menu per row and emits the chosen action with its row', async () => {
      const contextItems = (item: Record<string, unknown>): DropdownMenuEntry[] => [
        { type: 'action', label: `Open ${String(item.name)}`, action: 'open' },
        { type: 'action', label: 'Archive', action: 'archive', disabled: true }
      ]
      const wrapper = mount(DataList, {
        props: { groups, contextItems, contextLabel: 'Row actions' },
        attachTo: document.body
      })

      await wrapper.findAll('li')[1]!.trigger('contextmenu')
      await flushPromises()
      const menu = document.body.querySelector('[role="menu"]')!
      expect(menu.getAttribute('aria-label')).toBe('Row actions')
      ;(menu.querySelector('[role="menuitem"]') as HTMLElement).click()
      await flushPromises()

      expect(wrapper.emitted('context-item')?.[0]).toEqual([
        expect.objectContaining({ action: 'open', label: 'Open Pricing' }),
        groups[0]!.items[1]
      ])
      wrapper.unmount()
    })

    it("leaves the browser's menu alone without contextItems", async () => {
      const wrapper = mount(DataList, { props: { groups }, attachTo: document.body })
      const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true })
      wrapper.find('li').element.dispatchEvent(event)

      expect(event.defaultPrevented).toBe(false)
      wrapper.unmount()
    })
  })
})
