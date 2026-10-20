import { mount } from '@vue/test-utils'

import { BulkActions } from '../../index'
import { expectAccessible } from '../support/axe'

const actions = [
  { label: 'Archive', action: 'archive' },
  { label: 'Delete', action: 'delete', variant: 'danger' as const }
]

describe('BulkActions', () => {
  it('shows only while something is selected', async () => {
    const wrapper = mount(BulkActions, { props: { count: 0, actions } })

    expect(wrapper.find('[role="toolbar"]').exists()).toBe(false)
    await wrapper.setProps({ count: 2 })
    expect(wrapper.find('[role="toolbar"]').attributes('aria-label')).toBe('2 selected')
  })

  it('is a named toolbar of actions, destructive ones outlined in danger', async () => {
    const wrapper = mount(BulkActions, {
      props: { count: 3, actions, floating: false, onClear: () => {} },
      attachTo: document.body
    })
    const buttons = wrapper.findAll('button')

    expect(wrapper.text()).toContain('3 selected')
    expect(buttons.map((b) => b.text())).toEqual(['Archive', 'Delete', ''])
    expect(buttons[1].classes()).toContain('text-sui-danger')
    expect(buttons[2].attributes('aria-label')).toBe('Clear selection')
    await buttons[1].trigger('click')
    expect(wrapper.emitted('click-item')).toEqual([[actions[1]]])
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('clears with its button and with Escape, but not while a dialog is open', async () => {
    const onClear = vi.fn()
    const wrapper = mount(BulkActions, { props: { count: 1, onClear }, attachTo: document.body })

    await wrapper.find('[aria-label="Clear selection"]').trigger('click')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    const dialog = document.body.appendChild(document.createElement('div'))
    dialog.setAttribute('role', 'dialog')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    dialog.remove()
    expect(onClear).toHaveBeenCalledTimes(2)

    await wrapper.setProps({ count: 0 })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(onClear).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })

  it('floats at the foot of the viewport by default', () => {
    const wrapper = mount(BulkActions, { props: { count: 1, label: '{count} ausgewählt' } })

    expect(wrapper.classes()).toContain('fixed')
    expect(wrapper.text()).toBe('1 ausgewählt')
  })
})
