import { h, nextTick } from 'vue'

import { mount } from '@vue/test-utils'

import { Tooltip } from '../../index'
import { expectAccessible } from '../support/axe'

const mountTooltip = (props: Record<string, unknown>) =>
  mount(Tooltip, {
    props,
    slots: { default: () => h('button', { type: 'button' }, 'Archive') },
    attachTo: document.body
  })

const tooltip = () => document.body.querySelector('[role="tooltip"]')

describe('Tooltip', () => {
  afterEach(() => (document.body.innerHTML = ''))

  it('shows its text while the trigger has keyboard focus, and Escape hides it', async () => {
    const wrapper = mountTooltip({ text: 'Archive this loop' })
    const button = wrapper.get('button')

    expect(tooltip()).toBeNull()
    await button.trigger('focus')
    await nextTick()
    expect(tooltip()?.textContent).toBe('Archive this loop')
    expect(button.attributes('aria-describedby')).toBeTruthy()
    await expectAccessible(document.body)

    await button.trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(tooltip()).toBeNull()
    wrapper.unmount()
  })

  it('renders only the trigger when disabled or empty', async () => {
    for (const props of [{ text: 'Archive', disabled: true }, { text: '' }]) {
      const wrapper = mountTooltip(props)
      await wrapper.get('button').trigger('focus')
      await nextTick()
      expect(tooltip()).toBeNull()
      wrapper.unmount()
    }
  })
})
