import { h } from 'vue'

import { mount } from '@vue/test-utils'

import { Banner, EmptyState, setIconResolver } from '../../index'
import { expectAccessible } from '../support/axe'

beforeAll(() => setIconResolver((name) => () => h('svg', { 'data-icon': name })))

describe('Banner', () => {
  it('is a warning bar with a dot by default', async () => {
    const wrapper = mount(Banner, { slots: { default: 'Sync paused' }, attachTo: document.body })

    expect(wrapper.text()).toBe('Sync paused')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['bg-sui-warning-soft', 'border-b']))
    expect(wrapper.find('span.bg-sui-warning-mid').exists()).toBe(true)
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('shows an icon tile, and rounds into a notice when inset', () => {
    const wrapper = mount(Banner, {
      props: { tone: 'danger', icon: 'link', inset: true },
      slots: { default: 'Failed' }
    })

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['rounded-xl', 'border-sui-danger-line', 'bg-sui-danger-soft'])
    )
    expect(wrapper.find('[data-icon="link"]').classes()).toContain('stroke-sui-danger')
  })

  it('takes a leading slot and an action', () => {
    const wrapper = mount(Banner, {
      slots: { default: 'Text', leading: '<b class="lead">!</b>', action: '<button>Retry</button>' }
    })

    expect(wrapper.find('.lead').exists()).toBe(true)
    expect(wrapper.find('span.rounded-full').exists()).toBe(false)
    expect(wrapper.text()).toContain('Retry')
  })

  it('has a named dismiss button', async () => {
    const wrapper = mount(Banner, {
      props: { dismissible: true, dismissLabel: 'Hide' },
      slots: { default: 'Sync paused' },
      attachTo: document.body
    })
    const button = wrapper.get('button')

    expect(button.attributes()).toMatchObject({ type: 'button', 'aria-label': 'Hide' })
    await button.trigger('click')
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })
})

describe('EmptyState', () => {
  it('shows a decorative emoji, a title and a description', async () => {
    const wrapper = mount(EmptyState, {
      props: { emoji: '👤', title: 'No people yet', description: 'Add your first contact.' },
      attachTo: document.body
    })

    expect(wrapper.text()).toContain('No people yet')
    expect(wrapper.text()).toContain('Add your first contact.')
    expect(wrapper.find('[aria-hidden="true"]').text()).toBe('👤')
    expect(wrapper.find('button').exists()).toBe(false)
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('titles itself with an h2, or the heading level given', () => {
    expect(
      mount(EmptyState, { props: { title: 'No people yet' } })
        .find('h2')
        .text()
    ).toBe('No people yet')
    expect(
      mount(EmptyState, { props: { title: 'No people yet', headingLevel: 3 } })
        .find('h3')
        .exists()
    ).toBe(true)
  })

  it('renders a description as text, never as HTML', () => {
    const wrapper = mount(EmptyState, { props: { title: 'Empty', description: '<img src=x onerror=alert(1)>' } })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('<img src=x onerror=alert(1)>')
  })

  it('emits action from its primary button', async () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'No companies yet', actionLabel: 'New company' },
      attachTo: document.body
    })
    const button = wrapper.get('button')

    expect(button.text()).toBe('New company')
    expect(button.find('[data-icon="plus"]').exists()).toBe(true)
    await button.trigger('click')
    expect(wrapper.emitted('action')).toHaveLength(1)
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('takes rich content and its own actions in slots', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'No activities yet' },
      slots: { description: 'Line one<br>line two', action: '<a href="/new">Create one</a>' }
    })

    expect(wrapper.find('br').exists()).toBe(true)
    expect(wrapper.find('a').text()).toBe('Create one')
  })
})
