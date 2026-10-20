import { mount } from '@vue/test-utils'

import { Table, type TableColumn } from '../../index'
import { expectAccessible } from '../support/axe'

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', width: 200 }
]
const rows = [
  { id: 1, name: 'Ada', email: 'ada@example.com' },
  { id: 2, name: 'Grace', email: null },
  { id: 3, name: 'Alan', email: 'alan@example.com' }
]

describe('Table', () => {
  it('renders the rows, a muted mark for empty cells, and a named table', async () => {
    const wrapper = mount(Table, { props: { columns, rows, caption: 'People' }, attachTo: document.body })

    expect(wrapper.find('caption').text()).toBe('People')
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
    expect(wrapper.findAll('tbody tr')[1].findAll('td')[1].text()).toBe('–')
    expect(wrapper.findAll('col')[1].attributes('style')).toContain('width: 200px')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('cycles a sortable header through ascending, descending and unsorted', async () => {
    const wrapper = mount(Table, {
      props: { columns, rows, sort: null, 'onUpdate:sort': (sort) => wrapper.setProps({ sort }) }
    })
    const header = () => wrapper.findAll('th')[0]

    expect(header().attributes('aria-sort')).toBe('none')
    expect(wrapper.findAll('th')[1].attributes('aria-sort')).toBeUndefined()
    await header().find('button').trigger('click')
    expect(header().attributes('aria-sort')).toBe('ascending')
    expect(header().classes()).toContain('bg-sui-accent-wash')
    await header().find('button').trigger('click')
    expect(header().attributes('aria-sort')).toBe('descending')
    await header().find('button').trigger('click')
    expect(header().attributes('aria-sort')).toBe('none')
  })

  it('selects rows, with an indeterminate select-all', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        rows,
        selectable: true,
        selected: [2],
        'onUpdate:selected': (selected) => wrapper.setProps({ selected })
      },
      attachTo: document.body
    })
    const all = () => wrapper.find('thead input').element as HTMLInputElement

    expect(all().indeterminate).toBe(true)
    expect(wrapper.findAll('tbody tr')[1].attributes('aria-selected')).toBe('true')
    expect(wrapper.findAll('tbody tr')[1].classes()).toContain('bg-sui-accent-wash')
    await wrapper.find('thead input').setValue(true)
    expect(wrapper.props('selected')).toEqual([2, 1, 3])
    expect(all().checked).toBe(true)
    await wrapper.findAll('tbody input')[0].setValue(false)
    expect(wrapper.props('selected')).toEqual([2, 3])
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('emits row clicks, but not from the checkbox', async () => {
    const onRowClick = vi.fn()
    const wrapper = mount(Table, { props: { columns, rows, selectable: true, onRowClick } })

    await wrapper.findAll('tbody td')[1].trigger('click')
    await wrapper.findAll('tbody td')[0].trigger('click')
    expect(onRowClick.mock.calls).toEqual([[rows[0]]])
    expect(wrapper.findAll('tbody tr')[0].classes()).toContain('cursor-pointer')
  })

  it('draws cells from slots', () => {
    const wrapper = mount(Table, {
      props: { columns, rows },
      slots: { 'cell-name': '<template #cell-name="{ row, value }"><b>{{ value }} ({{ row.id }})</b></template>' }
    })

    expect(wrapper.find('tbody b').text()).toBe('Ada (1)')
  })

  it('shows skeleton rows while loading, then the empty or error slot', async () => {
    const wrapper = mount(Table, {
      props: { columns, rows: [], loading: true, loadingRows: 2 },
      slots: { empty: '<p>No people yet</p>' }
    })

    expect(wrapper.find('tbody').attributes('aria-busy')).toBe('true')
    expect(wrapper.findAll('tbody tr[aria-hidden="true"]')).toHaveLength(2)
    await wrapper.setProps({ loading: false })
    expect(wrapper.find('tbody td').attributes('colspan')).toBe('2')
    expect(wrapper.find('tbody').text()).toBe('No people yet')

    const failed = mount(Table, { props: { columns, rows }, slots: { error: '<p>Couldn’t load</p>' } })
    expect(failed.find('tbody').text()).toBe('Couldn’t load')
  })

  it('has a footer strip', () => {
    const wrapper = mount(Table, { props: { columns, rows }, slots: { footer: '<span>1–3 of 3</span>' } })

    expect(wrapper.text()).toContain('1–3 of 3')
  })
})
