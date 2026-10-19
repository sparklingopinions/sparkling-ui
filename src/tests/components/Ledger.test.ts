import { h } from 'vue'

import { flushPromises, mount } from '@vue/test-utils'

import { LedgerModal, LedgerMore, LedgerRow } from '../../index'
import { expectAccessible } from '../support/axe'

describe('LedgerRow', () => {
  it('lays a label beside its value, and flags an error', async () => {
    const wrapper = mount(LedgerRow, {
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

describe('LedgerMore', () => {
  it('folds rare fields away, and opens by itself when one holds a value', async () => {
    const wrapper = mount(LedgerMore, {
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

describe('LedgerModal', () => {
  const mountModal = () =>
    mount(LedgerModal, {
      props: { open: true, title: 'New contact', bandClass: 'bg-sui-accent-wash', confirmLabel: 'Add contact' },
      slots: { band: 'Ada Lovelace', default: () => h('input', { 'aria-label': 'Email' }) },
      attachTo: document.body
    })
  const dialog = () => document.body.querySelector<HTMLElement>('[role="dialog"]')!
  const button = (name: string) => [...dialog().querySelectorAll('button')].find((b) => b.textContent?.trim() === name)!

  it('shows the titled band, its rows and a save hint', async () => {
    const wrapper = mountModal()
    await flushPromises()

    expect(dialog().textContent).toContain('New contact')
    expect(dialog().textContent).toMatch(/(⌘|Ctrl) Enter to save/)
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  it('saves from its button and on ⌘ or Ctrl Enter, and closes on Cancel', async () => {
    const wrapper = mountModal()
    await flushPromises()

    button('Add contact').click()
    dialog()
      .querySelector('input')!
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, bubbles: true }))
    expect(wrapper.emitted('submit')).toHaveLength(2)

    button('Cancel').click()
    await flushPromises()
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    wrapper.unmount()
  })
})
