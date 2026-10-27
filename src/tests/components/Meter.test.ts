import { mount } from '@vue/test-utils'

import { Meter } from '../../index'
import { expectAccessible } from '../support/axe'

const widths = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('[role=meter] > div').map((segment) => (segment.element as HTMLElement).style.width)

describe('Meter', () => {
  it('is a named meter, with the used and reserved amounts as two segments', async () => {
    const wrapper = mount(Meter, {
      props: { label: 'Items this month', value: 170, reserved: 35, max: 250, valueText: '205 of 250, 45 left' },
      attachTo: document.body
    })

    expect(wrapper.attributes()).toMatchObject({
      role: 'meter',
      'aria-label': 'Items this month',
      'aria-valuemin': '0',
      'aria-valuemax': '250',
      'aria-valuenow': '205',
      'aria-valuetext': '205 of 250, 45 left'
    })
    expect(widths(wrapper)).toEqual(['68%', '14%'])
    const [used, reserved] = wrapper.findAll('[role=meter] > div')
    expect(used!.classes()).toContain('bg-sui-ink-muted')
    expect(reserved!.classes()).toEqual(expect.arrayContaining(['bg-sui-ink-muted', 'opacity-40']))
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('clamps to the limit, so a full meter is one full-width bar', () => {
    const wrapper = mount(Meter, { props: { label: 'People', value: 3, reserved: 2, max: 2 } })

    expect(widths(wrapper)).toEqual(['100%', '0%'])
    expect(wrapper.attributes('aria-valuenow')).toBe('2')
    expect(wrapper.attributes('aria-valuetext')).toBeUndefined()
  })

  it('fits the reserved amount into what is left', () => {
    const wrapper = mount(Meter, { props: { label: 'Items', value: 20, reserved: 10, max: 25 } })

    expect(widths(wrapper)).toEqual(['80%', '20%'])
    expect(wrapper.attributes('aria-valuenow')).toBe('25')
  })

  it('takes a warning or accent tone', () => {
    const warning = mount(Meter, { props: { label: 'Items', value: 1, max: 2, tone: 'warning' } })
    const accent = mount(Meter, { props: { label: 'Items', value: 1, max: 2, tone: 'accent' } })

    expect(warning.get('[role=meter] > div').classes()).toContain('bg-sui-warning')
    expect(accent.get('[role=meter] > div').classes()).toContain('bg-sui-accent')
  })
})
