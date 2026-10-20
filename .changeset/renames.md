---
'@sparklingopinions/sparkling-ui': minor
---

Components take the design system's names, which follow common UI-library conventions. The former names still work, marked deprecated, so nothing breaks:

| New | Former |
| --- | --- |
| `Dialog` | `Modal` |
| `AlertDialog` | `ConfirmDialog` |
| `DropdownMenu` | `OptionsMenu` (types: `DropdownMenuAction`, `DropdownMenuEntry`) |
| `Input` | `TextInput` |
| `FormField` | `Field` |
| `ErrorSummary` | `FormErrors` |
| `Alert` | `Banner` |
| `Calendar` | `CalendarMonth` |
| `ImageUpload` | `ImageInput` |
| `TypingIndicator` | `TypingDots` |
| `Badge` | `Pill` |
| `Tag variant="outline"` | `Chip` |
| `DataList` | `List` |
| `FilterMenu` | `FilterFieldPicker` |
| `SortMenu` | `SortControl` |
| `ActionBar` | `BulkActions` |
| `PropertyRow` | `LedgerRow` |
| `Collapsible` | `LedgerMore` |
| `Editable` | `InlineField` |
| `PropertyList` | `InlineForm` |

Prop types follow (`DialogProps`, `BadgeTone`...). `Tag` gains `variant` (`soft`, the default, or `outline`) and `muted`, and takes its text from `name` or its slot.
