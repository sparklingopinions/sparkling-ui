import { mount } from '@vue/test-utils'

import { Checkbox, ErrorSummary, Input, Radio, Textarea } from '../../index'
import { expectAccessible } from '../support/axe'

describe('Input', () => {
  it('binds v-model and passes attributes to the input', async () => {
    const wrapper = mount(Input, {
      props: { modelValue: 'Acme' },
      attrs: { id: 'name', type: 'email', placeholder: 'Your name', 'aria-label': 'Name' },
      attachTo: document.body
    })
    const input = wrapper.element as HTMLInputElement

    expect(input.tagName).toBe('INPUT')
    expect(input.value).toBe('Acme')
    expect(wrapper.attributes()).toMatchObject({ id: 'name', type: 'email', placeholder: 'Your name' })
    await wrapper.setValue('Acme Inc')
    expect(wrapper.emitted('update:modelValue')).toEqual([['Acme Inc']])
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('marks an invalid value and disables', () => {
    const wrapper = mount(Input, { props: { invalid: true, disabled: true } })

    expect(wrapper.attributes()).toMatchObject({ 'aria-invalid': 'true', disabled: '' })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['border-sui-danger-mid', 'opacity-60']))
  })
})

describe('Textarea', () => {
  it('binds v-model', async () => {
    const wrapper = mount(Textarea, {
      props: { modelValue: '' },
      attrs: { rows: 3, 'aria-label': 'Reply' },
      attachTo: document.body
    })

    await wrapper.setValue('Thanks!')
    expect(wrapper.emitted('update:modelValue')).toEqual([['Thanks!']])
    expect(wrapper.attributes('rows')).toBe('3')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('marks an invalid value', () => {
    const wrapper = mount(Textarea, { props: { invalid: true } })

    expect(wrapper.attributes('aria-invalid')).toBe('true')
    expect(wrapper.classes()).toContain('border-sui-danger-mid')
  })
})

describe('Checkbox', () => {
  it('toggles a boolean, with attributes on the input and class on the wrapper', async () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: false },
      attrs: { id: 'track', class: 'ml-2', 'aria-label': 'Track opens' },
      attachTo: document.body
    })
    const input = wrapper.get('input')

    expect(wrapper.classes()).toContain('ml-2')
    expect(input.attributes()).toMatchObject({ id: 'track', type: 'checkbox', 'aria-label': 'Track opens' })
    expect(wrapper.find('svg').exists()).toBe(false)
    await input.setValue(true)
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.find('svg').exists()).toBe(true)
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })
})

describe('Radio', () => {
  it('sets the group value when chosen', async () => {
    const wrapper = mount(
      {
        components: { Radio },
        data: () => ({ keep: 'a' }),
        template: `
          <div>
            <Radio v-model="keep" aria-label="Keep Ada" name="keep" value="a" />
            <Radio v-model="keep" aria-label="Keep Bea" name="keep" value="b" />
          </div>
        `
      },
      { attachTo: document.body }
    )
    const [first, second] = wrapper.findAll('input')

    expect((first!.element as HTMLInputElement).checked).toBe(true)
    await second!.setValue(true)
    expect((wrapper.vm as unknown as { keep: string }).keep).toBe('b')
    expect(second!.attributes()).toMatchObject({ name: 'keep', type: 'radio' })
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })
})

describe('ErrorSummary', () => {
  it('announces a list of errors under a translatable title', async () => {
    const wrapper = mount(ErrorSummary, {
      props: { errors: ['Name is required'], title: 'Please fix' },
      attachTo: document.body
    })

    expect(wrapper.attributes('role')).toBe('alert')
    expect(wrapper.text()).toContain('Please fix')
    expect(wrapper.findAll('li').map((li) => li.text())).toEqual(['Name is required'])
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })
})
