import { mount } from '@vue/test-utils'

import { Avatar, Chip, Kbd, Pill, Tag, hueFor } from '../../index'
import { expectAccessible } from '../support/axe'

describe('Avatar', () => {
  it('shows one initial in a hue derived from the name', async () => {
    const wrapper = mount(Avatar, { props: { name: ' ada lovelace' }, attachTo: document.body })

    expect(wrapper.text()).toBe('A')
    expect(wrapper.classes()).toContain(`bg-sui-hue-${hueFor('ada')}-soft`)
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('falls back to a grey question mark without a name', () => {
    const wrapper = mount(Avatar)

    expect(wrapper.text()).toBe('?')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['bg-sui-sunken', 'text-sui-ink-body']))
  })

  it('shows a photo instead, with a neutral hairline', async () => {
    const wrapper = mount(Avatar, { props: { name: 'Ada', image: '/ada.png', hue: 'red' }, attachTo: document.body })

    expect(wrapper.find('img').attributes()).toMatchObject({ src: '/ada.png', alt: '' })
    expect(wrapper.classes()).toContain('border-sui-line-subtle')
    expect(wrapper.classes()).not.toContain('bg-sui-hue-red-soft')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('takes a pinned hue, a shape, a size and a badge', () => {
    const wrapper = mount(Avatar, { props: { name: 'Ada', hue: 'amber', shape: 'square', size: 'lg', badge: true } })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['bg-sui-hue-amber-soft', 'rounded-lg', 'h-10']))
    expect(wrapper.find('span.bg-sui-accent').exists()).toBe(true)
  })

  it('keeps a stable hue per first letter, never purple, red or grey', () => {
    expect(hueFor('Ada')).toBe(hueFor('Alan'))
    expect(['blue', 'green', 'orange', 'pink']).toContain(hueFor('Zed'))
    expect(hueFor('  ')).toBe('gray')
  })
})

describe('Chip', () => {
  it('labels a value, or a quieter muted one', async () => {
    const wrapper = mount(Chip, { props: { label: 'Customer' }, attachTo: document.body })

    expect(wrapper.text()).toBe('Customer')
    expect(wrapper.classes()).toContain('bg-sui-sunken')
    await wrapper.setProps({ muted: true })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['border-sui-line-subtle', 'text-sui-ink-muted']))
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })
})

describe('Pill', () => {
  it('is a tinted chip with a dot by default', async () => {
    const wrapper = mount(Pill, { props: { tone: 'success', label: 'Warm' }, attachTo: document.body })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['bg-sui-success-soft', 'h-6']))
    expect(wrapper.find('span.bg-sui-success-mid').exists()).toBe(true)
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('can be a dot and coloured text only, or have no dot', () => {
    const wrapper = mount(Pill, { props: { tone: 'warning', variant: 'text', dot: false }, slots: { default: 'Cool' } })

    expect(wrapper.classes()).toContain('text-sui-warning-mid')
    expect(wrapper.classes()).not.toContain('h-6')
    expect(wrapper.find('span span').exists()).toBe(false)
    expect(wrapper.text()).toBe('Cool')
  })
})

describe('Tag', () => {
  it('shows a name with a dot of its colour', async () => {
    const wrapper = mount(Tag, { props: { name: 'Investors', color: 'green' }, attachTo: document.body })

    expect(wrapper.text()).toBe('Investors')
    expect(wrapper.find('span.bg-sui-hue-green-ink').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(false)
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('has a named remove button when removable', async () => {
    const wrapper = mount(Tag, { props: { name: 'Investors', removable: true }, attachTo: document.body })
    const button = wrapper.get('button')

    expect(button.attributes()).toMatchObject({ type: 'button', 'aria-label': 'Remove tag' })
    await button.trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })
})

describe('Kbd', () => {
  it('marks up a key', async () => {
    const wrapper = mount(Kbd, { slots: { default: 'Esc' }, attachTo: document.body })

    expect(wrapper.element.tagName).toBe('KBD')
    expect(wrapper.text()).toBe('Esc')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })
})
