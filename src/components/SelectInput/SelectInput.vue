<script setup lang="ts">
import { ref } from 'vue'

import type { Hue } from '../../utils/hues'
import Popover from '../Popover/Popover.vue'
import SelectInputPanel from './SelectInputPanel.vue'
import type { SelectInputItem } from './types'

export interface SelectInputProps {
  items?: SelectInputItem[]
  loading?: boolean
  /** Opens over its trigger, for a value edited in place. */
  inline?: boolean
  multiple?: boolean
  /** Offers to create what was typed, through `createFn`. */
  canCreate?: boolean
  createFn?: (item: { name: string; color?: Hue }) => SelectInputItem | Promise<SelectInputItem>
  /** Creates with a colour, shown as a tag. */
  createColored?: boolean
  inputPlaceholder?: string
  emptyPlaceholder?: string
  createLabel?: string
  removeLabel?: string
  /** Names the list and its filter field for assistive tech, e.g. "Companies". */
  label?: string
}

withDefaults(defineProps<SelectInputProps>(), {
  items: () => [],
  createFn: (item: { name: string }) => ({ id: item.name, ...item }),
  createColored: true,
  inputPlaceholder: 'Type something...',
  emptyPlaceholder: 'No results found',
  createLabel: 'Create',
  removeLabel: 'Remove',
  label: 'Options'
})

defineEmits<{ 'query-change': [query: string] }>()

const model = defineModel<SelectInputItem | SelectInputItem[] | null>({ required: true })

const expanded = ref(false)
const panel = ref<InstanceType<typeof Popover>>()

const open = (event: Event) => panel.value?.show(event)
const close = () => panel.value?.hide()
</script>

<!-- The trigger slot draws the field; it gets `onClick` to open the panel and `expanded`. -->
<template>
  <div
    :class="
      inline
        ? 'inline-flex w-full max-w-[16rem] cursor-pointer items-center overflow-hidden rounded-lg px-3 py-1.5 outline-hidden transition-colors hover:bg-sui-sunken focus-visible:ring-2 focus-visible:ring-sui-accent-line [&>*]:basis-full'
        : 'max-w-[16rem] flex-1 rounded-lg outline-hidden transition-shadow focus:ring-3 focus:ring-sui-focus-ring'
    "
    tabindex="0"
    @keydown.enter="open"
  >
    <slot :expanded="expanded" name="trigger" :on-click="open">
      <button type="button" />
    </slot>
    <Popover
      ref="panel"
      :align-offset="inline ? -16 : 0"
      :class="inline ? '' : 'min-w-60'"
      :offset="inline ? -32 : 4"
      @hide="expanded = false"
      @show="expanded = true"
    >
      <SelectInputPanel
        v-model="model"
        :can-create="canCreate"
        :class="inline ? '' : 'min-w-64'"
        :create-colored="createColored"
        :create-fn="createFn"
        :create-label="createLabel"
        :empty-placeholder="emptyPlaceholder"
        :input-placeholder="inputPlaceholder"
        :items="items"
        :label="label"
        :loading="loading"
        :multiple="multiple"
        :remove-label="removeLabel"
        @done="close"
        @query-change="$emit('query-change', $event)"
      >
        <template v-if="$slots.option" #option="{ item }">
          <slot :item="item" name="option" />
        </template>
      </SelectInputPanel>
    </Popover>
  </div>
</template>
