import { nextTick } from 'vue'

import { ToastRoot } from 'reka-ui'

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

  it('shows a warning with a warning dot, announced politely like info', async () => {
    const wrapper = mount(Toaster, { attachTo: document.body })
    toast.warning('Sync is slow')
    await flushPromises()

    expect(messages()[0]!.firstElementChild!.className).toContain('bg-sui-warning-mid')
    expect(toasts[0]?.severity).toBe('warning')
    // Reka announces background toasts politely and foreground ones assertively.
    expect(wrapper.findComponent(ToastRoot).props('type')).toBe('background')
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  it('sits at the bottom centre by default, clear of the safe area and any insets', async () => {
    const wrapper = mount(Toaster, { attachTo: document.body })
    const region = document.body.querySelector<HTMLElement>('[data-sui-toasts]')!

    expect(region.dataset.suiPosition).toBe('bottom-center')
    expect(region.className).toContain('flex-col')
    expect(region.style.bottom).toBe(
      'calc(var(--sui-toaster-margin) + var(--sui-toaster-inset-bottom) + env(safe-area-inset-bottom))'
    )
    expect(region.style.left).toBe('calc(var(--sui-toaster-margin) + var(--sui-toaster-inset-left))')
    expect(region.style.right).toBe('calc(var(--sui-toaster-margin) + var(--sui-toaster-inset-right))')
    wrapper.unmount()
  })

  it.each([
    ['bottom-left', { left: 'calc(var(--sui-toaster-margin) + var(--sui-toaster-inset-left))', right: 'auto' }],
    ['bottom-right', { left: 'auto', right: 'calc(var(--sui-toaster-margin) + var(--sui-toaster-inset-right))' }]
  ])('sits at the %s', async (position, sides) => {
    const wrapper = mount(Toaster, { props: { position: position as 'bottom-left' }, attachTo: document.body })
    const region = document.body.querySelector<HTMLElement>('[data-sui-toasts]')!

    expect(region.style.left).toBe(sides.left)
    expect(region.style.right).toBe(sides.right)
    wrapper.unmount()
  })

  it('stacks from the top edge, newest nearest it, and slides in from above', async () => {
    const wrapper = mount(Toaster, { props: { position: 'top-center' }, attachTo: document.body })
    toast.info('Draft saved')
    await flushPromises()
    const region = document.body.querySelector<HTMLElement>('[data-sui-toasts]')!

    expect(region.style.top).toBe(
      'calc(var(--sui-toaster-margin) + var(--sui-toaster-inset-top) + env(safe-area-inset-top))'
    )
    expect(region.style.bottom).toBe('')
    expect(region.className).toContain('flex-col-reverse')
    expect(messages()[0]!.className).toContain('data-[state=open]:animate-sui-toast-in-top')
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

describe('toast actions', () => {
  afterEach(() => {
    toasts.splice(0)
    vi.useRealTimers()
  })

  const buttons = () => [...document.body.querySelectorAll<HTMLButtonElement>('[data-sui-toasts] button')]

  it('draws the action after the message, a hairline, then the close, and stays 6s', async () => {
    const wrapper = mount(Toaster, { attachTo: document.body })
    toast.success('Post approved', { action: { label: 'Undo', onClick: () => {} } })
    await flushPromises()

    expect(buttons().map((b) => b.textContent?.trim() || b.getAttribute('aria-label'))).toEqual(['Undo', 'Close'])
    expect(buttons()[0]!.className).toContain('text-sui-on-inverse')
    expect(document.body.querySelector('[data-sui-toasts] [aria-hidden="true"].w-px')).not.toBeNull()
    expect(document.body.querySelector<HTMLElement>('[data-sui-toast-timer]')!.style.animationDuration).toBe('6000ms')
    expect(toasts[0]?.life).toBe(6000)
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  it('runs the action, closes and reports why; extra actions are ignored', async () => {
    const wrapper = mount(Toaster, { attachTo: document.body })
    const undo = vi.fn()
    const onDismiss = vi.fn()
    toast.info('Archived', {
      actions: [
        { label: 'Undo', onClick: undo },
        { label: 'View', onClick: () => {} },
        { label: 'Extra', onClick: () => {} }
      ],
      onDismiss
    })
    await flushPromises()

    expect(buttons().map((b) => b.textContent?.trim())).toEqual(['Undo', 'View', ''])
    buttons()[0]!.click()
    await flushPromises()
    expect(undo).toHaveBeenCalledOnce()
    expect(onDismiss).toHaveBeenCalledWith('action')
    expect(toasts[0]?.open).toBe(false)
    wrapper.unmount()
  })

  it('times out without running the action', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Toaster, { attachTo: document.body })
    const undo = vi.fn()
    const onDismiss = vi.fn()
    toast.success('Post approved', { action: { label: 'Undo', onClick: undo }, onDismiss })
    await flushPromises()

    vi.advanceTimersByTime(5900)
    expect(toasts[0]?.open).toBe(true)
    vi.advanceTimersByTime(200)
    await flushPromises()
    expect(toasts[0]?.open).toBe(false)
    expect(undo).not.toHaveBeenCalled()
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith('timeout')
    wrapper.unmount()
  })

  it('reports the close button as close', async () => {
    const wrapper = mount(Toaster, { attachTo: document.body })
    const onDismiss = vi.fn()
    toast.info('Archived', { action: { label: 'Undo', onClick: () => {} }, onDismiss })
    await flushPromises()

    buttons()[1]!.click()
    await flushPromises()
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith('close')
    wrapper.unmount()
  })

  it('holds the countdown bar while the timer is paused', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Toaster, { attachTo: document.body })
    toast.info('Archived', { action: { label: 'Undo', onClick: () => {} } })
    await flushPromises()
    const viewport = document.body.querySelector('[data-sui-toasts]')!
    const bar = () => document.body.querySelector('[data-sui-toast-timer]')!

    viewport.dispatchEvent(new CustomEvent('toast.viewportPause'))
    await flushPromises()
    expect(bar().className).toContain('[animation-play-state:paused]')
    vi.advanceTimersByTime(10000)
    expect(toasts[0]?.open).toBe(true)

    viewport.dispatchEvent(new CustomEvent('toast.viewportResume'))
    await flushPromises()
    expect(bar().className).not.toMatch(/(^| )\[animation-play-state:paused\]/)
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
    expect(wrapper.emitted('close')).toEqual([
      [0, 'close'],
      ['snoozed', 'close']
    ])
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

  it('runs a preview action and emits close with the reason, and timeout when the bar runs out', async () => {
    const undo = vi.fn()
    const wrapper = mount(Toaster, {
      props: {
        preview: [{ id: 'approved', summary: 'Post approved', action: { label: 'Undo', onClick: undo }, life: 6000 }]
      },
      attachTo: document.body
    })

    await wrapper.find('button').trigger('click')
    await wrapper.find('[data-sui-toast-timer]').trigger('animationend')
    expect(undo).toHaveBeenCalledOnce()
    expect(wrapper.emitted('close')).toEqual([
      ['approved', 'action'],
      ['approved', 'timeout']
    ])
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })
})
