import { shallowRef } from 'vue'

import type { ButtonVariant } from '../components/Button/Button.vue'

export interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  /** `danger` for a destructive action; `primary` by default. */
  confirmVariant?: ButtonVariant
  cancelVariant?: ButtonVariant
}

export interface ConfirmRequest extends ConfirmOptions {
  resolve: (confirmed: boolean) => void
}

// One app-wide confirm dialog, mounted once as <ConfirmDialog />, shows whatever useConfirm asked last.
export const confirmRequest = shallowRef<ConfirmRequest | null>(null)

/** Asks for confirmation; resolves true when confirmed, false when cancelled or dismissed. */
export function useConfirm() {
  return (options: ConfirmOptions) =>
    new Promise<boolean>((resolve) => {
      confirmRequest.value?.resolve(false)
      confirmRequest.value = { ...options, resolve }
    })
}
