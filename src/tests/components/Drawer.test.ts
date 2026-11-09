import { nextTick } from 'vue'

import { mount } from '@vue/test-utils'

import { Drawer } from '../../index'
import { expectAccessible } from '../support/axe'

describe('Drawer', () => {
  it('is in from its edge while open, at its width', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true, side: 'start', width: '320px' },
      slots: { default: '<aside aria-label="Ideas">Ideas</aside>' },
      attachTo: document.body
    })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['left-0', 'visible', 'translate-x-0']))
    expect(wrapper.attributes('style')).toContain('width: 320px')
    expect(wrapper.attributes('inert')).toBeUndefined()
    // Shown at once: visibility isn't among what an opening drawer transitions, so focus can move inside right away.
    expect(wrapper.classes()).toContain('transition-[transform,translate,box-shadow]')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('slides out and turns hidden and inert when closed', () => {
    const wrapper = mount(Drawer, { props: { open: false }, slots: { default: 'Details' } })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['right-0', 'invisible', 'translate-x-full']))
    expect(wrapper.attributes('inert')).toBeDefined()
    expect(wrapper.attributes('data-state')).toBe('closed')
    expect(wrapper.classes()).toContain('transition-[transform,translate,box-shadow,visibility]')
  })

  it('floats only while open', async () => {
    const wrapper = mount(Drawer, { props: { open: true, floating: true } })
    expect(wrapper.classes()).toContain('shadow-(--sui-shadow-floating)')

    await wrapper.setProps({ open: false })
    expect(wrapper.classes()).not.toContain('shadow-(--sui-shadow-floating)')
  })

  it('gives the focus back when it closes with the focus inside', async () => {
    const wrapper = mount(Drawer, {
      props: { open: true },
      slots: { default: '<button type="button">Fold</button>' },
      attachTo: document.body
    })
    const button = wrapper.get('button').element as HTMLButtonElement
    button.focus()
    expect(document.activeElement).toBe(button)

    await wrapper.setProps({ open: false })
    await nextTick()
    expect(document.activeElement).not.toBe(button)
    wrapper.unmount()
  })
})
