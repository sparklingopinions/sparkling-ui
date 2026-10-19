<script setup lang="ts">
import { computed, nextTick, ref, toRaw, useAttrs, useTemplateRef, watch } from 'vue'

import Textarea from '../Textarea/Textarea.vue'

export interface InlineFormInputTitleProps {
  placeholder?: string | null
}

defineOptions({ inheritAttrs: false })

withDefaults(defineProps<InlineFormInputTitleProps>(), { placeholder: null })

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

async function edit() {
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
</script>

<!-- A record's title, edited in place: one line, Enter or leaving to save, Escape to undo. The textarea's leading-7 is
     text-lg's own line height, which its field's leading-5 would otherwise take over. -->
<template>
  <div
    v-bind="rootAttrs"
    ref="wrapper"
    class="relative min-h-10 w-full min-w-4 cursor-pointer rounded-lg px-3 py-1.5 text-lg font-semibold transition-colors hover:bg-sui-sunken [&_textarea]:absolute [&_textarea]:inset-0 [&_textarea]:min-h-10 [&_textarea]:px-3 [&_textarea]:py-1.5 [&_textarea]:text-lg [&_textarea]:leading-7 [&_textarea]:font-semibold [&_textarea]:whitespace-nowrap [&_textarea]:placeholder:text-lg [&_textarea]:placeholder:font-semibold [&_textarea]:placeholder:text-sui-ink-muted"
    @click="edit"
  >
    <div>
      <span v-if="!local" class="text-sui-ink-muted">{{ placeholder }}</span>
      <span v-else>{{ local }}</span>
    </div>
    <div v-show="editing" class="absolute inset-0 -mt-px">
      <Textarea
        v-model="local"
        :aria-label="(($attrs['aria-label'] as string | undefined) ?? placeholder) || undefined"
        auto-resize
        class="resize-none"
        :class="$attrs.class"
        :placeholder="placeholder ?? undefined"
        :rows="1"
        @blur="save"
        @keydown.enter.prevent="($event.target as HTMLElement).blur()"
        @keydown.esc.prevent="revert"
      />
    </div>
  </div>
</template>
