import { h } from 'vue'

import { mount } from '@vue/test-utils'

import { Alert, EmptyState, setIconResolver } from '../../index'
import { expectAccessible } from '../support/axe'

beforeAll(() => setIconResolver((name) => () => h('svg', { 'data-icon': name })))

describe('Alert', () => {
  it('is a warning bar with a dot by default', async () => {
    const wrapper = mount(Alert, { slots: { default: 'Sync paused' }, attachTo: document.body })

    expect(wrapper.text()).toBe('Sync paused')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['bg-sui-warning-soft', 'border-b']))
    expect(wrapper.find('span.bg-sui-warning-mid').exists()).toBe(true)
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('shows an icon tile, and rounds into a notice when inset', () => {
    const wrapper = mount(Alert, {
      props: { tone: 'danger', icon: 'link', inset: true },
      slots: { default: 'Failed' }
    })

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['rounded-xl', 'border-sui-danger-line', 'bg-sui-danger-soft'])
    )
    expect(wrapper.find('[data-icon="link"]').classes()).toContain('stroke-sui-danger')
  })

  it('takes a leading slot and an action', () => {
    const wrapper = mount(Alert, {
      slots: { default: 'Text', leading: '<b class="lead">!</b>', action: '<button>Retry</button>' }
    })

    expect(wrapper.find('.lead').exists()).toBe(true)
    expect(wrapper.find('span.rounded-full').exists()).toBe(false)
    expect(wrapper.text()).toContain('Retry')
  })

  it('has a named dismiss button', async () => {
    const wrapper = mount(Alert, {
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
  it('shows a decorative icon tile, a title and a description', async () => {
    const wrapper = mount(EmptyState, {
      props: { icon: 'users', title: 'No people yet', description: 'Add your first contact.' },
      attachTo: document.body
    })

    expect(wrapper.text()).toContain('No people yet')
    expect(wrapper.text()).toContain('Add your first contact.')
    const tile = wrapper.find('div[aria-hidden="true"]')
    expect(tile.classes()).toContain('bg-sui-accent-wash')
    expect(tile.find('[data-icon="users"]').classes()).toContain('stroke-sui-accent')
    expect(wrapper.find('button').exists()).toBe(false)
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('draws sm as one muted line with a small icon and a small secondary action', async () => {
    const wrapper = mount(EmptyState, {
      props: {
        size: 'sm',
        icon: 'webhook',
        title: 'No webhooks yet',
        description: 'Not shown',
        actionLabel: 'Add webhook'
      },
      attachTo: document.body
    })

    expect(wrapper.find('h2').exists()).toBe(false)
    expect(wrapper.find('p').text()).toBe('No webhooks yet')
    expect(wrapper.find('p').classes()).toEqual(expect.arrayContaining(['text-13', 'text-sui-ink-muted']))
    expect(wrapper.text()).not.toContain('Not shown')
    expect(wrapper.find('svg').classes()).toEqual(expect.arrayContaining(['size-4', 'stroke-sui-ink-muted']))
    const button = wrapper.find('button')
    expect(button.text()).toBe('Add webhook')
    expect(button.classes()).toEqual(expect.arrayContaining(['h-7', 'bg-sui-surface']))
    await button.trigger('click')
    expect(wrapper.emitted('action')).toHaveLength(1)
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

  it('draws a neutral tile for no matches', () => {
    const wrapper = mount(EmptyState, { props: { icon: 'search', tone: 'neutral', title: 'No matches' } })

    expect(wrapper.find('div[aria-hidden="true"]').classes()).toContain('bg-sui-sunken')
    expect(wrapper.find('[data-icon="search"]').classes()).toContain('stroke-sui-ink-muted')
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
