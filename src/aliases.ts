// Former names, kept so older code keeps working. Each is deprecated: use the new name.
import { type FunctionalComponent, h } from 'vue'

import ActionBar, { type ActionBarAction, type ActionBarProps } from './components/ActionBar/ActionBar.vue'
import Alert, { type AlertProps, type AlertTone } from './components/Alert/Alert.vue'
import AlertDialog, { type AlertDialogProps } from './components/AlertDialog/AlertDialog.vue'
import Badge, { type BadgeProps, type BadgeTone } from './components/Badge/Badge.vue'
import Calendar, { type CalendarProps } from './components/Calendar/Calendar.vue'
import DataList, { type DataListProps } from './components/DataList/DataList.vue'
import type { DataListGroup } from './components/DataList/types'
import Dialog, { type DialogProps } from './components/Dialog/Dialog.vue'
import DropdownMenu, {
  type DropdownMenuAction,
  type DropdownMenuEntry,
  type DropdownMenuProps
} from './components/DropdownMenu/DropdownMenu.vue'
import ErrorSummary, { type ErrorSummaryProps } from './components/ErrorSummary/ErrorSummary.vue'
import FilterMenu, { type FilterMenuProps } from './components/Filters/FilterMenu.vue'
import SortMenu, { type SortMenuProps } from './components/Filters/SortMenu.vue'
import FormField, { type FormFieldProps } from './components/FormField/FormField.vue'
import ImageUpload, { type ImageUploadProps } from './components/ImageUpload/ImageUpload.vue'
import Input, { type InputProps } from './components/Input/Input.vue'
import Editable, { type EditableProps } from './components/PropertyList/Editable.vue'
import PropertyList, { type PropertyListField } from './components/PropertyList/PropertyList.vue'
import Collapsible, { type CollapsibleProps } from './components/PropertyRow/Collapsible.vue'
import PropertyRow, { type PropertyRowProps } from './components/PropertyRow/PropertyRow.vue'
import Tag from './components/Tag/Tag.vue'
import TypingIndicator from './components/TypingIndicator/TypingIndicator.vue'

/** @deprecated Renamed to ActionBar. */
export const BulkActions = ActionBar
/** @deprecated Renamed to ActionBarProps. */
export type BulkActionsProps = ActionBarProps
/** @deprecated Renamed to ActionBarAction. */
export type BulkAction = ActionBarAction
/** @deprecated Renamed to Alert. */
export const Banner = Alert
/** @deprecated Renamed to AlertProps. */
export type BannerProps = AlertProps
/** @deprecated Renamed to AlertTone. */
export type BannerTone = AlertTone
/** @deprecated Renamed to AlertDialog. */
export const ConfirmDialog = AlertDialog
/** @deprecated Renamed to AlertDialogProps. */
export type ConfirmDialogProps = AlertDialogProps
/** @deprecated Renamed to Badge. */
export const Pill = Badge
/** @deprecated Renamed to BadgeProps. */
export type PillProps = BadgeProps
/** @deprecated Renamed to BadgeTone. */
export type PillTone = BadgeTone
/** @deprecated Renamed to Calendar. */
export const CalendarMonth = Calendar
/** @deprecated Renamed to CalendarProps. */
export type CalendarMonthProps = CalendarProps
/** @deprecated Renamed to DataList. */
export const List = DataList
/** @deprecated Renamed to DataListProps. */
export type ListProps<T> = DataListProps<T>
/** @deprecated Renamed to DataListGroup. */
export type ListGroup<T> = DataListGroup<T>
/** @deprecated Renamed to Dialog. */
export const Modal = Dialog
/** @deprecated Renamed to DialogProps. */
export type ModalProps = DialogProps
/** @deprecated Renamed to DropdownMenu. */
export const OptionsMenu = DropdownMenu
/** @deprecated Renamed to DropdownMenuProps. */
export type OptionsMenuProps = DropdownMenuProps
/** @deprecated Renamed to DropdownMenuAction. */
export type OptionsMenuAction = DropdownMenuAction
/** @deprecated Renamed to DropdownMenuEntry. */
export type OptionsMenuItem = DropdownMenuEntry
/** @deprecated Renamed to ErrorSummary. */
export const FormErrors = ErrorSummary
/** @deprecated Renamed to ErrorSummaryProps. */
export type FormErrorsProps = ErrorSummaryProps
/** @deprecated Renamed to FilterMenu. */
export const FilterFieldPicker = FilterMenu
/** @deprecated Renamed to FilterMenuProps. */
export type FilterFieldPickerProps = FilterMenuProps
/** @deprecated Renamed to SortMenu. */
export const SortControl = SortMenu
/** @deprecated Renamed to SortMenuProps. */
export type SortControlProps = SortMenuProps
/** @deprecated Renamed to FormField. */
export const Field = FormField
/** @deprecated Renamed to FormFieldProps. */
export type FieldProps = FormFieldProps
/** @deprecated Renamed to ImageUpload. */
export const ImageInput = ImageUpload
/** @deprecated Renamed to ImageUploadProps. */
export type ImageInputProps = ImageUploadProps
/** @deprecated Renamed to Input. */
export const TextInput = Input
/** @deprecated Renamed to InputProps. */
export type TextInputProps = InputProps
/** @deprecated Renamed to Editable. */
export const InlineField = Editable
/** @deprecated Renamed to EditableProps. */
export type InlineFieldProps = EditableProps
/** @deprecated Renamed to PropertyList. */
export const InlineForm = PropertyList
/** @deprecated Renamed to PropertyListField. */
export type InlineFormField = PropertyListField
/** @deprecated Renamed to Collapsible. */
export const LedgerMore = Collapsible
/** @deprecated Renamed to CollapsibleProps. */
export type LedgerMoreProps = CollapsibleProps
/** @deprecated Renamed to PropertyRow. */
export const LedgerRow = PropertyRow
/** @deprecated Renamed to PropertyRowProps. */
export type LedgerRowProps = PropertyRowProps
/** @deprecated Renamed to TypingIndicator. */
export const TypingDots = TypingIndicator

/** @deprecated An outline Tag: `<Tag variant="outline">`. */
export const Chip: FunctionalComponent<{ label?: string; muted?: boolean }> = (props, { slots }) =>
  h(Tag, { variant: 'outline', name: props.label, muted: props.muted }, slots)
Chip.props = ['label', 'muted']
/** @deprecated Use TagProps with `variant: 'outline'`. */
export interface ChipProps {
  label?: string
  muted?: boolean
}
