import { mount } from '@vue/test-utils'

import { Skeleton, Spinner, TypingDots } from '../../index'
import { expectAccessible } from '../support/axe'

describe('Spinner', () => {
  it('is a named progress indicator', async () => {
    const wrapper = mount(Spinner, { attachTo: document.body })

    expect(wrapper.attributes()).toMatchObject({ role: 'progressbar', 'aria-label': 'Loading' })
    expect(wrapper.classes()).toContain('size-8')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('takes a size and a translated label', () => {
    const wrapper = mount(Spinner, { props: { size: 'sm', label: 'Chargement' } })

    expect(wrapper.classes()).toContain('size-4')
    expect(wrapper.attributes('aria-label')).toBe('Chargement')
  })
})

describe('Skeleton', () => {
  it('is a hidden placeholder, full width and 1rem tall by default', async () => {
    const wrapper = mount(Skeleton, { attachTo: document.body })

    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.element.style).toMatchObject({ width: '100%', height: '1rem' })
    expect(wrapper.classes()).toContain('rounded-md')
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  it('draws a circle of one size', () => {
    const wrapper = mount(Skeleton, { props: { shape: 'circle', size: '2rem', width: '50%' } })

    expect(wrapper.element.style).toMatchObject({ width: '2rem', height: '2rem' })
    expect(wrapper.classes()).toContain('rounded-full')
  })
})

describe('TypingDots', () => {
  it('pulses three staggered dots, hidden from assistive tech', async () => {
    const wrapper = mount(TypingDots, { attachTo: document.body })
    const dots = wrapper.findAll('span > span')

    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(dots.map((dot) => (dot.element as HTMLElement).style.animationDelay)).toEqual(['0s', '0.15s', '0.3s'])
    await expectAccessible(document.body)
    wrapper.unmount()
  })
})
