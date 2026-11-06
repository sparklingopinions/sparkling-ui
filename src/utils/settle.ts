/** A record an action couldn't change, and why, in the words the server gave. */
export interface Refusal<T> {
  item: T
  message: string
}

/** The server's reason, from an error shaped like a failed fetch or axios request; else the fallback. */
export function errorMessage(error: unknown, fallback = 'This couldn’t be changed.'): string {
  const data = (error as { response?: { data?: { message?: unknown } } })?.response?.data
  if (typeof data?.message === 'string' && data.message.trim()) return data.message
  if (error instanceof Error && error.message && !/^Request failed/.test(error.message)) return error.message
  return fallback
}

/**
 * Runs an action on each record, all at once, and sorts out what happened: the ones done, with their results, and the
 * ones refused, with their reasons. For a bulk action without a bulk endpoint; nothing stops on the first refusal.
 */
export async function settleEach<T, R>(
  items: T[],
  run: (item: T) => Promise<R>,
  messageOf: (error: unknown) => string = (error) => errorMessage(error)
): Promise<{ done: { item: T; result: R }[]; refused: Refusal<T>[] }> {
  const outcomes = await Promise.allSettled(items.map((item) => run(item)))
  const done: { item: T; result: R }[] = []
  const refused: Refusal<T>[] = []
  outcomes.forEach((outcome, i) => {
    if (outcome.status === 'fulfilled') done.push({ item: items[i]!, result: outcome.value })
    else refused.push({ item: items[i]!, message: messageOf(outcome.reason) })
  })
  return { done, refused }
}
