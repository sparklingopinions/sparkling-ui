import { defineComponent, h, ref } from 'vue'

import { flushPromises, mount } from '@vue/test-utils'

import { ConfirmDialog, Modal, useConfirm } from '../../index'
import { expectAccessible } from '../support/axe'

const dialog = () => document.body.querySelector<HTMLElement>('[role="dialog"], [role="alertdialog"]')
const escape = () =>
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
const button = (name: string) =>
  [...document.body.querySelectorAll('button')].find((b) => b.textContent?.trim() === name)!

describe('Modal', () => {
  const mountModal = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
    mount(Modal, {
      props: { open: true, title: 'Revoke key', ...props },
      slots: { default: 'Body text', ...slots },
      attachTo: document.body
    })

  it('shows a titled dialog with the standard footer', async () => {
    const wrapper = mountModal({ confirmLabel: 'Revoke' })
    await flushPromises()

    expect(dialog()?.getAttribute('aria-labelledby')).toBeTruthy()
    expect(dialog()?.textContent).toContain('Revoke key')
    expect(dialog()?.textContent).toContain('Body text')
    button('Revoke').click()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  it('cancels from the footer, the close button and Escape, but not an outside click', async () => {
    const wrapper = mountModal({ confirmLabel: 'Revoke' })
    await flushPromises()

    button('Cancel').click()
    document.body.querySelector<HTMLElement>('[aria-label="Close"]')!.click()
    escape()
    await flushPromises()
    expect(wrapper.emitted('cancel')).toHaveLength(3)
    expect(wrapper.emitted('update:open')?.every(([value]) => value === false)).toBe(true)

    await wrapper.setProps({ open: false })
    await wrapper.setProps({ open: true })
    await flushPromises()
    expect(dialog()).not.toBeNull()
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    await flushPromises()
    expect(dialog()).not.toBeNull()
    wrapper.unmount()
  })

  it('focuses an [autofocus] field, or else the dialog', async () => {
    const plain = mountModal()
    await flushPromises()
    expect(document.activeElement).toBe(dialog())
    plain.unmount()

    const field = mountModal({}, { default: '<input aria-label="Name" autofocus />' })
    await flushPromises()
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Name')
    field.unmount()
  })

  it('takes a size and can drop its header', async () => {
    const wrapper = mountModal({ size: 'xl', headerless: true })
    await flushPromises()

    expect(dialog()?.classList).toContain('max-w-3xl')
    expect(document.body.querySelector('[aria-label="Close"]')).toBeNull()
    wrapper.unmount()
  })
})

describe('useConfirm', () => {
  const Host = defineComponent({
    setup(_, { expose }) {
      const confirm = useConfirm()
      const answer = ref<boolean>()
      const ask = () =>
        confirm({
          title: 'Revoke key?',
          message: 'It stops working.',
          confirmLabel: 'Revoke',
          confirmVariant: 'danger'
        }).then((value) => (answer.value = value))
      expose({ ask, answer })
      return () => h(ConfirmDialog)
    }
  })

  it('resolves true when confirmed and false when cancelled or dismissed', async () => {
    const wrapper = mount(Host, { attachTo: document.body })
    const vm = wrapper.vm as unknown as { ask: () => Promise<boolean>; answer?: boolean }

    for (const [act, expected] of [
      [() => button('Revoke').click(), true],
      [() => button('Cancel').click(), false],
      [escape, false]
    ] as const) {
      const asked = vm.ask()
      await flushPromises()
      expect(dialog()?.getAttribute('role')).toBe('alertdialog')
      act()
      await asked
      expect(vm.answer).toBe(expected)
    }
    wrapper.unmount()
  })

  it('names and describes the confirmation, with the danger button', async () => {
    const wrapper = mount(Host, { attachTo: document.body })
    ;(wrapper.vm as unknown as { ask: () => void }).ask()
    await flushPromises()

    expect(dialog()?.textContent).toContain('It stops working.')
    expect(button('Revoke').className).toContain('bg-sui-danger-solid')
    await expectAccessible(document.body)
    wrapper.unmount()
  })
})
