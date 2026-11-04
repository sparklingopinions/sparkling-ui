import { mount } from '@vue/test-utils'

import { Textarea } from '../../index'
import { expectAccessible } from '../support/axe'

describe('Textarea', () => {
  it('is a soft-filled field by default', async () => {
    const wrapper = mount(Textarea, { attrs: { 'aria-label': 'Reply' }, attachTo: document.body })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['bg-sui-fill', 'border-sui-fill-line', 'rounded-lg']))
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('drops its box when bare', async () => {
    const wrapper = mount(Textarea, { props: { bare: true }, attrs: { 'aria-label': 'Note' }, attachTo: document.body })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['border-0', 'bg-transparent', 'p-0']))
    expect(wrapper.classes()).not.toContain('bg-sui-fill')
    expect(wrapper.classes()).not.toContain('rounded-lg')
    await wrapper.setValue('A thought')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['A thought'])
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })
})
