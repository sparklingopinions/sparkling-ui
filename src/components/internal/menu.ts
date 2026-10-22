import { useConfirm } from '../../composables/useConfirm'

export interface DropdownMenuAction {
  type: 'action'
  label: string
  action?: string
  icon?: string
  variant?: 'danger'
  shortcut?: string
  /** Asks first, with this wording; `confirmed: true` asks with the generic wording. */
  confirm?: { message: string; title?: string; acceptLabel?: string }
  confirmed?: boolean
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
  'z-[1100] rounded-xl border border-sui-line-subtle bg-sui-surface p-1 shadow-lg outline-hidden data-[state=open]:animate-sui-menu-in'
export const menuItemClass =
  'relative rounded-lg text-sm text-sui-ink transition-colors duration-150 outline-hidden hover:bg-sui-sunken focus-visible:sui-ring-inset data-highlighted:bg-sui-sunken'
export const menuSeparatorClass = 'my-1 border-t border-sui-line-subtle'

/** Runs an item: asks first when it says so, then emits it with the menu's `id`. */
export function useMenuSelect(
  props: Required<Omit<MenuConfirmLabels, 'id'>> & { id?: string },
  emit: (item: DropdownMenuAction & { id?: string }) => void
) {
  const confirm = useConfirm()

  return async function select(item: DropdownMenuAction) {
    if (item.confirm || item.confirmed) {
      const destructive = item.variant === 'danger' || item.action === 'delete'
      const confirmed = await confirm({
        title: item.confirm?.title ?? props.confirmTitle,
        message: item.confirm?.message ?? props.confirmMessage,
        cancelLabel: props.cancelLabel,
        confirmLabel: item.confirm?.acceptLabel ?? (item.action === 'delete' ? props.deleteLabel : props.confirmLabel),
        confirmVariant: destructive ? 'danger' : 'primary'
      })
      if (!confirmed) return
    }
    emit({ id: props.id, ...item })
  }
}
