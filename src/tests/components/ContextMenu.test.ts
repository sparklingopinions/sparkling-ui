import { defineComponent, h } from 'vue'

import { flushPromises, mount } from '@vue/test-utils'

import { AlertDialog, ContextMenu, type DropdownMenuEntry } from '../../index'
import { expectAccessible } from '../support/axe'

const items: DropdownMenuEntry[] = [
  { type: 'action', label: 'Open', action: 'open', icon: 'external-link' },
  { type: 'action', label: 'Duplicate', action: 'duplicate', shortcut: 'D' },
  { type: 'separator' },
  { type: 'action', label: 'Delete', action: 'delete', variant: 'danger', confirmed: true }
]

const Host = defineComponent({
  props: { disabled: Boolean },
  emits: ['click-item', 'update:open'],
  setup(props, { emit }) {
    return () =>
      h('div', [
        h(
          ContextMenu,
          {
            id: 'p1',
            items,
            label: 'Post actions',
            disabled: props.disabled,
            onClickItem: (item: unknown) => emit('click-item', item),
            'onUpdate:open': (open: boolean) => emit('update:open', open)
          },
          () => h('div', { tabindex: 0, 'data-target': '' }, 'Launch post')
        ),
        h(AlertDialog)
      ])
  }
})

const menu = () => document.body.querySelector<HTMLElement>('[role="menu"]')
const menuitems = () => [...document.body.querySelectorAll<HTMLElement>('[role="menuitem"]')]
const button = (name: string) =>
  [...document.body.querySelectorAll('button')].find((b) => b.textContent?.trim() === name)!

describe('ContextMenu', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders its target with no wrapper of its own', () => {
    const wrapper = mount(Host)

    expect(wrapper.element.firstElementChild?.hasAttribute('data-target')).toBe(true)
    wrapper.unmount()
  })

  it('opens on right-click, named, with the same items as DropdownMenu', async () => {
    const wrapper = mount(Host, { attachTo: document.body })
    await wrapper.get('[data-target]').trigger('contextmenu', { clientX: 40, clientY: 20 })
    await flushPromises()

    expect(menu()?.getAttribute('aria-label')).toBe('Post actions')
    expect(menu()?.className).toContain('z-[1100]')
    expect(menuitems().map((item) => item.textContent?.trim())).toEqual(['Open', 'DuplicateD', 'Delete'])
    expect(wrapper.emitted('update:open')).toEqual([[true]])
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  it.each([
    ['Shift+F10', { key: 'F10', shiftKey: true }],
    ['the Menu key', { key: 'ContextMenu' }]
  ])('opens from the keyboard with %s', async (_, key) => {
    const wrapper = mount(Host, { attachTo: document.body })
    await wrapper.get('[data-target]').trigger('keydown', key)
    await flushPromises()

    expect(menu()).not.toBeNull()
    wrapper.unmount()
  })

  it('lets the browser menu through when disabled', async () => {
    const wrapper = mount(Host, { props: { disabled: true }, attachTo: document.body })
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true })
    wrapper.get('[data-target]').element.dispatchEvent(event)
    await wrapper.get('[data-target]').trigger('keydown', { key: 'ContextMenu' })
    await flushPromises()

    expect(event.defaultPrevented).toBe(false)
    expect(menu()).toBeNull()
    wrapper.unmount()
  })

  it('emits a chosen action with the menu id, confirming a destructive one first', async () => {
    const wrapper = mount(Host, { attachTo: document.body })
    await wrapper.get('[data-target]').trigger('contextmenu')
    await flushPromises()
    menuitems()[1]!.click()
    await flushPromises()
    expect(wrapper.emitted('click-item')?.[0]).toEqual([expect.objectContaining({ id: 'p1', action: 'duplicate' })])

    await wrapper.get('[data-target]').trigger('contextmenu')
    await flushPromises()
    menuitems()[2]!.click()
    await flushPromises()
    expect(document.body.querySelector('[role="alertdialog"]')?.textContent).toContain('Are you sure?')
    button('Delete').click()
    await flushPromises()
    expect(wrapper.emitted('click-item')?.[1]).toEqual([expect.objectContaining({ action: 'delete' })])
    wrapper.unmount()
  })
})
