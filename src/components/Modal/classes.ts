// Shared by Modal and LedgerModal, so both dialogs open over the same backdrop with the same motion.
export const overlayClass =
  'fixed inset-0 z-[1100] flex items-center justify-center bg-sui-scrim/40 backdrop-blur-[4px] data-[state=closed]:animate-sui-scrim-out data-[state=open]:animate-sui-scrim-in'

export const panelClass =
  'flex max-h-[90vh] w-full flex-col bg-sui-surface shadow-xl outline-hidden data-[state=closed]:animate-sui-dialog-out data-[state=open]:animate-sui-dialog-in'

export const bodyClass = 'overflow-y-auto bg-sui-surface p-5 text-sm text-sui-ink-emphasis'

export const footerClass =
  'flex shrink-0 items-center justify-end border-t border-sui-line-subtle bg-sui-canvas text-right text-sui-ink'

/** Focus goes to an [autofocus] field (footer first, then header, then body), as PrimeVue's did; or else the dialog. */
export function focusFirst(event: Event) {
  event.preventDefault()
  const dialog = event.target as HTMLElement
  const target = ['[data-modal-footer]', '[data-modal-header]', '[data-modal-body]']
    .map((part) => dialog.querySelector<HTMLElement>(`${part} [autofocus]`))
    .find(Boolean)
  ;(target ?? dialog).focus()
}
