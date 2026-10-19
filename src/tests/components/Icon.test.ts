import { defineComponent, h, nextTick } from 'vue'

import { mount } from '@vue/test-utils'

import { Icon, setIconResolver } from '../../index'
import { expectAccessible } from '../support/axe'

const svg = (id: string) => defineComponent(() => () => h('svg', { 'data-icon': id, viewBox: '0 0 16 16' }))
const icons: Record<string, ReturnType<typeof svg>> = { plus: svg('plus'), close: svg('close') }

describe('Icon', () => {
  beforeEach(() => setIconResolver((name) => icons[name]))

  it('renders the resolved icon, hidden from assistive tech', async () => {
    const wrapper = mount(Icon, { props: { name: 'plus' }, attachTo: document.body })

    expect(wrapper.attributes()).toMatchObject({ 'data-icon': 'plus', 'aria-hidden': 'true' })
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  it('names a meaningful icon', async () => {
    const wrapper = mount(Icon, { props: { name: 'close', label: 'Closed' }, attachTo: document.body })

    expect(wrapper.attributes()).toMatchObject({ role: 'img', 'aria-label': 'Closed' })
    expect(wrapper.attributes('aria-hidden')).toBeUndefined()
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('colours stroke and fill from a role', () => {
    const wrapper = mount(Icon, { props: { name: 'plus', color: 'ink-muted' } })

    expect(wrapper.classes()).toEqual(['stroke-sui-ink-muted', 'fill-sui-ink-muted'])
  })

  it('follows a change of name', async () => {
    const wrapper = mount(Icon, { props: { name: 'plus' } })
    await wrapper.setProps({ name: 'close' })
    await nextTick()

    expect(wrapper.attributes('data-icon')).toBe('close')
  })

  it('renders nothing and warns for an unknown name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(Icon, { props: { name: 'nope' } })

    expect(wrapper.html()).toBe('<!--v-if-->')
    expect(warn).toHaveBeenCalledWith('[sparkling-ui] No icon named "nope".')
    warn.mockRestore()
  })
})
