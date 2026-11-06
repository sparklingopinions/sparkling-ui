import { useConfirm } from '../../composables/useConfirm'
import type { IconColor } from '../Icon/colors'

export interface DropdownMenuAction {
  type: 'action'
  label: string
  action?: string
  icon?: string
  /** The icon's colour, e.g. a status's; muted by default. */
  iconColor?: IconColor
  variant?: 'danger'
  shortcut?: string
  /** Asks first, with this wording; `confirmed: true` asks with the generic wording. */
  confirm?: { message: string; title?: string; acceptLabel?: string }
  confirmed?: boolean
  /** Dimmed and inert, but still reached with the arrow keys and announced as unavailable. */
  disabled?: boolean
  /** Why it's disabled, shown under its label. */
  disabledReason?: string
  [key: string]: unknown
}

export type DropdownMenuEntry = DropdownMenuAction | { type: 'separator' }

/** The confirm step's wording, shared by DropdownMenu and ContextMenu. */
export interface MenuConfirmLabels {
  /** Passed back with every clicked item, e.g. the record the menu acts on. */
  id?: string
  confirmTitle?: string
  confirmMessage?: string
  confirmLabel?: string
  deleteLabel?: string
  cancelLabel?: string
}

export const menuConfirmDefaults = {
  id: undefined,
  confirmTitle: 'Are you sure?',
  confirmMessage: "This can't be undone.",
  confirmLabel: 'Confirm',
  deleteLabel: 'Delete',
  cancelLabel: 'Cancel'
}

export const menuContentClass =
  'z-[1100] rounded-xl border border-sui-edge bg-sui-raised p-1 shadow-lg outline-hidden data-[state=open]:animate-sui-menu-in'
export const menuItemClass =
  'relative rounded-lg text-sm text-sui-ink transition-colors duration-150 outline-hidden hover:bg-sui-fill-hover focus-visible:sui-ring-inset data-highlighted:bg-sui-fill-hover'
export const menuSeparatorClass = 'my-1 border-t border-sui-line-subtle'

/**
 * Asks what a menu item asks before it runs, in the same words and with the same buttons, and resolves whether to go
 * ahead: false for a disabled item or a declined ask, true straight away for an item that doesn't ask. For running an
 * item from its key (the `shortcut` the menu shows) exactly as a click would.
 */
export function useMenuConfirm(labels: Omit<MenuConfirmLabels, 'id'> = {}) {
  const confirm = useConfirm()

  return async function ask(item: DropdownMenuAction): Promise<boolean> {
    if (item.disabled) return false
    if (!item.confirm && !item.confirmed) return true
    const words = { ...menuConfirmDefaults, ...labels }
    const destructive = item.variant === 'danger' || item.action === 'delete'
    return confirm({
      title: item.confirm?.title ?? words.confirmTitle,
      message: item.confirm?.message ?? words.confirmMessage,
      cancelLabel: words.cancelLabel,
      confirmLabel: item.confirm?.acceptLabel ?? (item.action === 'delete' ? words.deleteLabel : words.confirmLabel),
      confirmVariant: destructive ? 'danger' : 'primary'
    })
  }
}

/** Runs an item: asks first when it says so, then emits it with the menu's `id`. */
export function useMenuSelect(
  props: Required<Omit<MenuConfirmLabels, 'id'>> & { id?: string },
  emit: (item: DropdownMenuAction & { id?: string }) => void
) {
  const ask = useMenuConfirm(props)

  return async function select(item: DropdownMenuAction, event?: Event) {
    // A disabled item keeps the menu open.
    if (item.disabled) return event?.preventDefault()
    if (await ask(item)) emit({ id: props.id, ...item })
  }
}
