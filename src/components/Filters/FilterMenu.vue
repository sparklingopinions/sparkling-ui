<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'

import {
  ListboxContent,
  ListboxFilter,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem,
  ListboxRoot,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger
} from 'reka-ui'

import Button from '../Button/Button.vue'
import FilterFrame from './FilterFrame.vue'
import FilterGlyph from './FilterGlyph.vue'
import type { FilterField } from './types'

export interface FilterMenuProps {
  fields: FilterField[]
  /** Fields already filtering, marked "In use"; picking one should open its chip, not add a second. */
  inUse?: string[]
  /** chip: the dashed "+ Filter" in the view bar. button: the page header's Filters button, tinted while filters are in use. */
  as?: 'chip' | 'button'
  /** The footer's status; "{count} fields" by default. */
  status?: string
  label?: string
  buttonLabel?: string
  searchPlaceholder?: string
  inUseLabel?: string
  addLabel?: string
  closeLabel?: string
  /** `{count}` is the number of fields. */
  fieldsLabel?: string
  /** `{query}` is what was typed. */
  noMatchLabel?: string
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FilterMenuProps>(), {
  inUse: () => [],
  as: 'chip',
  status: undefined,
  label: 'Filter',
  buttonLabel: 'Filters',
  searchPlaceholder: 'Filter by…',
  inUseLabel: 'In use',
  addLabel: 'Add',
  closeLabel: 'Close',
  fieldsLabel: '{count} fields',
  noMatchLabel: 'No field matches “{query}”.'
})

const emit = defineEmits<{ pick: [name: string] }>()

const open = defineModel<boolean>('open', { default: false })

const attrs = useAttrs()
const query = ref('')
// Only the keyboard's highlight gets the focus ring; the pointer's is just a tint.
const keyboard = ref(false)

const groups = computed(() => {
  const q = query.value.trim().toLowerCase()
  const shown = props.fields.filter((f) => !q || f.label.toLowerCase().includes(q))
  return [...new Set(shown.map((f) => f.group ?? ''))].map((name) => ({
    name,
    fields: shown.filter((f) => (f.group ?? '') === name)
  }))
})

function pick(name: unknown) {
  if (typeof name !== 'string') return
  open.value = false
  query.value = ''
  emit('pick', name)
}

function onOpen(isOpen: boolean) {
  if (!isOpen) query.value = ''
}

function onKeydown(event: KeyboardEvent) {
  if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) keyboard.value = true
}
</script>

<!-- The field list behind "+ Filter": search, fields grouped with their type, and which are already filtering. -->
<template>
  <PopoverRoot v-model:open="open" @update:open="onOpen">
    <PopoverTrigger v-if="as === 'button'" as-child>
      <Button v-bind="attrs" :variant="inUse.length ? 'tinted' : 'secondary'">
        <svg
          aria-hidden="true"
          class="size-4 fill-none stroke-current"
          stroke-linejoin="round"
          stroke-width="1.5"
          viewBox="0 0 16 16"
        >
          <path d="M2.5 3.5h11l-4.25 5v4l-2.5 1v-5z" />
        </svg>
        {{ buttonLabel }}
      </Button>
    </PopoverTrigger>
    <PopoverTrigger
      v-else
      v-bind="attrs"
      class="inline-flex h-7.5 items-center gap-1.5 rounded-lg border border-dashed border-sui-line-strong px-2 text-13 font-medium whitespace-nowrap text-sui-ink-muted outline-hidden transition-[border-color,box-shadow] duration-150 hover:border-sui-ink-muted hover:text-sui-ink-body focus-visible:sui-ring data-[state=open]:border-solid data-[state=open]:border-sui-accent-solid data-[state=open]:text-sui-accent data-[state=open]:shadow-[0_0_0_3px_rgb(var(--sui-focus-ring))]"
    >
      <FilterGlyph name="plus" />
      {{ label }}
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        align="start"
        class="z-[1100] w-85 max-w-[calc(100vw-2rem)] origin-(--reka-popover-content-transform-origin) rounded-xl border border-sui-line bg-sui-surface text-sui-ink shadow-lg data-[state=open]:animate-sui-overlay-in"
        :side-offset="8"
        @keydown="onKeydown"
        @pointermove="keyboard = false"
      >
        <ListboxRoot highlight-on-hover @update:model-value="pick">
          <FilterFrame
            :close-label="closeLabel"
            :enter-label="addLabel"
            :status="status ?? fieldsLabel.replace('{count}', String(fields.length))"
          >
            <div class="flex h-11 items-center gap-2 border-b border-sui-line-subtle px-3.5 text-sui-ink-muted">
              <FilterGlyph class="size-4" name="search" />
              <ListboxFilter
                v-model="query"
                :aria-label="searchPlaceholder"
                auto-focus
                class="h-full min-w-0 flex-1 border-none bg-transparent p-0 text-sm text-sui-ink shadow-none outline-hidden placeholder:text-sui-ink-faint focus:border-none focus:shadow-none focus:ring-0 focus:outline-hidden"
                :placeholder="searchPlaceholder"
              />
            </div>
            <ListboxContent
              :aria-label="searchPlaceholder"
              class="group/list max-h-64 overflow-auto px-1.5 pt-1 pb-1.5 outline-hidden"
              :data-keyboard="keyboard || undefined"
            >
              <ListboxGroup v-for="group in groups" :key="group.name">
                <ListboxGroupLabel
                  v-if="group.name"
                  class="m-0 px-2 pt-2.5 pb-1 text-11 font-semibold tracking-caps text-sui-ink-muted uppercase"
                >
                  {{ group.name }}
                </ListboxGroupLabel>
                <ListboxItem
                  v-for="field in group.fields"
                  :key="field.name"
                  class="flex min-h-8 cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1 text-13.5 text-sui-ink outline-hidden select-none data-highlighted:bg-sui-sunken group-data-keyboard/list:data-highlighted:sui-ring-inset"
                  :value="field.name"
                >
                  <span
                    class="flex size-6 shrink-0 items-center justify-center rounded-md bg-sui-sunken text-sui-ink-body"
                  >
                    <FilterGlyph :name="field.type" />
                  </span>
                  <span class="min-w-0 flex-1 truncate">{{ field.label }}</span>
                  <span
                    v-if="inUse.includes(field.name)"
                    class="inline-flex items-center gap-1.5 text-xs font-medium text-sui-accent"
                  >
                    <span class="size-1.5 rounded-full bg-sui-accent-solid" />
                    {{ inUseLabel }}
                  </span>
                </ListboxItem>
              </ListboxGroup>
              <p v-if="!groups.length" class="m-0 px-2 py-3 text-13 text-sui-ink-body">
                {{ noMatchLabel.replace('{query}', query) }}
              </p>
            </ListboxContent>
          </FilterFrame>
        </ListboxRoot>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
