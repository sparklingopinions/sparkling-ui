import { defineComponent, h, ref } from 'vue'

import { flushPromises, mount } from '@vue/test-utils'

import { AlertDialog, DropdownMenu, type DropdownMenuEntry } from '../../index'
import { expectAccessible } from '../support/axe'

const items: DropdownMenuEntry[] = [
  { type: 'action', label: 'Rename', action: 'rename', shortcut: 'R' },
  { type: 'separator' },
  { type: 'action', label: 'Delete', action: 'delete', variant: 'danger', confirmed: true }
]

const Host = defineComponent({
  emits: ['click-item'],
  setup(_, { emit }) {
    const shown = ref(0)
    return () =>
      h('div', [
        h(DropdownMenu, {
          id: 'p1',
          items,
          onClickItem: (item: unknown) => emit('click-item', item),
          onShow: () => shown.value++
        }),
        h(AlertDialog)
      ])
  }
})

const menuitems = () => [...document.body.querySelectorAll('[role="menuitem"]')] as HTMLElement[]
const button = (name: string) =>
  [...document.body.querySelectorAll('button')].find((b) => b.textContent?.trim() === name)!

async function openMenu() {
  const wrapper = mount(Host, { attachTo: document.body })
  const trigger = wrapper.get('button[aria-haspopup="menu"]')
  await trigger.trigger('keydown', { key: 'Enter' })
  await flushPromises()
  return wrapper
}

describe('DropdownMenu', () => {
  it('has an icon trigger named by its tooltip text', () => {
    const wrapper = mount(DropdownMenu, { props: { items } })

    expect(wrapper.get('button').attributes()).toMatchObject({ 'aria-label': 'More actions', 'aria-haspopup': 'menu' })
    wrapper.unmount()
  })

  it('opens a menu of actions and separators', async () => {
    const wrapper = await openMenu()

    expect(menuitems().map((item) => item.textContent?.trim())).toEqual(['RenameR', 'Delete'])
    expect(document.body.querySelectorAll('[role="separator"]')).toHaveLength(1)
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  it('lines the menu up with the end of its trigger when asked', async () => {
    const wrapper = mount(DropdownMenu, { props: { items, align: 'end' }, attachTo: document.body })
    await wrapper.get('button').trigger('keydown', { key: 'Enter' })
    await flushPromises()

    expect(document.body.querySelector('[role="menu"]')?.getAttribute('data-align')).toBe('end')
    wrapper.unmount()
  })

  it('emits a chosen action with the menu id', async () => {
    const wrapper = await openMenu()
    menuitems()[0]!.click()
    await flushPromises()

    expect(wrapper.emitted('click-item')?.[0]).toEqual([expect.objectContaining({ id: 'p1', action: 'rename' })])
    wrapper.unmount()
  })

  it('confirms a destructive action first, with Delete on the danger button', async () => {
    const wrapper = await openMenu()
    menuitems()[1]!.click()
    await flushPromises()

    expect(document.body.querySelector('[role="alertdialog"]')?.textContent).toContain('Are you sure?')
    expect(wrapper.emitted('click-item')).toBeUndefined()
    button('Delete').click()
    await flushPromises()
    expect(wrapper.emitted('click-item')?.[0]).toEqual([expect.objectContaining({ action: 'delete' })])
    wrapper.unmount()
  })
})
