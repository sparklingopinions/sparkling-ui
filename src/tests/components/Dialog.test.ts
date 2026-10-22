import { defineComponent, h, ref } from 'vue'

import { flushPromises, mount } from '@vue/test-utils'

import { AlertDialog, Dialog, saveHint, useConfirm } from '../../index'
import { expectAccessible } from '../support/axe'

const dialog = () => document.body.querySelector<HTMLElement>('[role="dialog"], [role="alertdialog"]')
const escape = () =>
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
const button = (name: string) =>
  [...document.body.querySelectorAll('button')].find((b) => b.textContent?.trim() === name)!

describe('Dialog', () => {
  const mountModal = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
    mount(Dialog, {
      props: { open: true, title: 'Revoke key', ...props },
      slots: { default: 'Body text', ...slots },
      attachTo: document.body
    })

  it('shows a titled dialog with the standard footer', async () => {
    const wrapper = mountModal({ confirmLabel: 'Revoke' })
    await flushPromises()

    expect(dialog()?.getAttribute('aria-labelledby')).toBeTruthy()
    expect(dialog()?.textContent).toContain('Revoke key')
    expect(dialog()?.querySelectorAll('h2')).toHaveLength(1)
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

  describe('as a bottom sheet', () => {
    const grab = () => dialog()!.querySelector<HTMLElement>('[data-modal-header]')!
    const pointer = (type: string, clientY: number) =>
      grab().dispatchEvent(new PointerEvent(type, { bubbles: true, button: 0, pointerId: 1, clientY }))

    it('draws a handle, the title row and a full-width confirm, without Cancel', async () => {
      const wrapper = mountModal({ presentation: 'sheet', confirmLabel: 'Schedule', hint: 'Posts at 9:00' })
      await flushPromises()

      expect(dialog()!.className).toContain('rounded-t-(--sui-radius-sheet)')
      expect(grab().querySelector('span[aria-hidden="true"]')!.className).toContain('bg-sui-mark-faint')
      expect(dialog()!.querySelector('h2')!.textContent).toBe('Revoke key')
      expect(button('Cancel')).toBeUndefined()
      expect(button('Schedule').className).toEqual(expect.stringContaining('w-full'))
      expect(button('Schedule').className).toEqual(expect.stringContaining('h-12'))
      expect(dialog()!.querySelector('[data-modal-footer]')!.textContent).toContain('Posts at 9:00')
      expect(dialog()!.querySelector('[data-modal-body]')!.className).toContain('overscroll-contain')
      button('Schedule').click()
      expect(wrapper.emitted('confirm')).toHaveLength(1)
      await expectAccessible(document.body)
      wrapper.unmount()
    })

    it('cancels on a tap on the scrim, the close button and Escape', async () => {
      const wrapper = mountModal({ presentation: 'sheet' })
      await flushPromises()

      document.body.querySelector<HTMLElement>('[aria-label="Close"]')!.click()
      escape()
      await flushPromises()
      expect(wrapper.emitted('cancel')).toHaveLength(2)

      await wrapper.setProps({ open: false })
      await wrapper.setProps({ open: true })
      await flushPromises()
      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      await flushPromises()
      expect(wrapper.emitted('cancel')).toHaveLength(3)
      expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
      wrapper.unmount()
    })

    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    it('follows a drag down, springs back from a slow short one and dismisses past a third', async () => {
      const wrapper = mountModal({ presentation: 'sheet' })
      await flushPromises()
      Object.defineProperty(dialog()!, 'offsetHeight', { value: 300 })

      pointer('pointerdown', 100)
      pointer('pointermove', 150)
      await flushPromises()
      expect(dialog()!.style.transform).toBe('translateY(50px)')
      await wait(150)
      pointer('pointerup', 150)
      await flushPromises()
      expect(dialog()!.style.transform).toBe('')
      expect(wrapper.emitted('cancel')).toBeUndefined()

      pointer('pointerdown', 100)
      await wait(250)
      pointer('pointerup', 220)
      await flushPromises()
      expect(wrapper.emitted('cancel')).toHaveLength(1)
      wrapper.unmount()
    })

    it('dismisses on a quick flick', async () => {
      const wrapper = mountModal({ presentation: 'sheet' })
      await flushPromises()
      Object.defineProperty(dialog()!, 'offsetHeight', { value: 600 })

      pointer('pointerdown', 100)
      pointer('pointerup', 160)
      await flushPromises()
      expect(wrapper.emitted('cancel')).toHaveLength(1)
      wrapper.unmount()
    })

    it('keeps a Close for the keyboard when not closable', async () => {
      const wrapper = mountModal({ presentation: 'sheet', closable: false })
      await flushPromises()

      expect(document.body.querySelector('[aria-label="Close"]')).toBeNull()
      const close = button('Close')
      expect(close.className).toEqual(expect.stringContaining('opacity-0'))
      expect(close.className).toEqual(expect.stringContaining('focus-visible:opacity-100'))
      close.click()
      escape()
      await flushPromises()
      expect(wrapper.emitted('cancel')).toHaveLength(2)
      await expectAccessible(document.body)
      wrapper.unmount()
    })

    it('is a sheet below sheetBelow with auto, and a dialog above it', async () => {
      const matchMedia = vi.fn((query: string) => ({
        matches: query === '(max-width: 639.98px)',
        addEventListener: () => {},
        removeEventListener: () => {}
      }))
      vi.stubGlobal('matchMedia', matchMedia)
      const narrow = mountModal({ presentation: 'auto' })
      await flushPromises()
      expect(dialog()!.className).toContain('rounded-t-(--sui-radius-sheet)')
      narrow.unmount()

      const wide = mountModal({ presentation: 'auto', sheetBelow: 480 })
      await flushPromises()
      expect(matchMedia).toHaveBeenLastCalledWith('(max-width: 479.98px)')
      expect(dialog()!.className).not.toContain('rounded-t-(--sui-radius-sheet)')
      wide.unmount()
      vi.unstubAllGlobals()
    })
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

  it('confirms on ⌘ or Ctrl Enter, unless disabled', async () => {
    const wrapper = mountModal({ confirmLabel: 'Revoke' }, { default: '<input aria-label="Name" />' })
    await flushPromises()
    const enter = () =>
      dialog()!
        .querySelector('input')!
        .dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, bubbles: true }))

    enter()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    await wrapper.setProps({ confirmDisabled: true })
    enter()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    wrapper.unmount()
  })

  it('draws a record form under a tinted band, with a hero, a hint and a footer start', async () => {
    const wrapper = mountModal(
      {
        title: 'New contact',
        band: 'rgb(var(--sui-hue-blue-soft))',
        confirmLabel: 'Add contact',
        hint: '⌘ Enter to save'
      },
      { hero: 'Ada Lovelace', 'footer-start': '<button type="button">Delete</button>' }
    )
    await flushPromises()
    const band = dialog()!.querySelector<HTMLElement>('[data-modal-header]')!

    expect(dialog()!.className).toContain('rounded-2xl')
    expect(dialog()!.className).toContain('max-w-130')
    expect(band.style.backgroundColor).toBe('rgb(var(--sui-hue-blue-soft))')
    expect(band.textContent).toContain('New contact')
    expect(band.textContent).toContain('Ada Lovelace')
    const footer = dialog()!.querySelector('[data-modal-footer]')!.textContent
    expect(footer).toMatch(/Delete.*⌘ Enter to save.*Cancel.*Add contact/)
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  it('takes a danger confirm and a size', async () => {
    const wrapper = mountModal({ confirmLabel: 'Revoke', confirmVariant: 'danger', size: 'sm' })
    await flushPromises()

    expect(dialog()!.className).toContain('max-w-[27rem]')
    expect(button('Revoke').className).toContain('bg-sui-danger-solid')
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
      return () => h(AlertDialog)
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

describe('saveHint', () => {
  it('names the platform key', () => {
    expect(saveHint()).toMatch(/^(⌘|Ctrl) Enter to save$/)
    expect(saveHint('{key}+Enter')).toMatch(/^(⌘|Ctrl)\+Enter$/)
  })
})
