import { shallowReactive } from 'vue'

import { errorMessage } from '../utils/settle'

export type ToastSeverity = 'info' | 'success' | 'warning' | 'error'

/** A button on the toast: pressing it runs `onClick`, then closes the toast. */
export interface ToastAction {
  label: string
  onClick: () => void
}

/** Why a toast left: one of its actions, its close button (or Escape), or its timer running out. */
export type ToastDismissReason = 'action' | 'close' | 'timeout'

export interface ToastOptions {
  /** A second line under the message. */
  detail?: string
  /** How long it stays, in ms; 0 keeps it until closed. 3000 by default, 6000 with an action. */
  life?: number
  closable?: boolean
  action?: ToastAction
  /** One or two; any more are ignored. */
  actions?: ToastAction[]
  onDismiss?: (reason: ToastDismissReason) => void
}

export interface ToastItem extends Omit<ToastOptions, 'action'> {
  id: number
  severity: ToastSeverity
  summary: string
  actions: ToastAction[]
  open: boolean
}

/** A toast's actions, from `action` or `actions`, at most two. */
export function toastActions(options: Pick<ToastOptions, 'action' | 'actions'>): ToastAction[] {
  return (options.actions ?? (options.action ? [options.action] : [])).slice(0, 2)
}

// The messages one <Toaster /> near the app root shows.
export const toasts = shallowReactive<ToastItem[]>([])

let nextId = 0

function add(severity: ToastSeverity, summary: string, options: ToastOptions = {}) {
  const { action: _, ...rest } = options
  const actions = toastActions(options)
  toasts.push({
    ...rest,
    life: options.life ?? (actions.length ? 6000 : 3000),
    actions,
    id: nextId++,
    severity,
    summary,
    open: true
  })
}

/** Closes a toast, then removes it once its closing animation has had time to play. */
export function removeToast(id: number, reason: ToastDismissReason = 'close') {
  const index = toasts.findIndex((item) => item.id === id)
  if (index < 0 || !toasts[index]!.open) return
  const item = toasts[index]!
  toasts[index] = { ...item, open: false }
  item.onDismiss?.(reason)
  setTimeout(() => {
    const at = toasts.findIndex((item) => item.id === id)
    if (at >= 0) toasts.splice(at, 1)
  }, 500)
}

export interface UndoToastOptions extends Omit<ToastOptions, 'action' | 'actions' | 'onDismiss'> {
  undoLabel?: string
  /** Shown once the undo worked. */
  undoneLabel?: string
  /** Shown when the undo failed and the server gave no reason. */
  failedLabel?: string
}

/** A one-tap change's receipt with Undo, which runs only when pressed; a refused undo says why. */
function undo(summary: string, run?: (() => unknown) | null, options: UndoToastOptions = {}) {
  const { undoLabel = 'Undo', undoneLabel = 'Undone', failedLabel = 'This can no longer be undone.', ...rest } = options
  if (!run) return add('success', summary, rest)
  return add('success', summary, {
    ...rest,
    action: { label: undoLabel, onClick: () => {} },
    onDismiss: async (reason) => {
      if (reason !== 'action') return
      try {
        await run()
        add('info', undoneLabel)
      } catch (error) {
        add('error', errorMessage(error, failedLabel))
      }
    }
  })
}

/** Shows a message in the app's <Toaster />: `toast.info('Saved')`; `toast.undo('Archived 3 loops', restore)`. */
export const toast = {
  undo,
  info: (summary: string, options?: ToastOptions) => add('info', summary, options),
  success: (summary: string, options?: ToastOptions) => add('success', summary, options),
  warning: (summary: string, options?: ToastOptions) => add('warning', summary, options),
  error: (summary: string, options?: ToastOptions) => add('error', summary, options)
}
