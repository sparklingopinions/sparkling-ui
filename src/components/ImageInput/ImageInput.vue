<script setup lang="ts">
import { onUnmounted, ref, useTemplateRef, watch } from 'vue'

import PhotoIcon from '../internal/PhotoIcon.vue'

export interface ImageInputProps {
  variant?: 'circle' | 'square'
  /** The preview's width and height, in px. */
  size?: number
  hint?: string
  /** The preview's name: it's a button that opens the file picker, and takes a dropped file. */
  label?: string
  uploadLabel?: string
  replaceLabel?: string
  removeLabel?: string
}

withDefaults(defineProps<ImageInputProps>(), {
  variant: 'circle',
  size: 64,
  hint: 'PNG or JPG, at least 512×512.',
  label: 'Choose an image',
  uploadLabel: 'Upload',
  replaceLabel: 'Replace',
  removeLabel: 'Remove'
})

const emit = defineEmits<{ change: [file: File]; remove: [] }>()

const image = defineModel<File | null>('image', { default: null })
const imageUrl = defineModel<string | null>('imageUrl', { default: null })

const input = useTemplateRef<HTMLInputElement>('input')
const dragging = ref(false)

// The blob URL made for a picked file, revoked when it's no longer shown so each pick doesn't leak one.
let objectUrl: string | null = null
const revoke = () => {
  if (objectUrl) URL.revokeObjectURL(objectUrl)
  objectUrl = null
}

// The parent replaced the preview (a server URL, a reset): our blob is orphaned.
watch(imageUrl, (url) => {
  if (objectUrl && url !== objectUrl) revoke()
})

const pick = () => input.value?.click()

function accept(file?: File | null) {
  if (!file || !['image/png', 'image/jpeg'].includes(file.type)) return
  revoke()
  objectUrl = URL.createObjectURL(file)
  image.value = file
  imageUrl.value = objectUrl
  emit('change', file)
}

function onFileChange(event: Event) {
  const el = event.target as HTMLInputElement
  accept(el.files?.[0])
  // So picking the same file again still fires change.
  el.value = ''
}

function onDrop(event: DragEvent) {
  dragging.value = false
  accept(event.dataTransfer?.files?.[0])
}

function remove() {
  revoke()
  image.value = null
  imageUrl.value = null
  emit('remove')
}

onUnmounted(revoke)
</script>

<template>
  <div class="flex items-center gap-4">
    <div
      :aria-label="label"
      class="relative shrink-0 cursor-pointer overflow-hidden border bg-sui-sunken transition-colors focus-visible:sui-ring"
      :class="[
        variant === 'circle' ? 'rounded-full' : 'rounded-xl',
        dragging ? 'border-sui-accent-solid ring-2 ring-sui-focus-ring' : 'border-sui-line-subtle hover:border-sui-line'
      ]"
      role="button"
      :style="{ width: `${size}px`, height: `${size}px` }"
      tabindex="0"
      @click="pick"
      @dragleave.prevent="dragging = false"
      @dragover.prevent="dragging = true"
      @drop.prevent="onDrop"
      @keydown.enter.prevent="pick"
    >
      <img v-if="imageUrl" alt="" class="h-full w-full object-cover" :src="imageUrl" />
      <div v-else class="flex h-full w-full items-center justify-center text-sui-ink-muted">
        <PhotoIcon />
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <div class="flex items-center gap-2">
        <button
          class="rounded-lg border border-sui-line bg-sui-surface px-3 py-1.5 text-13 font-medium text-sui-ink-body transition-colors hover:border-sui-line-strong focus-visible:sui-ring"
          type="button"
          @click="pick"
        >
          {{ imageUrl ? replaceLabel : uploadLabel }}
        </button>
        <button
          v-if="imageUrl"
          class="rounded-lg px-3 py-1.5 text-13 font-medium text-sui-ink-muted transition-colors hover:bg-sui-danger-soft hover:text-sui-danger focus-visible:sui-ring"
          type="button"
          @click="remove"
        >
          {{ removeLabel }}
        </button>
      </div>
      <p class="text-xs text-sui-ink-muted">{{ hint }}</p>
    </div>

    <input
      ref="input"
      accept="image/png, image/jpeg"
      :aria-label="label"
      class="hidden"
      tabindex="-1"
      type="file"
      @change="onFileChange"
    />
  </div>
</template>
