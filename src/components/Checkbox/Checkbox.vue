<script setup lang="ts">
import { computed, useAttrs } from 'vue'

export interface CheckboxProps {
  invalid?: boolean
  disabled?: boolean
}

defineOptions({ inheritAttrs: false })

const props = defineProps<CheckboxProps>()

const model = defineModel<boolean>({ default: false })

// Class and style size the control; everything else (id, name, aria-label) belongs on the input.
const attrs = useAttrs()
const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const box = computed(() => [
  model.value
    ? 'border-sui-accent-solid bg-sui-accent-solid'
    : props.invalid
      ? 'border-sui-danger-mid'
      : 'border-sui-line-control bg-sui-surface',
  props.disabled
    ? 'cursor-default opacity-60'
    : [!model.value && !props.invalid && 'peer-hover:border-sui-accent-solid', 'peer-focus-visible:sui-ring']
])
</script>

<template>
  <div
    class="relative inline-flex h-4 w-4 cursor-pointer align-bottom text-sui-on-accent select-none"
    :class="attrs.class"
    :style="attrs.style as string"
  >
    <input
      v-bind="inputAttrs"
      :aria-invalid="invalid ? 'true' : undefined"
      :checked="model"
      class="peer absolute top-0 left-0 z-10 m-0 h-full w-full cursor-pointer appearance-none p-0 opacity-0 outline-hidden"
      :disabled="disabled"
      type="checkbox"
      @change="model = ($event.target as HTMLInputElement).checked"
    />
    <div class="flex h-4 w-4 items-center justify-center rounded border transition-colors duration-200" :class="box">
      <svg
        v-if="model"
        aria-hidden="true"
        class="h-4 w-4 text-base leading-none text-sui-on-accent transition-all duration-200"
        fill="none"
        height="14"
        viewBox="0 0 14 14"
        width="14"
      >
        <path
          d="M4.86199 11.5948C4.78717 11.5923 4.71366 11.5745 4.64596 11.5426C4.57826 11.5107 4.51779 11.4652 4.46827 11.4091L0.753985 7.69483C0.683167 7.64891 0.623706 7.58751 0.580092 7.51525C0.536478 7.44299 0.509851 7.36177 0.502221 7.27771C0.49459 7.19366 0.506156 7.10897 0.536046 7.03004C0.565935 6.95111 0.613367 6.88 0.674759 6.82208C0.736151 6.76416 0.8099 6.72095 0.890436 6.69571C0.970973 6.67046 1.05619 6.66385 1.13966 6.67635C1.22313 6.68886 1.30266 6.72017 1.37226 6.76792C1.44186 6.81567 1.4997 6.8786 1.54141 6.95197L4.86199 10.2503L12.6397 2.49483C12.7444 2.42694 12.8689 2.39617 12.9932 2.40745C13.1174 2.41873 13.2343 2.47141 13.3251 2.55705C13.4159 2.64268 13.4753 2.75632 13.4938 2.87973C13.5123 3.00315 13.4888 3.1292 13.4271 3.23768L5.2557 11.4091C5.20618 11.4652 5.14571 11.5107 5.07801 11.5426C5.01031 11.5745 4.9368 11.5923 4.86199 11.5948Z"
          fill="currentColor"
        />
      </svg>
    </div>
  </div>
</template>
