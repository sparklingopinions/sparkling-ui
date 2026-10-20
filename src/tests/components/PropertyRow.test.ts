import { mount } from '@vue/test-utils'

import { Collapsible, PropertyRow } from '../../index'
import { expectAccessible } from '../support/axe'

describe('PropertyRow', () => {
  it('lays a label beside its value, and flags an error', async () => {
    const wrapper = mount(PropertyRow, {
      props: { label: 'Email' },
      slots: { default: 'ada@example.com' },
      attachTo: document.body
    })
    expect(wrapper.text()).toBe('Emailada@example.com')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['border-b', 'min-h-11']))

    await wrapper.setProps({ error: 'Not an email', divider: false })
    expect(wrapper.get('span').classes()).toContain('text-sui-danger')
    expect(wrapper.text()).toContain('Not an email')
    expect(wrapper.classes()).toContain('min-h-9.5')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })
})

describe('Collapsible', () => {
  it('folds rare fields away, and opens by itself when one holds a value', async () => {
    const wrapper = mount(Collapsible, {
      props: { summary: 'Phone, birthday', filled: false },
      slots: { default: '<p>Phone</p>' },
      attachTo: document.body
    })
    const toggle = wrapper.get('button')

    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(toggle.text()).toContain('Phone, birthday')
    await toggle.trigger('click')
    expect(wrapper.find('p').exists()).toBe(true)
    await expectAccessible(wrapper.element)

    await toggle.trigger('click')
    await wrapper.setProps({ filled: true })
    expect(wrapper.find('p').exists()).toBe(true)
    wrapper.unmount()
  })
})
