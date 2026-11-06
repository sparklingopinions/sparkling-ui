import { defineComponent, h } from 'vue'

import { flushPromises, mount } from '@vue/test-utils'

import { AlertDialog, type DropdownMenuAction, useMenuConfirm } from '../../index'
import { expectAccessible } from '../support/axe'

const remove: DropdownMenuAction = {
  type: 'action',
  label: 'Delete record',
  action: 'delete',
  variant: 'danger',
  confirm: { title: 'Delete this record?', message: 'Northwind goes for good.', acceptLabel: 'Delete record' }
}

let ask: ReturnType<typeof useMenuConfirm>
const Host = defineComponent({
  setup() {
    ask = useMenuConfirm()
    return () => h(AlertDialog)
  }
})

const dialog = () => document.body.querySelector('[role="alertdialog"]')
const button = (name: string) =>
  [...document.body.querySelectorAll('button')].find((b) => b.textContent?.trim() === name)!

describe('useMenuConfirm', () => {
  it('asks in the item’s own words and resolves what was chosen', async () => {
    const wrapper = mount(Host, { attachTo: document.body })
    const answer = ask(remove)
    await flushPromises()
    expect(dialog()?.textContent).toContain('Delete this record?')
    expect(dialog()?.textContent).toContain('Northwind goes for good.')
    await expectAccessible(wrapper.element)
    button('Delete record').click()
    expect(await answer).toBe(true)

    const declined = ask(remove)
    await flushPromises()
    button('Cancel').click()
    expect(await declined).toBe(false)
    wrapper.unmount()
  })

  it('goes ahead without asking for an item that doesn’t ask, and never for a disabled one', async () => {
    const wrapper = mount(Host, { attachTo: document.body })
    expect(await ask({ type: 'action', label: 'Rename', action: 'rename' })).toBe(true)
    expect(await ask({ ...remove, disabled: true })).toBe(false)
    await flushPromises()
    expect(dialog()).toBeNull()
    wrapper.unmount()
  })
})
