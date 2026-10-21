import { h } from 'vue'

import { mount } from '@vue/test-utils'

import { Button } from '../../index'
import { expectAccessible } from '../support/axe'

describe('Button', () => {
  it('renders a native button with its label', async () => {
    const wrapper = mount(Button, { slots: { default: 'Save' }, attachTo: document.body })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.text()).toBe('Save')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('disables a native button', async () => {
    const wrapper = mount(Button, { props: { disabled: true }, slots: { default: 'Save' }, attachTo: document.body })

    expect(wrapper.attributes()).toMatchObject({ disabled: '', 'data-disabled': '' })
    expect(wrapper.attributes('aria-disabled')).toBeUndefined()
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('renders as a link, marked disabled for assistive tech', async () => {
    const wrapper = mount(Button, {
      props: { as: 'a', disabled: true },
      attrs: { href: '/people' },
      slots: { default: 'People' },
      attachTo: document.body
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes()).toMatchObject({ href: '/people', 'aria-disabled': 'true', 'data-disabled': '' })
    expect(wrapper.attributes('disabled')).toBeUndefined()
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('styles its only child instead with asChild', async () => {
    const wrapper = mount(Button, {
      props: { asChild: true, variant: 'primary' },
      slots: { default: () => h('a', { href: '/people' }, 'People') },
      attachTo: document.body
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['bg-sui-accent-solid', 'no-underline']))
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('passes clicks and attributes through', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Button, {
      attrs: { onClick, type: 'submit' },
      slots: { default: 'Save' },
      attachTo: document.body
    })

    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledOnce()
    expect(wrapper.attributes('type')).toBe('submit')
    wrapper.unmount()
  })

  it('names an icon-only button with its aria-label', async () => {
    const wrapper = mount(Button, {
      props: { iconOnly: true, variant: 'ghost' },
      attrs: { 'aria-label': 'Close' },
      slots: { default: () => h('svg', { 'aria-hidden': 'true' }) },
      attachTo: document.body
    })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['aspect-square', 'px-0']))
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })
})
