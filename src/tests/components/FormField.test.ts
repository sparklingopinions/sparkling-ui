import { nextTick } from 'vue'

import { mount } from '@vue/test-utils'

import { FormField, Input, Textarea } from '../../index'
import { expectAccessible } from '../support/axe'

describe('FormField', () => {
  it('labels its control and describes it with the hint', async () => {
    const wrapper = mount(
      {
        components: { FormField, Input },
        template: '<FormField label="Email" hint="For replies." required><Input /></FormField>'
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
        components: { FormField, Input },
        template: '<FormField label="Email" hint="For replies." error="Enter an email"><Input /></FormField>'
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
        components: { FormField, Textarea },
        data: () => ({ bio: 'Hello' }),
        template: '<FormField label="Bio" optional :max-length="8"><Textarea v-model="bio" /></FormField>'
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

  it('counts against a soft limit: past it the count warns, the control stays valid', async () => {
    const wrapper = mount(
      {
        components: { FormField, Input },
        data: () => ({ title: 'Spring launch' }),
        template: '<FormField label="Title" :soft-limit="20"><Input v-model="title" /></FormField>'
      },
      { attachTo: document.body }
    )
    const count = () => wrapper.find('[aria-live="polite"]')
    await nextTick()

    expect(count().text()).toBe('13/20')
    expect(count().attributes('aria-label')).toBe('13 of 20 recommended characters')
    expect(count().classes()).toContain('text-sui-ink-muted')

    await wrapper.find('input').setValue('Spring launch, part two')
    expect(count().text()).toBe('23/20')
    expect(count().attributes('aria-label')).toBe('23 of 20 recommended characters. Longer than recommended')
    expect(count().classes()).toEqual(expect.arrayContaining(['text-sui-warning', 'font-medium']))
    expect(count().find('svg').attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('input').attributes('aria-invalid')).toBeUndefined()
    expect(wrapper.find('input').classes()).not.toContain('border-sui-danger-mid')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('hands the counter to a hard maxLength once it is passed', async () => {
    const wrapper = mount(
      {
        components: { FormField, Input },
        data: () => ({ title: 'Spring launch, part two' }),
        template: '<FormField label="Title" :soft-limit="20" :max-length="25"><Input v-model="title" /></FormField>'
      },
      { attachTo: document.body }
    )
    const count = () => wrapper.find('[aria-live="polite"]')
    await nextTick()

    expect(count().text()).toBe('23/20')
    await wrapper.find('input').setValue('Spring launch, part two of three')
    expect(count().text()).toBe('32/25')
    expect(count().attributes('aria-label')).toBe('32 of 25 characters')
    expect(count().classes()).toContain('text-sui-danger')
    expect(count().find('svg').exists()).toBe(false)
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
    wrapper.unmount()
  })

  it('takes its id, and gives other controls slot props', () => {
    const wrapper = mount({
      components: { FormField },
      template:
        '<FormField id="terms" label="Terms" hint="Later." v-slot="{ id, describedBy, invalid }"><input :id="id" type="checkbox" :aria-describedby="describedBy" :data-invalid="invalid" /></FormField>'
    })

    expect(wrapper.find('input').attributes('id')).toBe('terms')
    expect(wrapper.find('input').attributes('aria-describedby')).toBe('terms-message')
    expect(wrapper.find('input').attributes('data-invalid')).toBe('false')
  })
})
