import { defineComponent, h, nextTick, ref } from 'vue'

import { flushPromises, mount } from '@vue/test-utils'

import { Popover } from '../../index'
import { expectAccessible } from '../support/axe'

type Exposed = { show: (e: Event, target?: HTMLElement) => void; hide: () => void; toggle: (e: Event) => void }

const Host = defineComponent({
  props: { autofocus: Boolean, closeOnEscape: { type: Boolean, default: true } },
  emits: ['show', 'hide'],
  setup(props, { emit, expose }) {
    const popover = ref<Exposed>()
    expose({ popover })
    return () =>
      h('div', [
        h('button', { type: 'button', id: 'opener', onClick: (e: Event) => popover.value!.toggle(e) }, 'Open'),
        h(
          Popover,
          {
            ref: popover,
            class: 'w-62!',
            closeOnEscape: props.closeOnEscape,
            onShow: () => emit('show'),
            onHide: () => emit('hide')
          },
          () => h('div', [h('input', { 'aria-label': 'Name', autofocus: props.autofocus || undefined }), 'Panel'])
        )
      ])
  }
})

const panel = () => document.body.querySelector('[role="dialog"]')

async function openHost(props = {}) {
  const wrapper = mount(Host, { props, attachTo: document.body })
  await wrapper.get('#opener').trigger('click')
  await flushPromises()
  return wrapper
}

describe('Popover', () => {
  it('opens from its trigger, takes class on the panel, and emits show', async () => {
    const wrapper = await openHost()

    expect(panel()?.textContent).toContain('Panel')
    expect(panel()?.classList).toContain('w-62!')
    expect(wrapper.emitted('show')).toHaveLength(1)
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  it('closes when its trigger is clicked again, and emits hide', async () => {
    const wrapper = await openHost()
    await wrapper.get('#opener').trigger('click')
    await flushPromises()

    expect(panel()).toBeNull()
    expect(wrapper.emitted('hide')).toHaveLength(1)
    wrapper.unmount()
  })

  it('focuses an [autofocus] field inside, and nothing otherwise', async () => {
    const plain = await openHost()
    expect(document.activeElement?.tagName).not.toBe('INPUT')
    plain.unmount()

    const focused = await openHost({ autofocus: true })
    await nextTick()
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Name')
    focused.unmount()
  })

  it('closes on Escape and returns focus to the trigger, unless told not to', async () => {
    const wrapper = await openHost()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await flushPromises()
    expect(panel()).toBeNull()
    expect(document.activeElement?.id).toBe('opener')
    wrapper.unmount()

    const kept = await openHost({ closeOnEscape: false })
    expect(panel()).not.toBeNull()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await flushPromises()
    expect(panel()).not.toBeNull()
    kept.unmount()
  })

  it('closes when the window resizes', async () => {
    const wrapper = await openHost()
    window.dispatchEvent(new Event('resize'))
    await flushPromises()

    expect(panel()).toBeNull()
    wrapper.unmount()
  })
})
