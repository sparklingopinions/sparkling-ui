import { mount } from '@vue/test-utils'

import { Avatar, Badge, Chip, Kbd, Tag, hueFor } from '../../index'
import { expectAccessible } from '../support/axe'

describe('Avatar', () => {
  it('shows one initial in a hue derived from the name', async () => {
    const wrapper = mount(Avatar, { props: { name: ' ada lovelace' }, attachTo: document.body })

    expect(wrapper.text()).toBe('A')
    expect(wrapper.classes()).toContain(`bg-sui-hue-${hueFor('ada')}-soft`)
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('takes a number of px, 20 with a 10px initial, the initial stepping up with the size', async () => {
    const wrapper = mount(Avatar, { props: { name: 'Ada', size: 20 }, attachTo: document.body })

    expect(wrapper.attributes('style')).toBe('width: 20px; height: 20px;')
    expect(wrapper.classes()).toContain('text-10')
    expect(mount(Avatar, { props: { size: 28 } }).classes()).toContain('text-11')
    expect(mount(Avatar, { props: { size: 36 } }).classes()).toContain('text-xs')
    expect(mount(Avatar, { props: { size: 48 } }).classes()).toContain('text-sm')
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
    expect(wrapper.find('span.bg-sui-accent-solid').exists()).toBe(true)
  })

  it('keeps a stable hue per first letter, never purple, red or grey', () => {
    expect(hueFor('Ada')).toBe(hueFor('Alan'))
    expect(['blue', 'green', 'orange', 'pink']).toContain(hueFor('Zed'))
    expect(hueFor('  ')).toBe('gray')
  })
})

describe('Tag outline', () => {
  it('labels a value, or a quieter muted one', async () => {
    const wrapper = mount(Tag, { props: { name: 'Customer', variant: 'outline' }, attachTo: document.body })

    expect(wrapper.text()).toBe('Customer')
    expect(wrapper.classes()).toContain('bg-sui-sunken')
    await wrapper.setProps({ muted: true })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['border-sui-line-subtle', 'text-sui-ink-muted']))
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })
})

describe('Tag icon', () => {
  it('draws a 14px icon before the name, outline or soft, in place of the dot', async () => {
    const outline = mount(Tag, {
      props: { name: 'Follow-up', variant: 'outline', icon: 'bell-ring', iconColor: 'warning' },
      attachTo: document.body
    })
    expect(outline.get('svg').classes()).toEqual(expect.arrayContaining(['size-3.5', 'stroke-sui-warning']))
    expect(outline.text()).toBe('Follow-up')
    await expectAccessible(outline.element)
    outline.unmount()

    const soft = mount(Tag, { props: { name: 'VIP', color: 'purple', icon: 'trophy' } })
    expect(soft.get('svg').classes()).toContain('stroke-sui-ink-subtle')
    expect(soft.find('.rounded-full').exists()).toBe(false)
  })
})

describe('Chip, the former name', () => {
  it('is an outline Tag', () => {
    const wrapper = mount(Chip, { props: { label: 'Lead', muted: true } })

    expect(wrapper.text()).toBe('Lead')
    expect(wrapper.classes()).toContain('border-sui-line-subtle')
  })
})

describe('Badge', () => {
  it('is a tinted chip with a dot by default', async () => {
    const wrapper = mount(Badge, { props: { tone: 'success', label: 'Warm' }, attachTo: document.body })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['bg-sui-success-soft', 'h-6']))
    expect(wrapper.find('span.bg-sui-success-mid').exists()).toBe(true)
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('can be a dot and coloured text only, or have no dot', () => {
    const wrapper = mount(Badge, {
      props: { tone: 'warning', variant: 'text', dot: false },
      slots: { default: 'Cool' }
    })

    expect(wrapper.classes()).toContain('text-sui-warning')
    expect(wrapper.classes()).not.toContain('h-6')
    expect(wrapper.find('span span').exists()).toBe(false)
    expect(wrapper.text()).toBe('Cool')
  })

  it('can be an outlined pill whose dot carries the tone', async () => {
    const wrapper = mount(Badge, { props: { tone: 'accent', variant: 'outline', label: '5' }, attachTo: document.body })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['border-sui-line', 'bg-sui-surface', 'rounded-full']))
    expect(wrapper.classes()).not.toContain('text-sui-accent')
    expect(wrapper.find('span.bg-sui-accent-solid').exists()).toBe(true)
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })
})

describe('Tag', () => {
  it('toggles as a pressable button with aria-pressed and a check when on', async () => {
    const wrapper = mount(Tag, {
      props: { pressable: true, pressed: false, 'onUpdate:pressed': (v: boolean) => wrapper.setProps({ pressed: v }) },
      slots: { default: 'Morning' },
      attachTo: document.body
    })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes()).toMatchObject({ type: 'button', 'aria-pressed': 'false' })
    expect(wrapper.find('svg').exists()).toBe(false)
    await wrapper.trigger('click')
    expect(wrapper.attributes('aria-pressed')).toBe('true')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['bg-sui-accent-wash', 'text-sui-accent']))
    expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('comes in a 22px size', async () => {
    const wrapper = mount(Tag, {
      props: { pressable: true, pressed: true, size: 'sm' },
      slots: { default: 'Drafts' },
      attachTo: document.body
    })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['h-5.5', 'text-xs', 'px-2']))
    expect(wrapper.classes()).not.toContain('h-7')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('does not toggle when disabled', async () => {
    const wrapper = mount(Tag, { props: { pressable: true, disabled: true }, slots: { default: 'Morning' } })

    await wrapper.trigger('click')
    expect(wrapper.attributes()).toMatchObject({ disabled: '', 'aria-pressed': 'false' })
    expect(wrapper.emitted('update:pressed')).toBeUndefined()
  })

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
