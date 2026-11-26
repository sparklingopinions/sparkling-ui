import { mount } from '@vue/test-utils'

import { CopyBlock } from '../../index'
import { expectAccessible } from '../support/axe'

describe('CopyBlock', () => {
  it('shows the text with a Copy to clipboard button', async () => {
    const wrapper = mount(CopyBlock, { props: { text: 'Hello there' }, attachTo: document.body })

    expect(wrapper.text()).toContain('Hello there')
    expect(wrapper.get('button').attributes('aria-label')).toBe('Copy to clipboard')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('copies the text, says Copied and emits copy', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    const wrapper = mount(CopyBlock, { props: { text: 'Hello there' }, attachTo: document.body })

    await wrapper.get('button').trigger('click')
    await new Promise((resolve) => setTimeout(resolve))

    expect(writeText).toHaveBeenCalledWith('Hello there')
    expect(wrapper.emitted('copy')).toEqual([['Hello there']])
    expect(wrapper.get('button').attributes('aria-label')).toBe('Copied')
    wrapper.unmount()
  })

  it('emits error when the clipboard refuses', async () => {
    const failure = new Error('denied')
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockRejectedValue(failure) } })
    const wrapper = mount(CopyBlock, { props: { text: 'Hello there' }, attachTo: document.body })

    await wrapper.get('button').trigger('click')
    await new Promise((resolve) => setTimeout(resolve))

    expect(wrapper.emitted('error')).toEqual([[failure]])
    expect(wrapper.get('button').attributes('aria-label')).toBe('Copy to clipboard')
    wrapper.unmount()
  })

  it('draws the default slot instead of the plain text, and takes its labels as props', async () => {
    const wrapper = mount(CopyBlock, {
      props: { text: 'a', copyLabel: 'Copier' },
      slots: { default: '<ul><li>One</li></ul>' },
      attachTo: document.body
    })

    expect(wrapper.find('li').text()).toBe('One')
    expect(wrapper.get('button').attributes('aria-label')).toBe('Copier')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })
})
