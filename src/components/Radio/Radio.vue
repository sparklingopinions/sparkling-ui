<script setup lang="ts" generic="T">
import { computed, useAttrs } from 'vue'

export interface RadioProps<T> {
  /** The value the group's v-model takes when this radio is chosen. */
  value: T
  invalid?: boolean
  disabled?: boolean
}

defineOptions({ inheritAttrs: false })

const props = defineProps<RadioProps<T>>()

const model = defineModel<T>()

const checked = computed(() => model.value === props.value)

// Class and style size the control; everything else (id, name, aria-label) belongs on the input.
const attrs = useAttrs()
const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const box = computed(() => [
  checked.value && !props.disabled && 'border-sui-accent-solid bg-sui-accent-solid',
  !checked.value && (props.invalid ? 'border-sui-danger-mid' : 'border-sui-line-strong'),
  props.disabled
    ? 'pointer-events-none cursor-default border-sui-accent-line bg-sui-surface select-none [&>*:first-child]:bg-sui-accent-soft'
    : [
        !checked.value && 'peer-hover:border-sui-accent-bright peer-hover:[&>*:first-child]:bg-sui-accent-bright',
        'peer-focus-visible:ring-1 peer-focus-visible:ring-sui-accent-solid'
      ]
])
</script>

<template>
  <div
    class="relative inline-flex h-4 w-4 cursor-pointer align-bottom select-none"
    :class="attrs.class"
    :style="attrs.style as string"
  >
    <input
      v-bind="inputAttrs"
      :aria-invalid="invalid ? 'true' : undefined"
      :checked="checked"
      class="peer absolute top-0 left-0 z-10 m-0 h-full w-full cursor-pointer appearance-none p-0 opacity-0 outline-hidden"
      :disabled="disabled"
      type="radio"
      :value="value"
      @change="model = value"
    />
    <div
      class="flex h-4 w-4 items-center justify-center rounded-full border outline-transparent transition duration-200 ease-in-out"
      :class="box"
    >
      <div
        class="block h-1.5 w-1.5 rounded-full transition duration-200"
        :class="checked ? 'visible scale-[1,1] bg-sui-surface' : 'invisible scale-[0.1]'"
      />
    </div>
  </div>
</template>
