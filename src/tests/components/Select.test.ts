import { flushPromises, mount } from '@vue/test-utils'

import { FormField, Select } from '../../index'
import { expectAccessible } from '../support/axe'

const rows = [
  { value: 10, label: '10 per page' },
  { value: 25, label: '25 per page' },
  { value: 50, label: '50 per page', disabled: true }
]
const tags = [
  { value: 'vip', label: 'VIP', color: 'purple' as const },
  { value: 'press', label: 'Press', color: 'orange' as const }
]

const options = () => [...document.querySelectorAll<HTMLElement>('[role="option"]')]
const option = (text: string) => options().find((o) => o.textContent?.includes(text))!

describe('Select', () => {
  afterEach(() => (document.body.innerHTML = ''))

  it('is a bordered trigger with its placeholder, attributes on the trigger', async () => {
    const wrapper = mount(Select, {
      props: { options: rows },
      attrs: { 'aria-label': 'Rows per page', class: 'w-44' },
      attachTo: document.body
    })
    const trigger = wrapper.get('button')

    expect(trigger.attributes('aria-haspopup')).toBe('listbox')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(trigger.attributes('aria-label')).toBeUndefined()
    expect(trigger.text()).toBe('Rows per page: Select an option')
    expect(trigger.classes()).toEqual(expect.arrayContaining(['w-44', 'min-h-9', 'border-sui-line-strong']))
    await expectAccessible(wrapper.element)
  })

  it('opens a short list without search, ticks the choice and picks another', async () => {
    const wrapper = mount(Select, {
      props: { options: rows, modelValue: 25, size: 'sm' },
      attrs: { 'aria-label': 'Rows per page' },
      attachTo: document.body
    })
    expect(wrapper.get('button').text()).toBe('Rows per page: 25 per page')
    expect(wrapper.get('button').classes()).toContain('h-7')

    await wrapper.get('button').trigger('click')
    await flushPromises()
    expect(document.querySelector('[data-select-filter]')).toBeNull()
    expect(options().map((o) => o.textContent?.trim())).toEqual(['10 per page', '25 per page', '50 per page'])
    expect(option('25').getAttribute('aria-selected')).toBe('true')
    expect(option('25').querySelector('svg')).not.toBeNull()
    expect(option('50').hasAttribute('data-disabled')).toBe(true)
    await expectAccessible(document.body)

    option('10').click()
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')).toEqual([[10]])
    expect(document.querySelector('[role="listbox"]')).toBeNull()
  })

  it('filters a searchable list and reports the query', async () => {
    const wrapper = mount(Select, {
      props: { options: rows, searchable: true },
      attrs: { 'aria-label': 'Rows' },
      attachTo: document.body
    })
    await wrapper.get('button').trigger('click')
    await flushPromises()
    const filter = document.querySelector<HTMLInputElement>('[data-select-filter]')!
    filter.value = '10'
    filter.dispatchEvent(new Event('input'))
    await flushPromises()

    expect(options().map((o) => o.textContent?.trim())).toEqual(['10 per page'])
    expect(wrapper.emitted('query-change')?.at(-1)).toEqual(['10'])
  })

  it('holds several values as tags, removes one, and creates what was typed', async () => {
    const createOption = vi.fn(({ label, color }) => ({ value: label.toLowerCase(), label, color }))
    const wrapper = mount(Select, {
      props: { options: tags, modelValue: ['vip'], multiple: true, canCreate: true, createOption },
      attrs: { 'aria-label': 'Tags' },
      attachTo: document.body
    })
    expect(wrapper.get('button').text()).toBe('Tags: VIP')

    await wrapper.get('button').trigger('click')
    await flushPromises()
    expect(options().map((o) => o.textContent?.trim())).toEqual(['Press'])
    document.querySelector<HTMLButtonElement>('[aria-label="Remove"]')!.click()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])

    const filter = document.querySelector<HTMLInputElement>('[data-select-filter]')!
    filter.value = 'Board'
    filter.dispatchEvent(new Event('input'))
    await flushPromises()
    option('Create').click()
    await flushPromises()
    expect(createOption).toHaveBeenCalledWith({ label: 'Board', color: expect.any(String) })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['board']])
  })

  it('says when nothing matches, and shows a spinner while loading', async () => {
    const wrapper = mount(Select, { props: { options: [], searchable: true }, attachTo: document.body })
    await wrapper.get('button').trigger('click')
    await flushPromises()
    expect(document.body.textContent).toContain('No results found')

    await wrapper.setProps({ loading: true })
    expect(document.querySelector('[role="progressbar"]')).not.toBeNull()
  })

  it('takes its id, description and invalid state from a FormField', async () => {
    const wrapper = mount(
      {
        components: { FormField, Select },
        data: () => ({ rows }),
        template: '<FormField label="Rows" error="Pick one"><Select :options="rows" /></FormField>'
      },
      { attachTo: document.body }
    )
    const trigger = wrapper.get('button')

    expect(wrapper.get('label').attributes('for')).toBe(trigger.attributes('id'))
    expect(trigger.attributes('aria-invalid')).toBe('true')
    expect(trigger.classes()).toContain('border-sui-danger-mid')
    expect(document.getElementById(trigger.attributes('aria-describedby')!)?.textContent).toContain('Pick one')
    await expectAccessible(wrapper.element)
  })

  it('stays shut when disabled', async () => {
    const wrapper = mount(Select, { props: { options: rows, disabled: true }, attachTo: document.body })
    await wrapper.get('button').trigger('click')
    await flushPromises()
    expect(document.querySelector('[role="listbox"]')).toBeNull()
  })
})
