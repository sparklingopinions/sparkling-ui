<script setup lang="ts">
import { ref, watch } from 'vue'

export interface DrawerProps {
  /** Whether it's slid in. */
  open?: boolean
  /** The edge it comes from. */
  side?: 'start' | 'end'
  /** Its width, any CSS length. */
  width?: string
  /** Over content it covers: raised with the floating shadow. Leave it off where it sits beside the content. */
  floating?: boolean
}

const props = withDefaults(defineProps<DrawerProps>(), { open: false, side: 'end', width: '340px', floating: false })

const root = ref<HTMLElement | null>(null)

// Closing with the focus inside, the focus goes back to the page, so nothing scrolls to keep a hidden control in view.
watch(
  () => props.open,
  (open) => {
    const active = document.activeElement as HTMLElement | null
    if (!open && active && root.value?.contains(active)) active.blur()
  }
)
</script>

<template>
  <div
    ref="root"
    class="absolute inset-y-0 z-[30] flex duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none"
    :class="[
      side === 'start' ? 'left-0' : 'right-0',
      // Opening, visibility isn't transitioned, so it shows at once and what opens it can focus inside straight away;
      // closing, it is, so it stays visible until the slide ends.
      open
        ? 'visible translate-x-0 transition-[transform,translate,box-shadow]'
        : [
            'invisible transition-[transform,translate,box-shadow,visibility]',
            side === 'start' ? '-translate-x-full' : 'translate-x-full'
          ],
      floating && open ? 'shadow-(--sui-shadow-floating)' : ''
    ]"
    :data-state="open ? 'open' : 'closed'"
    :inert="open ? undefined : true"
    :style="{ width }"
  >
    <!-- A non-modal panel pinned to its container's edge (the container is relative and clips it). It slides in and out
         (0.3s, the same curve as the app's other motion); closed, it turns hidden once it has slid out, so it's out of the
         way for the pointer, the keyboard and assistive tech. One root, so classes fall through. -->
    <slot />
  </div>
</template>
