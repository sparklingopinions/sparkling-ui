import { type Ref, computed, ref } from 'vue'

/** Dragging a bottom sheet down: it follows the pointer, and past a third of its height, or a flick faster than
 *  0.6 px/ms, it dismisses; otherwise it springs back. */
export function useSheetDrag(panel: Ref<HTMLElement | null | undefined>, dismiss: () => void) {
  const offset = ref(0)
  const start = ref<{ y: number; t: number } | null>(null)

  function down(event: PointerEvent) {
    // The close button inside the grab area still clicks.
    if (event.button !== 0 || (event.target as Element).closest('button, a, input')) return
    start.value = { y: event.clientY, t: Date.now() }
    ;(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)
  }

  function move(event: PointerEvent) {
    if (start.value) offset.value = Math.max(0, event.clientY - start.value.y)
  }

  function up(event: PointerEvent) {
    if (!start.value) return
    const dy = Math.max(0, event.clientY - start.value.y)
    const speed = dy / Math.max(1, Date.now() - start.value.t)
    start.value = null
    if (dy > (panel.value?.offsetHeight ?? 1) / 3 || speed > 0.6) dismiss()
    else offset.value = 0
  }

  function cancel() {
    start.value = null
    offset.value = 0
  }

  return {
    dragging: computed(() => start.value !== null),
    style: computed(() => (offset.value ? { transform: `translateY(${offset.value}px)` } : undefined)),
    handlers: { onPointerdown: down, onPointermove: move, onPointerup: up, onPointercancel: cancel },
    reset: cancel
  }
}
