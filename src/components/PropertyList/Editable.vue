<script setup lang="ts">
import { computed, nextTick, ref, toRaw, useAttrs, useTemplateRef, watch } from 'vue'

import Select from '../Select/Select.vue'
import type { SelectOption, SelectValue } from '../Select/types'
import Tag from '../Tag/Tag.vue'
import Textarea from '../Textarea/Textarea.vue'

export interface EditableProps {
  /** `text` (one line), `multiline` (Shift+Enter for a new line), `select` (an outline Tag, picked from `options`) or `title`
   *  (a record's 18px name). */
  variant?: 'text' | 'multiline' | 'select' | 'title'
  placeholder?: string
  /** For `select`. */
  options?: SelectOption[]
  disabled?: boolean
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<EditableProps>(), {
  variant: 'text',
  placeholder: undefined,
  options: () => []
})

const emit = defineEmits<{ blur: [] }>()

const model = defineModel<string | SelectValue | null>({ default: null })

// Only the id, class and data- and aria- attributes go on the root. The name is said before the value, not as an
// aria-label, which would hide the value from it.
const attrs = useAttrs()
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([key]) => key !== 'aria-label' && (key === 'id' || key === 'class' || /^(data|aria)-/.test(key))
    )
  )
)
const name = computed(() => (attrs['aria-label'] as string | undefined) ?? props.placeholder)

const title = computed(() => props.variant === 'title')
const multiline = computed(() => props.variant === 'multiline')

const local = ref(toRaw(model.value) as string | null)
const original = ref(local.value)
const editing = ref(false)
const wrapper = useTemplateRef<HTMLElement>('wrapper')

// Follows the value from outside (a failed save rolled back, a refetch) unless it's being edited.
watch(model, (value) => {
  if (editing.value) return
  local.value = toRaw(value) as string | null
  original.value = local.value
})

const rows = computed(() => (title.value ? 1 : Math.max(1, Math.ceil((local.value?.length ?? 0) / 34))))

async function edit() {
  if (props.disabled) return
  editing.value = true
  await nextTick()
  wrapper.value?.querySelector('textarea')?.focus()
}

function save() {
  editing.value = false
  const value = toRaw(local.value) || null
  // Leaving it untouched isn't a change: an empty value stays as it came, '' or null.
  if (value !== (toRaw(model.value) || null)) model.value = value
  original.value = local.value
  emit('blur')
}

function revert(event: KeyboardEvent) {
  event.preventDefault()
  event.stopPropagation()
  local.value = original.value
  editing.value = false
}

function onEnter(event: KeyboardEvent) {
  if (multiline.value && event.shiftKey) return
  event.preventDefault()
  ;(event.target as HTMLElement).blur()
}

const field =
  'block w-full rounded-lg border border-transparent px-[0.6875rem] py-1.25 text-left text-sui-ink transition-[background-color,border-color,box-shadow] outline-hidden focus-visible:border-sui-accent focus-visible:sui-ring-field'
</script>

<!-- One value shown as plain text and edited where it is: click or Enter to edit, Enter or leaving to save, Escape to
     undo. A `select` opens its list under the value instead. -->
<template>
  <Select
    v-if="variant === 'select'"
    v-model="model as SelectValue | null"
    :aria-label="name"
    :disabled="disabled"
    :options="options"
    @update:model-value="emit('blur')"
  >
    <template #trigger="{ open, toggle, selected }">
      <button
        v-bind="rootAttrs"
        :aria-expanded="open"
        aria-haspopup="listbox"
        :class="[
          field,
          'max-w-[16rem] text-sm leading-5',
          disabled ? 'cursor-auto' : 'cursor-pointer hover:bg-sui-sunken'
        ]"
        :disabled="disabled"
        type="button"
        @click="toggle"
      >
        <span v-if="name" class="sr-only">{{ name }}: </span>
        <Tag v-if="selected[0]" :name="selected[0].label" variant="outline" />
        <span v-else class="text-sui-ink-muted">{{ placeholder }}</span>
      </button>
    </template>
  </Select>
  <div
    v-else
    v-bind="rootAttrs"
    ref="wrapper"
    class="relative"
    :class="[
      field,
      title
        ? 'min-h-10 min-w-4 text-lg leading-7 font-semibold [&_textarea]:min-h-10 [&_textarea]:text-lg [&_textarea]:leading-7 [&_textarea]:font-semibold [&_textarea]:whitespace-nowrap [&_textarea]:placeholder:text-lg [&_textarea]:placeholder:font-semibold'
        : 'max-w-[16rem] text-sm leading-5 [&_textarea]:placeholder:text-sm [&_textarea]:placeholder:leading-5',
      disabled ? 'cursor-auto' : 'cursor-pointer hover:bg-sui-sunken',
      '[&_textarea]:bg-sui-surface [&_textarea]:placeholder:text-sui-ink-muted'
    ]"
    role="button"
    :tabindex="disabled ? -1 : 0"
    @click="edit"
    @keydown.enter="!editing && ($event.preventDefault(), edit())"
  >
    <div>
      <span v-if="name" class="sr-only">{{ name }}: </span>
      <span v-if="!local" class="text-sui-ink-muted">{{ placeholder }}</span>
      <span v-else :class="{ 'whitespace-pre-wrap': multiline }">{{ local }}</span>
    </div>
    <div v-if="editing" class="absolute inset-0 z-10" :class="{ '-mt-px': title }">
      <Textarea
        v-model="local"
        :aria-label="name"
        :auto-resize="!title"
        class="resize-none"
        :class="title && 'h-full px-3 py-1.5'"
        :placeholder="placeholder"
        :rows="rows"
        @blur="save"
        @keydown.enter.stop="onEnter"
        @keydown.esc.stop="revert"
      />
    </div>
  </div>
</template>
