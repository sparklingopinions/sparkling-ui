import { defineComponent, h, nextTick, ref } from 'vue'

import { flushPromises, mount } from '@vue/test-utils'

import { PopoverDialog, type PopoverDialogTriggerProps } from '../../index'
import { expectAccessible } from '../support/axe'

const Host = defineComponent({
  props: { withAnchor: { type: Boolean, default: true }, withTrigger: Boolean },
  emits: ['confirm', 'cancel'],
  setup(props, { emit, expose }) {
    const open = ref(false)
    const anchor = ref<HTMLElement | null>(null)
    expose({ open })
    return () =>
      h('div', [
        h('button', { ref: anchor, 'data-anchor': '' }, 'Link'),
        h('div', { tabindex: 0, 'data-row': '' }, 'A row'),
        h(
          PopoverDialog,
          {
            title: 'Add a link',
            confirmLabel: 'Add',
            open: open.value,
            anchor: props.withAnchor ? anchor.value : undefined,
            'onUpdate:open': (value: boolean) => (open.value = value),
            onConfirm: () => emit('confirm'),
            onCancel: () => emit('cancel')
          },
          {
            default: () => h('input', { 'aria-label': 'Link', autofocus: true }),
            ...(props.withTrigger && {
              trigger: ({ props: trigger }: { props: PopoverDialogTriggerProps }) =>
                h('button', { ...trigger, 'data-trigger': '' }, 'Add a link')
            })
          }
        )
      ])
  }
})

const dialog = () => document.body.querySelector<HTMLElement>('[role="dialog"]')
const button = (name: string) =>
  [...document.body.querySelectorAll('button')].find((b) => b.textContent?.trim() === name)!
const openHost = async (wrapper: ReturnType<typeof mount>) => {
  ;(wrapper.vm as unknown as { open: boolean }).open = true
  await flushPromises()
  await nextTick()
}

describe('PopoverDialog', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.unstubAllGlobals()
  })

  it('opens as a popover at its anchor, named by its title, with focus inside', async () => {
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    await openHost(wrapper)

    expect(dialog()?.getAttribute('aria-label')).toBe('Add a link')
    expect(dialog()?.querySelector('h2')?.textContent).toBe('Add a link')
    expect(dialog()?.style.width).toBe('320px')
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Link')
    expect(button('Cancel')).toBeDefined()
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  it('confirms from the button and from Cmd or Ctrl Enter, staying open for the app to close', async () => {
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    await openHost(wrapper)

    button('Add').click()
    document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, bubbles: true }))
    document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await flushPromises()

    expect(wrapper.emitted('confirm')).toHaveLength(2)
    expect(dialog()).not.toBeNull()
    wrapper.unmount()
  })

  it('cancels from Cancel and returns focus to what had it when it opened', async () => {
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    const row = document.body.querySelector<HTMLElement>('[data-row]')!
    row.focus()
    await openHost(wrapper)

    button('Cancel').click()
    await flushPromises()

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect((wrapper.vm as unknown as { open: boolean }).open).toBe(false)
    expect(document.activeElement).toBe(row)
    wrapper.unmount()
  })

  it('anchors to its trigger slot without an anchor, which it wires up', async () => {
    const wrapper = mount(Host, { props: { withAnchor: false, withTrigger: true }, attachTo: document.body })
    const trigger = wrapper.get('[data-trigger]')
    expect(trigger.attributes()).toMatchObject({ 'aria-haspopup': 'dialog', 'aria-expanded': 'false' })

    await trigger.trigger('click')
    await flushPromises()
    await nextTick()

    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(trigger.attributes('aria-controls')).toBe(dialog()?.id)
    expect(dialog()?.className).toContain('rounded-lg')
    wrapper.unmount()
  })

  it('is a small dialog without an anchor or a trigger', async () => {
    const wrapper = mount(Host, { props: { withAnchor: false }, attachTo: document.body })
    await openHost(wrapper)

    expect(dialog()?.className).toContain('max-w-[27rem]')
    expect(dialog()?.querySelector('h2')?.textContent?.trim()).toBe('Add a link')
    wrapper.unmount()
  })

  it('is a bottom sheet below sheetBelow', async () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('639.98'),
      addEventListener: () => {},
      removeEventListener: () => {}
    }))
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    await openHost(wrapper)

    expect(dialog()?.className).toContain('rounded-t-(--sui-radius-sheet)')
    await expectAccessible(document.body)
    wrapper.unmount()
  })
})
