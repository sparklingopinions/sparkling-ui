import { type ComputedRef, type InjectionKey, type Ref, computed, inject, watchEffect } from 'vue'

export interface FieldContext {
  id: string
  describedBy: ComputedRef<string | undefined>
  required: ComputedRef<boolean>
  invalid: ComputedRef<boolean>
  /** The control's text, for the counter. */
  text: Ref<string | undefined>
}

export const fieldKey: InjectionKey<FieldContext> = Symbol('sui-field')

/** For a control inside a Field: its id, description and state, and its value reported back for the counter. */
export function useFieldControl(text: () => unknown, invalid: () => boolean | undefined) {
  const field = inject(fieldKey, null)
  if (field) watchEffect(() => (field.text.value = typeof text() === 'string' ? (text() as string) : undefined))
  return {
    attrs: computed(() =>
      field
        ? {
            id: field.id,
            'aria-describedby': field.describedBy.value,
            'aria-required': field.required.value ? ('true' as const) : undefined
          }
        : {}
    ),
    invalid: computed(() => invalid() || !!field?.invalid.value)
  }
}
