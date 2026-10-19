import { markRaw, nextTick } from 'vue'

import { flushPromises, mount } from '@vue/test-utils'

import { InlineForm, InlineFormInputSelect, InlineFormInputText, InlineFormInputTitle } from '../../index'
import { expectAccessible } from '../support/axe'

describe('InlineFormInputText', () => {
  const mountText = (props = {}) =>
    mount(InlineFormInputText, {
      props: { modelValue: 'Head of growth', placeholder: 'Add a role', ...props },
      attachTo: document.body
    })

  it('shows its value, or the placeholder', async () => {
    const wrapper = mountText()
    expect(wrapper.text()).toContain('Head of growth')
    await wrapper.setProps({ modelValue: null })
    expect(wrapper.text()).toContain('Add a role')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('edits in place: saves on Enter, undoes on Escape', async () => {
    const wrapper = mountText()
    await wrapper.trigger('click')
    await nextTick()
    const textarea = wrapper.get('textarea')
    expect(document.activeElement).toBe(textarea.element)

    await textarea.setValue('VP of growth')
    await textarea.trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.text()).toContain('Head of growth')

    await wrapper.trigger('click')
    await textarea.setValue('VP of growth')
    await textarea.trigger('blur')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['VP of growth'])
    expect(wrapper.emitted('blur')).toHaveLength(1)
    wrapper.unmount()
  })

  it('stays put when disabled', async () => {
    const wrapper = mountText({ disabled: true })
    await wrapper.trigger('click')
    expect(wrapper.classes()).toContain('cursor-auto')
    expect(wrapper.find('textarea').isVisible()).toBe(false)
    wrapper.unmount()
  })
})

describe('InlineFormInputTitle', () => {
  it('edits a one-line title', async () => {
    const wrapper = mount(InlineFormInputTitle, {
      props: { modelValue: 'Ada', placeholder: 'Name' },
      attachTo: document.body
    })
    await wrapper.trigger('click')
    await nextTick()
    const textarea = wrapper.get('textarea')
    await textarea.setValue('Ada Lovelace')
    await textarea.trigger('blur')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Ada Lovelace'])
    wrapper.unmount()
  })
})

describe('InlineForm', () => {
  it('lays out labelled fields and reports each change', async () => {
    const model = { role: 'Head of growth', stage: 'customer' }
    const wrapper = mount(InlineForm, {
      props: {
        modelValue: model,
        fields: [
          { id: 'role', label: 'Role', component: markRaw(InlineFormInputText), placeholder: 'Add a role' },
          {
            id: 'stage',
            label: 'Stage',
            component: markRaw(InlineFormInputSelect),
            props: {
              options: [
                { label: 'Lead', value: 'lead' },
                { label: 'Customer', value: 'customer' }
              ]
            }
          }
        ]
      },
      attachTo: document.body
    })

    expect(wrapper.findAll('label').map((l) => l.text())).toEqual(['Role', 'Stage'])
    expect(wrapper.text()).toContain('Customer')

    await wrapper.find('[data-test="role"]').trigger('click')
    await nextTick()
    const textarea = wrapper.get('textarea')
    await textarea.setValue('VP')
    await textarea.trigger('blur')
    await flushPromises()
    expect(wrapper.emitted('change')?.[0]).toEqual(['role', 'VP'])
    expect(model.role).toBe('VP')
    wrapper.unmount()
  })
})
