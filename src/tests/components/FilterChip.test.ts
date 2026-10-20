import { nextTick } from 'vue'

import { mount } from '@vue/test-utils'

import { FilterChip } from '../../index'
import { expectAccessible } from '../support/axe'

describe('FilterChip', () => {
  it('reads as a sentence and opens a panel named by it, with Remove', async () => {
    const onRemove = vi.fn()
    const wrapper = mount(FilterChip, {
      props: { field: 'Stage', op: 'is', value: 'Customer', onRemove },
      slots: { default: '<p>Pickers</p>' },
      attachTo: document.body
    })
    const chip = wrapper.find('button')

    expect(chip.text()).toBe('Stage is Customer')
    expect(chip.attributes()).toMatchObject({ 'aria-haspopup': 'dialog', 'aria-expanded': 'false' })
    await chip.trigger('click')
    await nextTick()
    const panel = document.body.querySelector('[role="dialog"]')!
    // Named by its chip.
    expect(panel.getAttribute('aria-labelledby')).toBe(chip.attributes('id'))
    expect(panel.textContent).toContain('Pickers')
    await expectAccessible(document.body)
    ;(panel.querySelector('button') as HTMLButtonElement).click()
    await nextTick()
    expect(onRemove).toHaveBeenCalled()
    expect(wrapper.emitted('update:open')).toEqual([[true], [false]])
    wrapper.unmount()
  })

  it('is a plain button without a panel', () => {
    const wrapper = mount(FilterChip, { props: { field: 'Archived' }, attrs: { 'aria-pressed': 'true' } })

    expect(wrapper.find('button').attributes('aria-haspopup')).toBeUndefined()
    expect(wrapper.find('button').attributes('aria-pressed')).toBe('true')
  })

  it('shows the sort with its direction', () => {
    const wrapper = mount(FilterChip, { props: { kind: 'sort', field: 'Name', op: 'descending', dir: 'desc' } })

    expect(wrapper.text()).toContain('Name,')
    expect(wrapper.find('path').attributes('d')).toContain('M12 5v14')
  })

  it('starts a filter with kind add', async () => {
    const onClick = vi.fn()
    const wrapper = mount(FilterChip, { props: { kind: 'add', addLabel: 'Filtern' }, attrs: { onClick } })

    expect(wrapper.text()).toBe('Filtern')
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalled()
  })
})
