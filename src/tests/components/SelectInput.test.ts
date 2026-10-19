import { defineComponent, h, ref } from 'vue'

import { flushPromises, mount } from '@vue/test-utils'

import { SelectInput, type SelectInputItem } from '../../index'
import { expectAccessible } from '../support/axe'

const items: SelectInputItem[] = ['Acme Inc', 'Globex', 'Initech'].map((name, i) => ({ id: String(i + 1), name }))

function mountSelect(props: Record<string, unknown> = {}, initial: SelectInputItem | SelectInputItem[] | null = null) {
  const value = ref(initial)
  const Host = defineComponent({
    setup: () => () =>
      h(
        SelectInput,
        { items, ...props, modelValue: value.value, 'onUpdate:modelValue': (v: typeof initial) => (value.value = v) },
        {
          trigger: ({ onClick }: { onClick: (e: Event) => void }) =>
            h('button', { type: 'button', onClick }, 'Pick a company')
        }
      )
  })
  return { wrapper: mount(Host, { attachTo: document.body }), value }
}

const panel = () => document.body.querySelector<HTMLElement>('[role="dialog"]')
const filter = () => panel()!.querySelector('input')!
const options = () => [...panel()!.querySelectorAll<HTMLElement>('[role="option"]')]
const type = async (text: string) => {
  filter().value = text
  filter().dispatchEvent(new Event('input'))
  await flushPromises()
}
const key = async (k: string) => {
  filter().dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }))
  await flushPromises()
}

async function open(props = {}, initial: SelectInputItem | SelectInputItem[] | null = null) {
  const mounted = mountSelect(props, initial)
  await mounted.wrapper.get('button').trigger('click')
  await flushPromises()
  return mounted
}

describe('SelectInput', () => {
  it('opens a filterable list from its trigger', async () => {
    const { wrapper } = await open()

    expect(options().map((o) => o.textContent?.trim())).toEqual(['Acme Inc', 'Globex', 'Initech'])
    expect(filter().placeholder).toBe('Type something...')
    await type('glo')
    expect(options().map((o) => o.textContent?.trim())).toEqual(['Globex'])
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  it('picks one, then closes', async () => {
    const { wrapper, value } = await open()
    options()[1]!.click()
    await flushPromises()

    expect(value.value).toEqual(items[1])
    expect(panel()).toBeNull()
    wrapper.unmount()
  })

  it('picks by keyboard: arrow down and Enter', async () => {
    const { wrapper, value } = await open()
    await key('ArrowDown')
    await key('ArrowDown')
    await key('Enter')

    expect(value.value).toEqual(items[1])
    wrapper.unmount()
  })

  it('collects several when multiple, shown as removable tags', async () => {
    const { wrapper, value } = await open({ multiple: true }, [items[0]!])
    expect(options().map((o) => o.textContent?.trim())).toEqual(['Globex', 'Initech'])

    options()[1]!.click()
    await flushPromises()
    expect(value.value).toEqual([items[0], items[2]])
    expect(panel()).not.toBeNull()

    await key('Backspace')
    expect(value.value).toEqual([items[0]])
    panel()!.querySelector<HTMLElement>('button[aria-label="Remove"]')!.click()
    await flushPromises()
    expect(value.value).toEqual([])
    wrapper.unmount()
  })

  it('emits each query, for searching elsewhere', async () => {
    const { wrapper } = await open()
    await type('ini')

    expect(wrapper.findComponent(SelectInput).emitted('query-change')).toEqual([['ini']])
    wrapper.unmount()
  })

  it('offers to create what was typed', async () => {
    const createFn = vi.fn((item: { name: string }) => ({ id: 'new', ...item }))
    const { wrapper, value } = await open({ canCreate: true, createColored: false, createFn })
    await type('Hooli')

    const create = options().at(-1)!
    expect(create.textContent).toContain('Create')
    expect(create.textContent).toContain('“Hooli”')
    create.click()
    await flushPromises()
    expect(createFn).toHaveBeenCalledWith({ name: 'Hooli' })
    expect(value.value).toEqual({ id: 'new', name: 'Hooli' })
    wrapper.unmount()
  })

  it('says when nothing matches, and shows a spinner while loading', async () => {
    const { wrapper } = await open({ emptyPlaceholder: 'Nothing here' })
    await type('zzz')
    expect(panel()!.textContent).toContain('Nothing here')
    wrapper.unmount()

    const loading = await open({ loading: true })
    expect(panel()!.querySelector('[role="progressbar"]')).not.toBeNull()
    loading.wrapper.unmount()
  })
})
