import { defineComponent, nextTick, ref } from 'vue'

import { flushPromises, mount } from '@vue/test-utils'

import { Button, FilterChip, FilterMenu, SortMenu, describeFilter } from '../../index'
import { expectAccessible } from '../support/axe'

const stages = [
  { value: 'lead', label: 'Lead', count: 412 },
  { value: 'contacted', label: 'Contacted' },
  { value: 'customer', label: 'Customer' }
]
const fields = [
  { name: 'name', label: 'Name', type: 'text' as const, group: 'Person' },
  { name: 'stage', label: 'Stage', type: 'enum' as const, group: 'Person' },
  { name: 'lastContact', label: 'Last contact', type: 'date' as const, group: 'Activity' }
]
const panel = () => document.body.querySelector<HTMLElement>('[role="dialog"]')!

afterEach(() => {
  document.body.innerHTML = ''
})

describe('describeFilter', () => {
  const labels = { valueLabel: 'stages', yesLabel: 'Yes', noLabel: 'No' }

  it('names up to two values, then counts them', () => {
    expect(describeFilter(['lead', 'customer'], stages, labels)).toBe('Lead, Customer')
    expect(describeFilter(['lead', 'contacted', 'customer'], stages, labels)).toBe('3 stages')
    expect(describeFilter(true, [], labels)).toBe('Yes')
    expect(describeFilter(null, [], labels)).toBe('')
  })
})

describe('FilterChip', () => {
  it('reads as a sentence and edits a checklist in its panel', async () => {
    const onRemove = vi.fn()
    const wrapper = mount(FilterChip, {
      props: {
        field: 'Stage',
        options: stages,
        op: 'is any of',
        modelValue: ['lead'],
        'onUpdate:modelValue': (modelValue) => wrapper.setProps({ modelValue }),
        status: '412 people',
        onRemove
      },
      attachTo: document.body
    })
    const chip = wrapper.find('button')

    expect(chip.text()).toBe('Stage is any of Lead')
    await chip.trigger('click')
    await flushPromises()
    expect(panel().textContent).toContain('412 people')
    expect(panel().textContent).toContain('↵Done')
    const boxes = panel().querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
    expect([...boxes].map((box) => box.checked)).toEqual([true, false, false])
    boxes[2].click()
    await flushPromises()
    expect(wrapper.props('modelValue')).toEqual(['lead', 'customer'])
    expect(chip.text()).toBe('Stage is any of Lead, Customer')
    await expectAccessible(document.body)
    ;[...panel().querySelectorAll('button')].find((b) => b.textContent?.includes('Remove'))!.click()
    expect(onRemove).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('hides the value and editor for operators that need none', async () => {
    const wrapper = mount(FilterChip, {
      props: { field: 'Company', type: 'company', op: 'is empty', modelValue: ['acme'], open: true },
      attachTo: document.body
    })
    await flushPromises()

    expect(wrapper.find('button').text()).toBe('Company is empty')
    expect(panel().querySelector('input')).toBeNull()
    wrapper.unmount()
  })

  it('searches long checklists, and edits text, dates and booleans', async () => {
    const options = Array.from({ length: 8 }, (_, i) => ({ value: i, label: `Company ${i}` }))
    const list = mount(FilterChip, {
      props: { field: 'Company', type: 'company', options, open: true },
      attachTo: document.body
    })
    await flushPromises()
    const search = panel().querySelector<HTMLInputElement>('input[aria-label="Search…"]')!
    search.value = '7'
    search.dispatchEvent(new Event('input'))
    await nextTick()
    expect(panel().querySelectorAll('label')).toHaveLength(1)
    list.unmount()

    const text = mount(FilterChip, {
      props: { field: 'Name', type: 'text', op: 'contains', open: true },
      attachTo: document.body
    })
    await flushPromises()
    const input = panel().querySelector<HTMLInputElement>('input[aria-label="Name"]')!
    input.value = 'Ada'
    input.dispatchEvent(new Event('input'))
    expect(text.emitted('update:modelValue')).toEqual([['Ada']])
    text.unmount()

    const date = mount(FilterChip, {
      props: { field: 'Last contact', type: 'date', op: 'is within', open: true },
      attachTo: document.body
    })
    await flushPromises()
    panel().querySelectorAll<HTMLElement>('[role="radio"]')[1].click()
    await flushPromises()
    expect(date.emitted('update:modelValue')).toEqual([['Last 7 days']])
    date.unmount()

    const bool = mount(FilterChip, { props: { field: 'VIP', type: 'boolean', op: 'is', modelValue: false } })
    expect(bool.find('button').text()).toBe('VIP is No')
  })

  it('reads your own summary in place of field, operator and value', () => {
    const wrapper = mount(FilterChip, {
      props: { field: 'Archived', type: 'boolean', op: 'is', modelValue: false, summary: { field: 'Not archived' } }
    })
    expect(wrapper.find('button').text()).toBe('Not archived')

    const date = mount(FilterChip, {
      props: {
        field: 'Last message',
        type: 'date',
        op: 'is within',
        summary: { field: 'Last message', op: 'in', value: 'the last 7 days' }
      }
    })
    expect(date.find('button').text()).toBe('Last message in the last 7 days')
  })

  it('leaves Yes and No unpicked while a boolean has no value', async () => {
    mount(FilterChip, { props: { field: 'VIP', type: 'boolean', op: 'is', open: true }, attachTo: document.body })
    await flushPromises()
    const checked = [...panel().querySelectorAll('[role="radio"]')].filter(
      (r) => r.getAttribute('aria-checked') === 'true'
    )
    expect(checked).toHaveLength(0)
  })

  it('closes on Enter in the panel', async () => {
    const wrapper = mount(FilterChip, {
      props: { field: 'Name', type: 'text', op: 'is', open: true },
      attachTo: document.body
    })
    await flushPromises()

    panel()
      .querySelector('input')!
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(wrapper.emitted('update:open')).toEqual([[false]])
    wrapper.unmount()
  })

  it('starts a filter with kind add', async () => {
    const onClick = vi.fn()
    const wrapper = mount(FilterChip, { props: { kind: 'add', addLabel: 'Filtern' }, attrs: { onClick } })

    expect(wrapper.text()).toBe('Filtern')
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalled()
  })
})

describe('FilterMenu', () => {
  it('lists fields by group, marks those in use, and picks one', async () => {
    const wrapper = mount(FilterMenu, { props: { fields, inUse: ['stage'] }, attachTo: document.body })

    await wrapper.find('button').trigger('click')
    await flushPromises()
    expect(
      [...panel().querySelectorAll('[role="group"] > :first-child')].map((label) => label.textContent?.trim())
    ).toEqual(['Person', 'Activity'])
    expect(panel().textContent).toContain('In use')
    expect(panel().textContent).toContain('3 fields')
    await expectAccessible(document.body)
    panel().querySelectorAll<HTMLElement>('[role="option"]')[2].click()
    await flushPromises()
    expect(wrapper.emitted('pick')).toEqual([['lastContact']])
    expect(wrapper.emitted('update:open')).toContainEqual([false])
    wrapper.unmount()
  })

  it('picks the first field on Enter when none is highlighted', async () => {
    const wrapper = mount(FilterMenu, { props: { fields, open: true }, attachTo: document.body })
    await flushPromises()
    panel()
      .querySelector('input')!
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    await flushPromises()
    expect(wrapper.emitted('pick')).toEqual([['name']])
    wrapper.unmount()
  })

  it('is the Filters button, tinted while filters are in use, or ghost in a page header', () => {
    const wrapper = mount(FilterMenu, { props: { fields, as: 'button', inUse: ['stage'] } })

    expect(wrapper.find('button').text()).toBe('Filters')
    expect(wrapper.find('button').classes()).toContain('bg-sui-accent-wash')
    const ghost = mount(FilterMenu, { props: { fields, as: 'button', variant: 'ghost', inUse: ['stage'] } })
    expect(ghost.find('button').classes()).toContain('text-sui-ink-subtle')
    expect(ghost.find('button').classes()).not.toContain('bg-sui-accent-wash')
  })

  it('opens from your own trigger, with its count, and is controlled with v-model:open', async () => {
    const open = ref(false)
    const wrapper = mount(
      defineComponent({
        components: { SuiButton: Button, FilterMenu },
        setup: () => ({ fields, open }),
        template: `
          <FilterMenu v-model:open="open" :fields="fields" :in-use="['stage']">
            <template #trigger="{ count, props }">
              <SuiButton v-bind="props" variant="ghost">Filters {{ count }}</SuiButton>
            </template>
          </FilterMenu>`
      }),
      { attachTo: document.body }
    )
    const button = wrapper.find('button')

    expect(button.text()).toBe('Filters 1')
    expect(button.attributes()).toMatchObject({ 'aria-haspopup': 'dialog', 'aria-expanded': 'false' })
    await button.trigger('click')
    await flushPromises()
    expect(open.value).toBe(true)
    expect(button.attributes('aria-expanded')).toBe('true')
    expect(button.attributes('aria-controls')).toBe(panel().id)
    await expectAccessible(document.body)

    open.value = false
    await flushPromises()
    expect(document.body.querySelector('[role="dialog"]')).toBeNull()
    wrapper.unmount()
  })
})

describe('SortMenu', () => {
  it('reads as a chip worded for the type, and only while sorted', async () => {
    const wrapper = mount(SortMenu, { props: { options: fields, modelValue: { name: 'lastContact', dir: 'desc' } } })

    expect(wrapper.find('button').text()).toBe('Last contact, Newest first')
    await wrapper.setProps({ modelValue: null })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('picks a field, keeps its direction, switches it and clears', async () => {
    const wrapper = mount(SortMenu, {
      props: {
        options: fields,
        as: 'button' as const,
        modelValue: { name: 'name', dir: 'desc' as const },
        'onUpdate:modelValue': (modelValue) => wrapper.setProps({ modelValue }),
        open: true
      },
      attachTo: document.body
    })
    await flushPromises()
    const radios = () => [...panel().querySelectorAll<HTMLElement>('[role="radio"]')]

    expect(radios().map((r) => r.textContent?.trim())).toEqual(['Name', 'Stage', 'Last contact', 'A → Z', 'Z → A'])
    await expectAccessible(document.body)
    radios()[1].click()
    await flushPromises()
    expect(wrapper.props('modelValue')).toEqual({ name: 'stage', dir: 'asc' })
    radios()[4].click()
    await flushPromises()
    expect(wrapper.props('modelValue')).toEqual({ name: 'stage', dir: 'desc' })
    expect(radios()[4].textContent?.trim()).toBe('Last to first')
    ;[...panel().querySelectorAll('button')].find((b) => b.textContent?.trim() === 'Clear sort')!.click()
    await flushPromises()
    expect(wrapper.props('modelValue')).toBeNull()
    wrapper.unmount()
  })

  it('starts a field in its own direction', async () => {
    const dated = fields.map((f) => (f.type === 'date' ? { ...f, sortDir: 'desc' as const } : f))
    const wrapper = mount(SortMenu, {
      props: { options: dated, as: 'button' as const, modelValue: null, open: true },
      attachTo: document.body
    })
    await flushPromises()
    panel().querySelectorAll<HTMLElement>('[role="radio"]')[2]!.click()
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([{ name: 'lastContact', dir: 'desc' }])
    wrapper.unmount()
  })

  it('is a ghost Sort button in a page header, even while sorted', () => {
    const wrapper = mount(SortMenu, {
      props: { options: fields, as: 'button', variant: 'ghost', modelValue: { name: 'name', dir: 'asc' } }
    })

    expect(wrapper.find('button').classes()).toContain('text-sui-ink-subtle')
    expect(wrapper.find('button').classes()).not.toContain('bg-sui-accent-wash')
  })

  it('opens from your own trigger, even unsorted, and returns focus to it', async () => {
    const wrapper = mount(
      defineComponent({
        components: { SuiButton: Button, SortMenu },
        setup: () => ({ fields, sort: ref(null), open: ref(false) }),
        template: `
          <SortMenu v-model="sort" v-model:open="open" :options="fields">
            <template #trigger="{ active, label, props }">
              <SuiButton v-bind="props" :variant="active ? 'tinted' : 'ghost'">{{ label || 'Sort' }}</SuiButton>
            </template>
          </SortMenu>`
      }),
      { attachTo: document.body }
    )
    const button = () => wrapper.find('button')

    expect(button().text()).toBe('Sort')
    await button().trigger('click')
    await flushPromises()
    panel().querySelectorAll<HTMLElement>('[role="radio"]')[0]!.click()
    await flushPromises()
    expect(button().text()).toBe('Name, A → Z')
    expect(button().classes()).toContain('bg-sui-accent-wash')

    panel().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await flushPromises()
    expect(document.body.querySelector('[role="dialog"]')).toBeNull()
    expect(document.activeElement).toBe(button().element)
    wrapper.unmount()
  })
})
