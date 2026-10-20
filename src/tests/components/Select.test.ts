import { flushPromises, mount } from '@vue/test-utils'

import { Select } from '../../index'
import { expectAccessible } from '../support/axe'

const options = [
  { value: 10, label: '10 per page' },
  { value: 25, label: '25 per page' },
  { value: 50, label: '50 per page', disabled: true }
]

describe('Select', () => {
  it('is a combobox showing its placeholder, with attributes on the trigger', async () => {
    const wrapper = mount(Select, {
      props: { options, modelValue: null },
      attrs: { 'aria-label': 'Rows per page', class: 'w-44' },
      attachTo: document.body
    })
    const trigger = wrapper.find('button')

    expect(trigger.attributes('role')).toBe('combobox')
    expect(trigger.attributes('aria-label')).toBe('Rows per page')
    expect(trigger.classes()).toEqual(expect.arrayContaining(['w-44', 'h-9', 'border-sui-line-control']))
    expect(trigger.text()).toBe('Select an option')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('shows the chosen option, small', () => {
    const wrapper = mount(Select, { props: { options, modelValue: 25, size: 'sm' } })

    expect(wrapper.find('button').text()).toBe('25 per page')
    expect(wrapper.find('button').classes()).toContain('h-7')
  })

  it('opens from the keyboard, marks the choice and picks another', async () => {
    const wrapper = mount(Select, {
      props: { options, modelValue: 25, 'aria-label': 'Rows per page' },
      attachTo: document.body
    })
    await wrapper.find('button').trigger('keydown', { key: 'Enter' })
    await flushPromises()

    const items = [...document.querySelectorAll<HTMLElement>('[role="option"]')]
    expect(items.map((item) => item.textContent?.trim())).toEqual(['10 per page', '25 per page', '50 per page'])
    expect(items[1]!.getAttribute('aria-selected')).toBe('true')
    expect(items[2]!.hasAttribute('data-disabled')).toBe(true)
    await expectAccessible(document.body)

    items[0]!.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'mouse' }))
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')).toEqual([[10]])
    wrapper.unmount()
  })

  it('stays shut when disabled', async () => {
    const wrapper = mount(Select, { props: { options, modelValue: 25, disabled: true }, attachTo: document.body })
    await wrapper.find('button').trigger('keydown', { key: 'Enter' })
    await flushPromises()

    expect(document.querySelector('[role="option"]')).toBeNull()
    expect(wrapper.find('button').attributes()).toHaveProperty('disabled')
    wrapper.unmount()
  })
})
