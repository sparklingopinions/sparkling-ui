import { mount } from '@vue/test-utils'

import { paginationItems } from '../../components/Pagination/items'
import { Pagination } from '../../index'
import { expectAccessible } from '../support/axe'

describe('paginationItems', () => {
  it('shows every page when they fit', () => {
    expect(paginationItems(2, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('collapses skipped pages into gaps, keeping the count steady', () => {
    expect(paginationItems(8, 40)).toEqual([1, 'gap-start', 7, 8, 9, 'gap-end', 40])
    expect(paginationItems(1, 40)).toEqual([1, 2, 3, 4, 5, 'gap-end', 40])
    expect(paginationItems(40, 40)).toEqual([1, 'gap-start', 36, 37, 38, 39, 40])
    expect(paginationItems(20, 40, 2, 2)).toEqual([1, 2, 'gap-start', 18, 19, 20, 21, 22, 'gap-end', 39, 40])
  })
})

describe('Pagination', () => {
  it('is a navigation landmark with the current page marked', async () => {
    const wrapper = mount(Pagination, { props: { page: 8, pageCount: 40 }, attachTo: document.body })

    expect(wrapper.find('nav').attributes('aria-label')).toBe('Pagination')
    const current = wrapper.find('[aria-current="page"]')
    expect(current.text()).toBe('8')
    expect(current.attributes('aria-label')).toBe('Page 8')
    expect(current.classes()).toContain('bg-sui-accent-solid')
    expect(wrapper.findAll('[aria-hidden="true"]').filter((el) => el.text() === '…')).toHaveLength(2)
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('moves between pages', async () => {
    const wrapper = mount(Pagination, { props: { page: 8, pageCount: 40 } })

    await wrapper.find('[aria-label="Next page"]').trigger('click')
    await wrapper.find('[aria-label="Last page"]').trigger('click')
    await wrapper.find('[aria-label="Page 1"]').trigger('click')
    expect(wrapper.emitted('update:page')).toEqual([[9], [40], [1]])
  })

  it('disables the way back on the first page, and everything when disabled', async () => {
    const wrapper = mount(Pagination, { props: { page: 1, pageCount: 40 } })

    expect(wrapper.find('[aria-label="First page"]').attributes()).toHaveProperty('disabled')
    expect(wrapper.find('[aria-label="Previous page"]').attributes()).toHaveProperty('disabled')
    expect(wrapper.find('[aria-label="Next page"]').attributes()).not.toHaveProperty('disabled')

    await wrapper.setProps({ disabled: true })
    expect(wrapper.findAll('button').every((button) => 'disabled' in button.attributes())).toBe(true)
  })

  it('hides the end buttons and translates its labels', () => {
    const wrapper = mount(Pagination, {
      props: { page: 2, pageCount: 3, showEnds: false, label: 'Seiten', pageLabel: 'Seite {page}' }
    })

    expect(wrapper.find('[aria-label="First page"]').exists()).toBe(false)
    expect(wrapper.find('nav').attributes('aria-label')).toBe('Seiten')
    expect(wrapper.find('[aria-current="page"]').attributes('aria-label')).toBe('Seite 2')
  })
})
