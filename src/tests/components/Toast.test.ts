import { nextTick } from 'vue'

import { flushPromises, mount } from '@vue/test-utils'

import { toasts } from '../../composables/toast'
import { Toaster, toast } from '../../index'
import { expectAccessible } from '../support/axe'

const messages = () => [...document.body.querySelectorAll('[data-sui-toasts] > div')]

describe('toast', () => {
  afterEach(() => {
    toasts.splice(0)
    vi.useRealTimers()
  })

  it('shows info, success and error messages in the Toaster', async () => {
    const wrapper = mount(Toaster, { attachTo: document.body })
    toast.info('Draft saved')
    toast.success('Reply sent')
    toast.error('Couldn’t send', { detail: 'The server didn’t answer' })
    await flushPromises()

    expect(messages().map((m) => m.textContent?.trim())).toEqual([
      'Draft saved',
      'Reply sent',
      'Couldn’t sendThe server didn’t answer'
    ])
    expect(messages()[2]!.firstElementChild!.className).toContain('bg-sui-danger-solid')
    expect(messages()[0]!.firstElementChild!.className).not.toContain('rounded-full')
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  it('closes from its button', async () => {
    const wrapper = mount(Toaster, { attachTo: document.body })
    toast.info('Draft saved', { life: 0 })
    await flushPromises()

    document.body.querySelector<HTMLButtonElement>('button[aria-label="Close"]')!.click()
    await flushPromises()
    expect(toasts[0]?.open).toBe(false)
    wrapper.unmount()
  })

  it('leaves after its life, 3s by default', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Toaster, { attachTo: document.body })
    toast.info('Draft saved')
    await flushPromises()

    vi.advanceTimersByTime(2900)
    expect(toasts[0]?.open).toBe(true)
    vi.advanceTimersByTime(200)
    await flushPromises()
    expect(toasts[0]?.open).toBe(false)
    vi.advanceTimersByTime(600)
    expect(toasts).toHaveLength(0)
    wrapper.unmount()
  })
})

describe('Toaster preview', () => {
  it('draws toasts in place, without a close button when not closable', async () => {
    const wrapper = mount(Toaster, {
      props: { preview: [{ summary: 'Imported', detail: '12 people added', closable: false }, { summary: 'Saved' }] },
      attachTo: document.body
    })

    expect(wrapper.text()).toBe('Imported12 people addedSaved')
    expect(wrapper.findAll('button')).toHaveLength(1)
    expect(toasts).toHaveLength(0)
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it("emits close with the toast's id, or its index without one", async () => {
    const wrapper = mount(Toaster, {
      props: { preview: [{ summary: 'Saved' }, { id: 'snoozed', summary: 'Snoozed' }] },
      attachTo: document.body
    })

    const [first, second] = wrapper.findAll('button')
    await first!.trigger('click')
    await second!.trigger('click')
    expect(wrapper.emitted('close')).toEqual([[0], ['snoozed']])
    wrapper.unmount()
  })

  it('animates a toast in when it joins the list and out when it leaves', async () => {
    const wrapper = mount(Toaster, {
      props: { preview: [{ id: 1, summary: 'Saved' }] },
      attachTo: document.body,
      global: { stubs: { 'transition-group': false } }
    })

    await wrapper.setProps({
      preview: [
        { id: 1, summary: 'Saved' },
        { id: 2, summary: 'Snoozed' }
      ]
    })
    expect(wrapper.findAll('.animate-sui-toast-in').map((m) => m.text())).toEqual(['Snoozed'])

    await wrapper.setProps({ preview: [{ id: 2, summary: 'Snoozed' }] })
    await nextTick()
    expect(wrapper.find('.animate-sui-toast-out').text()).toBe('Saved')
    wrapper.unmount()
  })
})
