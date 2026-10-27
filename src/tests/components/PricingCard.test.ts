import { mount } from '@vue/test-utils'

import { PricingCard } from '../../index'
import { expectAccessible } from '../support/axe'

const plan = { name: 'Pro, monthly', price: '€15', period: 'per month, plus VAT' }

describe('PricingCard', () => {
  it('is an article named by the plan, with a secondary button that emits select', async () => {
    const wrapper = mount(PricingCard, { props: plan, attachTo: document.body })
    const article = wrapper.get('article')
    const name = wrapper.get(`#${article.attributes('aria-labelledby')}`)
    const button = wrapper.get('button')

    expect(name.text()).toBe('Pro, monthly')
    expect(article.classes()).toContain('border-sui-line-subtle')
    expect(wrapper.text()).toContain('€15')
    expect(wrapper.text()).toContain('per month, plus VAT')
    expect(button.text()).toBe('Choose, Pro, monthly')
    expect(button.get('.sr-only').text()).toBe(', Pro, monthly')
    expect(button.classes()).toContain('bg-sui-surface')

    await button.trigger('click')
    expect(wrapper.emitted('select')).toHaveLength(1)
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('draws the highlighted plan with an accent border, a badge and a primary button', async () => {
    const wrapper = mount(PricingCard, {
      props: { ...plan, highlighted: true, badge: 'Two months free', description: 'Billed once a year.' },
      attachTo: document.body
    })

    expect(wrapper.get('article').classes()).toContain('border-sui-accent-line')
    expect(wrapper.get('button').classes()).toContain('bg-sui-accent-solid')
    expect(wrapper.text()).toContain('Two months free')
    expect(wrapper.text()).toContain('Billed once a year.')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('disables the button while loading, with a hidden spinner', async () => {
    const wrapper = mount(PricingCard, { props: { ...plan, loading: true }, attachTo: document.body })
    const button = wrapper.get('button')

    expect(button.attributes()).toMatchObject({ disabled: '', 'aria-busy': 'true' })
    expect(button.get('svg').attributes('aria-hidden')).toBe('true')
    await button.trigger('click')
    expect(wrapper.emitted('select')).toBeUndefined()
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('can be disabled', () => {
    const wrapper = mount(PricingCard, { props: { ...plan, disabled: true } })

    expect(wrapper.get('button').attributes('disabled')).toBe('')
    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('takes extra lines and a custom action through slots', async () => {
    const wrapper = mount(PricingCard, {
      props: plan,
      slots: { default: '<ul><li>Three projects</li></ul>', action: '<a href="/plans">See plans</a>' },
      attachTo: document.body
    })

    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.get('a').text()).toBe('See plans')
    expect(wrapper.get('li').text()).toBe('Three projects')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })
})
