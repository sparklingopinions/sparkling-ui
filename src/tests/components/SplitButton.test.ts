import { mount } from '@vue/test-utils'

import { SplitButton } from '../../index'
import { expectAccessible } from '../support/axe'

const items = [{ type: 'action' as const, label: 'Approve and schedule…' }]

describe('SplitButton', () => {
  it('is the main action and a named chevron, joined', async () => {
    const wrapper = mount(SplitButton, {
      props: { items, menuLabel: 'More ways to approve' },
      slots: { default: 'Approve' },
      attachTo: document.body
    })
    const [main, chevron] = wrapper.findAll('button')

    expect(wrapper.attributes('role')).toBe('group')
    expect(main.text()).toBe('Approve')
    expect(main.classes()).toContain('rounded-e-none')
    expect(chevron.attributes('aria-label')).toBe('More ways to approve')
    expect(chevron.classes()).toContain('rounded-s-none')
    // Touching, with a faint seam drawn in the fill's own ink rather than a gap.
    expect(wrapper.classes()).not.toContain('gap-px')
    expect(chevron.classes()).toEqual(
      expect.arrayContaining([
        '-ml-px',
        'border-l-sui-on-accent/12',
        'group-hover/split:not-data-disabled:border-l-transparent'
      ])
    )
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('emits click for the main action', async () => {
    const wrapper = mount(SplitButton, { props: { items }, slots: { default: 'Approve' } })

    await wrapper.findAll('button')[0].trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('turns both halves off when disabled, and the chevron off without items', () => {
    const off = mount(SplitButton, { props: { items, disabled: true }, slots: { default: 'Approve' } })
    expect(off.findAll('button').every((b) => b.attributes('disabled') !== undefined)).toBe(true)

    const bare = mount(SplitButton, { slots: { default: 'Approve' } })
    const [main, chevron] = bare.findAll('button')
    expect(main.attributes('disabled')).toBeUndefined()
    expect(chevron.attributes('disabled')).toBeDefined()
  })

  it('points the chevron down by default, and up when the menu opens above', () => {
    const path = (side?: 'top' | 'bottom') =>
      mount(SplitButton, { props: { items, side }, slots: { default: 'Approve' } })
        .findAll('button')[1]
        .find('path')
        .attributes('d')

    expect(path()).toBe('m4.5 6.5 3.5 3.5 3.5-3.5')
    expect(path('top')).toBe('m4.5 9.5 3.5-3.5 3.5 3.5')
  })
})
