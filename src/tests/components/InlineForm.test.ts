import { nextTick } from 'vue'

import { flushPromises, mount } from '@vue/test-utils'

import { InlineField, InlineForm } from '../../index'
import { expectAccessible } from '../support/axe'

const stages = [
  { label: 'Lead', value: 'lead' },
  { label: 'Customer', value: 'customer' }
]

describe('InlineField', () => {
  const mountField = (props = {}) =>
    mount(InlineField, {
      props: { modelValue: 'Head of growth', placeholder: 'Add a role', ...props },
      attachTo: document.body
    })

  it('shows its value, or the placeholder, as a focusable button', async () => {
    const wrapper = mountField()
    expect(wrapper.text()).toContain('Head of growth')
    expect(wrapper.attributes('role')).toBe('button')
    expect(wrapper.attributes('tabindex')).toBe('0')
    await wrapper.setProps({ modelValue: null })
    expect(wrapper.text()).toContain('Add a role')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('edits in place: saves on Enter or leaving, undoes on Escape', async () => {
    const wrapper = mountField()
    await wrapper.trigger('keydown', { key: 'Enter' })
    await nextTick()
    const textarea = () => wrapper.get('textarea')
    expect(document.activeElement).toBe(textarea().element)

    await textarea().setValue('VP of growth')
    await textarea().trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.text()).toContain('Head of growth')

    await wrapper.trigger('click')
    await textarea().setValue('VP of growth')
    await textarea().trigger('blur')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['VP of growth'])
    expect(wrapper.emitted('blur')).toHaveLength(1)
    wrapper.unmount()
  })

  it('takes Shift+Enter as a new line when multiline', async () => {
    const wrapper = mountField({ variant: 'multiline' })
    await wrapper.trigger('click')
    await nextTick()
    const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, bubbles: true, cancelable: true })
    wrapper.get('textarea').element.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
    wrapper.unmount()
  })

  it('stays put when disabled', async () => {
    const wrapper = mountField({ disabled: true })
    await wrapper.trigger('click')
    expect(wrapper.classes()).toContain('cursor-auto')
    expect(wrapper.attributes('tabindex')).toBe('-1')
    expect(wrapper.find('textarea').exists()).toBe(false)
    wrapper.unmount()
  })

  it('edits a one-line title', async () => {
    const wrapper = mountField({ variant: 'title', modelValue: 'Ada', placeholder: 'Name' })
    expect(wrapper.classes()).toContain('text-lg')
    await wrapper.trigger('click')
    await nextTick()
    await wrapper.get('textarea').setValue('Ada Lovelace')
    await wrapper.get('textarea').trigger('blur')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Ada Lovelace'])
    wrapper.unmount()
  })

  it('shows a chosen option as a Chip, and picks from a list', async () => {
    const wrapper = mountField({
      variant: 'select',
      modelValue: 'customer',
      options: stages,
      placeholder: 'Pick a stage'
    })
    const trigger = wrapper.get('button')
    expect(trigger.text()).toBe('Pick a stage: Customer')
    expect(trigger.attributes('aria-haspopup')).toBe('listbox')

    await trigger.trigger('click')
    await flushPromises()
    const lead = [...document.querySelectorAll<HTMLElement>('[role="option"]')].find((o) =>
      o.textContent?.includes('Lead')
    )!
    lead.click()
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['lead'])
    wrapper.unmount()
  })
})

describe('InlineForm', () => {
  it('lays out labelled fields by type and reports each change', async () => {
    const wrapper = mount(InlineForm, {
      props: {
        modelValue: { role: 'Head of growth', stage: 'customer' },
        fields: [
          { id: 'role', label: 'Role', placeholder: 'Add a role' },
          { id: 'stage', label: 'Stage', type: 'select', options: stages }
        ]
      },
      attachTo: document.body
    })

    expect(wrapper.findAll('label').map((l) => l.text())).toEqual(['Role', 'Stage'])
    expect(wrapper.text()).toContain('Customer')
    expect(wrapper.find('label[for="role"]').exists()).toBe(true)
    await expectAccessible(wrapper.element)

    await wrapper.get('#role').trigger('click')
    await nextTick()
    await wrapper.get('textarea').setValue('VP')
    await wrapper.get('textarea').trigger('blur')
    await flushPromises()
    expect(wrapper.emitted('change')?.[0]).toEqual(['role', 'VP'])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{ role: 'VP', stage: 'customer' }])
    wrapper.unmount()
  })
})
