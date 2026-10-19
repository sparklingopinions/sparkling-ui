<script setup lang="ts">
import { computed, nextTick, ref, toRaw, useAttrs, useTemplateRef, watch } from 'vue'

import Textarea from '../Textarea/Textarea.vue'

export interface InlineFormInputTextProps {
  placeholder?: string | null
  disabled?: boolean
  /** Shift+Enter starts a new line; Enter alone still saves. */
  multipleRows?: boolean
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InlineFormInputTextProps>(), { placeholder: null })

const emit = defineEmits<{ blur: [] }>()

const model = defineModel<string | null>({ default: null })

// The class also styles the textarea. Only the id and data- and aria- attributes go on the root: InlineForm's
// autofocus and the like would change how it behaves.
const attrs = useAttrs()
const rootAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => key === 'id' || /^(data|aria)-/.test(key)))
)

const local = ref(toRaw(model.value))
const original = ref(toRaw(model.value))
const editing = ref(false)
const wrapper = useTemplateRef<HTMLElement>('wrapper')

// Follows the value from outside (a failed save rolled back, a refetch) unless it's being edited.
watch(model, (value) => {
  if (editing.value) return
  local.value = toRaw(value)
  original.value = toRaw(value)
})

const rows = computed(() => Math.max(1, Math.ceil((local.value?.length ?? 0) / 34)))

async function edit() {
  if (props.disabled) return
  editing.value = true
  await nextTick()
  wrapper.value?.querySelector('textarea')?.focus()
}

function save() {
  editing.value = false
  model.value = toRaw(local.value)
  original.value = toRaw(local.value)
  emit('blur')
}

function revert(event: KeyboardEvent) {
  event.preventDefault()
  event.stopPropagation()
  local.value = toRaw(original.value)
  editing.value = false
}

function onEnter(event: KeyboardEvent) {
  if (props.multipleRows && event.shiftKey) return
  ;(event.target as HTMLElement).blur()
}
</script>

<!-- A value shown as text, edited in place: click or Enter to edit, Enter or leaving to save, Escape to undo. -->
<template>
  <div
    v-bind="rootAttrs"
    ref="wrapper"
    class="relative w-full max-w-[16rem] rounded-lg px-3 py-1.5 transition-colors [&_textarea]:relative [&_textarea]:z-10 [&_textarea]:bg-sui-surface [&_textarea]:placeholder:text-sm [&_textarea]:placeholder:leading-5 [&_textarea]:placeholder:text-sui-ink-muted"
    :class="[disabled ? 'cursor-auto' : 'cursor-pointer hover:bg-sui-sunken', $attrs.class]"
    tabindex="0"
    @click="edit"
    @keydown.enter.prevent="edit"
  >
    <div>
      <span v-if="!local" class="text-sui-ink-muted">{{ placeholder }}</span>
      <span v-else>{{ local }}</span>
    </div>
    <div v-show="editing" class="absolute inset-0">
      <Textarea
        v-model="local"
        :aria-label="(($attrs['aria-label'] as string | undefined) ?? placeholder) || undefined"
        auto-resize
        class="resize-none"
        :class="$attrs.class"
        :placeholder="placeholder ?? undefined"
        :rows="rows"
        @blur="save"
        @keydown.enter.stop="onEnter"
        @keydown.esc.stop="revert"
      />
    </div>
  </div>
</template>
