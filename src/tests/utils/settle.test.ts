import { describe, expect, it } from 'vitest'

import { errorMessage, settleEach } from '../../utils/settle'

describe('settleEach', () => {
  it('sorts each record into done or refused, with the server’s reason', async () => {
    const refusedBy = (message: string) =>
      Object.assign(new Error('Request failed with status code 422'), {
        response: { data: { message } }
      })
    const { done, refused } = await settleEach([1, 2, 3], async (n) => {
      if (n === 2) throw refusedBy('Bounced loops can’t be snoozed.')
      return n * 10
    })
    expect(done).toEqual([
      { item: 1, result: 10 },
      { item: 3, result: 30 }
    ])
    expect(refused).toEqual([{ item: 2, message: 'Bounced loops can’t be snoozed.' }])
  })
})

describe('errorMessage', () => {
  it('prefers the server’s message, then a plain error’s, then the fallback', () => {
    expect(errorMessage({ response: { data: { message: 'Nope.' } } })).toBe('Nope.')
    expect(errorMessage(new Error('Offline'))).toBe('Offline')
    expect(errorMessage(new Error('Request failed with status code 500'), 'Try again.')).toBe('Try again.')
    expect(errorMessage(undefined)).toBe('This couldn’t be changed.')
  })
})
