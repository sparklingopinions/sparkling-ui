import { h, nextTick } from 'vue'

import { mount } from '@vue/test-utils'

import { Button, Toolbar } from '../../index'
import { expectAccessible } from '../support/axe'

const mountToolbar = (props: Record<string, unknown> = {}) =>
  mount(Toolbar, {
    props: { label: 'Text formatting', ...props },
    slots: {
      default: () => [
        h(Button, { pressed: true, 'aria-label': 'Bold' }, () => 'B'),
        h(Button, { pressed: false, 'aria-label': 'Italic' }, () => 'I'),
        h(Button, { disabled: true, 'aria-label': 'Heading' }, () => 'H'),
        h(Button, { 'aria-label': 'Link' }, () => 'L')
      ]
    },
    attachTo: document.body
  })

const buttons = () => [...document.body.querySelectorAll('button')]
const press = (key: string) =>
  document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))

describe('Toolbar', () => {
  it('is a named toolbar with one control in the tab order', async () => {
    const wrapper = mountToolbar()

    expect(wrapper.attributes()).toMatchObject({ role: 'toolbar', 'aria-label': 'Text formatting' })
    expect(buttons().map((b) => b.tabIndex)).toEqual([0, -1, -1, -1])
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('moves focus with the arrow keys, Home and End, skipping disabled controls and wrapping', async () => {
    const wrapper = mountToolbar()
    const [bold, italic, , link] = buttons()
    bold!.focus()

    press('ArrowRight')
    expect(document.activeElement).toBe(italic)
    press('ArrowRight')
    expect(document.activeElement).toBe(link)
    press('ArrowRight')
    expect(document.activeElement).toBe(bold)
    press('ArrowLeft')
    expect(document.activeElement).toBe(link)
    press('Home')
    expect(document.activeElement).toBe(bold)
    press('End')
    expect(document.activeElement).toBe(link)
    await nextTick()
    expect(link!.tabIndex).toBe(0)
    expect(bold!.tabIndex).toBe(-1)
    wrapper.unmount()
  })

  it('stops at the ends without loop, and uses up and down when vertical', () => {
    const wrapper = mountToolbar({ loop: false, orientation: 'vertical' })
    const [bold, italic] = buttons()
    bold!.focus()
    expect(document.activeElement).toBe(bold)

    press('ArrowUp')
    expect(document.activeElement).toBe(bold)
    press('ArrowRight')
    expect(document.activeElement).toBe(bold)
    press('ArrowDown')
    expect(document.activeElement).toBe(italic)
    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
    wrapper.unmount()
  })
})
