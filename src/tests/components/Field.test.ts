import { nextTick } from 'vue'

import { mount } from '@vue/test-utils'

import { Field, TextInput, Textarea } from '../../index'
import { expectAccessible } from '../support/axe'

describe('Field', () => {
  it('labels its control and describes it with the hint', async () => {
    const wrapper = mount(
      {
        components: { Field, TextInput },
        template: '<Field label="Email" hint="For replies." required><TextInput /></Field>'
      },
      { attachTo: document.body }
    )
    const input = wrapper.find('input')
    const label = wrapper.find('label')

    expect(label.attributes('for')).toBe(input.attributes('id'))
    expect(label.text()).toBe('Email * (required)')
    expect(input.attributes('aria-required')).toBe('true')
    expect(document.getElementById(input.attributes('aria-describedby')!)!.textContent?.trim()).toBe('For replies.')
    expect(input.attributes('aria-invalid')).toBeUndefined()
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('replaces the hint with an error, as an alert, and marks the control invalid', async () => {
    const wrapper = mount(
      {
        components: { Field, TextInput },
        template: '<Field label="Email" hint="For replies." error="Enter an email"><TextInput /></Field>'
      },
      { attachTo: document.body }
    )
    const input = wrapper.find('input')

    expect(wrapper.text()).not.toContain('For replies.')
    expect(wrapper.find('[role="alert"]').text()).toBe('Enter an email')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.classes()).toContain('border-sui-danger-mid')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('counts the text and turns invalid over the limit', async () => {
    const wrapper = mount(
      {
        components: { Field, Textarea },
        data: () => ({ bio: 'Hello' }),
        template: '<Field label="Bio" optional :max-length="8"><Textarea v-model="bio" /></Field>'
      },
      { attachTo: document.body }
    )
    const count = () => wrapper.find('[aria-live="polite"]')
    await nextTick()

    expect(wrapper.find('label').text()).toBe('Bio Optional')
    expect(count().text()).toBe('5/8')
    expect(count().attributes('aria-label')).toBe('5 of 8 characters')
    expect(wrapper.find('textarea').attributes('aria-describedby')).toBe(count().attributes('id'))

    await wrapper.find('textarea').setValue('Hello there')
    expect(count().text()).toBe('11/8')
    expect(count().classes()).toContain('text-sui-danger')
    expect(wrapper.find('textarea').attributes('aria-invalid')).toBe('true')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('takes its id, and gives other controls slot props', () => {
    const wrapper = mount({
      components: { Field },
      template:
        '<Field id="terms" label="Terms" hint="Later." v-slot="{ id, describedBy, invalid }"><input :id="id" type="checkbox" :aria-describedby="describedBy" :data-invalid="invalid" /></Field>'
    })

    expect(wrapper.find('input').attributes('id')).toBe('terms')
    expect(wrapper.find('input').attributes('aria-describedby')).toBe('terms-message')
    expect(wrapper.find('input').attributes('data-invalid')).toBe('false')
  })
})
