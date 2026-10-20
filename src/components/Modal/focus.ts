/** Focus goes to an [autofocus] field (footer first, then header, then body), as PrimeVue's did; or else the dialog. */
export function focusFirst(event: Event) {
  event.preventDefault()
  const dialog = event.target as HTMLElement
  const target = ['[data-modal-footer]', '[data-modal-header]', '[data-modal-body]']
    .map((part) => dialog.querySelector<HTMLElement>(`${part} [autofocus]`))
    .find(Boolean)
  ;(target ?? dialog).focus()
}

const isApple = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

/** The platform's save shortcut, for a Modal's `hint`: "⌘ Enter to save" on Apple devices, "Ctrl Enter to save"
 *  elsewhere. `{key}` in the template is replaced. */
export const saveHint = (template = '{key} Enter to save') => template.replace('{key}', isApple() ? '⌘' : 'Ctrl')
