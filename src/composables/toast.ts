import { shallowReactive } from 'vue'

export type ToastSeverity = 'info' | 'success' | 'error'

export interface ToastOptions {
  /** A second line under the message. */
  detail?: string
  /** How long it stays, in ms; 0 keeps it until closed. */
  life?: number
  closable?: boolean
}

export interface ToastItem extends ToastOptions {
  id: number
  severity: ToastSeverity
  summary: string
  open: boolean
}

// The messages one <Toaster /> near the app root shows.
export const toasts = shallowReactive<ToastItem[]>([])

let nextId = 0

function add(severity: ToastSeverity, summary: string, options: ToastOptions = {}) {
  toasts.push({ life: 3000, ...options, id: nextId++, severity, summary, open: true })
}

/** Removes a toast once its closing animation has had time to play. */
export function removeToast(id: number) {
  const index = toasts.findIndex((item) => item.id === id)
  if (index < 0) return
  toasts[index] = { ...toasts[index]!, open: false }
  setTimeout(() => {
    const at = toasts.findIndex((item) => item.id === id)
    if (at >= 0) toasts.splice(at, 1)
  }, 500)
}

/** Shows a message in the app's <Toaster />: `toast.info('Saved')`. */
export const toast = {
  info: (summary: string, options?: ToastOptions) => add('info', summary, options),
  success: (summary: string, options?: ToastOptions) => add('success', summary, options),
  error: (summary: string, options?: ToastOptions) => add('error', summary, options)
}
