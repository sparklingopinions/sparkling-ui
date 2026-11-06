import { afterEach, describe, expect, it, vi } from 'vitest'

import { removeToast, toast, toasts } from '../../composables/toast'

afterEach(() => toasts.splice(0))

describe('toast.undo', () => {
  it('offers Undo, which runs only when pressed', async () => {
    const run = vi.fn()
    toast.undo('Archived 3 loops', run)
    const receipt = toasts.at(-1)!
    expect(receipt.actions.map((a) => a.label)).toEqual(['Undo'])

    removeToast(receipt.id, 'timeout')
    expect(run).not.toHaveBeenCalled()

    toast.undo('Archived 3 loops', run)
    removeToast(toasts.at(-1)!.id, 'action')
    await vi.waitFor(() => expect(run).toHaveBeenCalledOnce())
    await vi.waitFor(() => expect(toasts.at(-1)!.summary).toBe('Undone'))
  })

  it('says why when the undo is refused', async () => {
    toast.undo('Archived 3 loops', () => Promise.reject({ response: { data: { message: 'Already gone.' } } }))
    removeToast(toasts.at(-1)!.id, 'action')
    await vi.waitFor(() => expect(toasts.at(-1)!.summary).toBe('Already gone.'))
  })

  it('without an undo, is a plain receipt', () => {
    toast.undo('Saved')
    expect(toasts.at(-1)!.actions).toEqual([])
  })
})
