import { mount } from '@vue/test-utils'

import { SegmentedControl } from '../../index'
import { expectAccessible } from '../support/axe'

const options = [
  { value: 'note', label: 'Note' },
  { value: 'call', label: 'Call', icon: 'M5 12h14' },
  { value: 'meeting', label: 'Meeting' }
]

describe('SegmentedControl', () => {
  it('is a radio group with the chosen option checked', async () => {
    const wrapper = mount(SegmentedControl, {
      props: { options, modelValue: 'call', 'aria-label': 'Activity type' },
      attachTo: document.body
    })
    const radios = wrapper.findAll('[role="radio"]')

    expect(wrapper.attributes('role')).toBe('radiogroup')
    expect(radios.map((r) => r.attributes('aria-checked'))).toEqual(['false', 'true', 'false'])
    expect(radios[1]!.classes()).toContain('bg-sui-surface')
    expect(radios[1]!.find('svg path').attributes('d')).toBe('M5 12h14')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('picks an option on click', async () => {
    const wrapper = mount(SegmentedControl, { props: { options, modelValue: 'note' } })
    await wrapper.findAll('[role="radio"]')[2]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['meeting'])
  })
})
