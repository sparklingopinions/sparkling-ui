import { type Ref, onBeforeUnmount, ref } from 'vue'

/**
 * Dragging an item between zones (a Board's columns, a DataList's groups) on pointer events, so it works with a mouse,
 * a pen and a finger. A mouse drags once it moves a few pixels, so a click still clicks; a finger after a short press,
 * so a swipe still scrolls. A copy of the item follows the pointer; Escape puts it back.
 *
 * Zones carry `data-drag-zone="<id>"` and items `data-drag-index="<i>"` inside them.
 */
export interface DragMoveOptions {
  root: Ref<HTMLElement | null | undefined>
  /** How many items a zone holds, for a drop past its last one. */
  countOf: (zone: string) => number
  /** Items also reorder within their zone. */
  sortable?: () => boolean
  onMove: (id: unknown, zone: string, index: number) => void
  /** Extra inline style for the copy that follows the pointer, e.g. a ground for a row that has none of its own. */
  ghostStyle?: Partial<CSSStyleDeclaration>
  /** The copy's widest, so a full-width row follows the pointer as a compact line. */
  ghostMaxWidth?: number
  /** The copy leans a little, as a card picked up does; off for rows. */
  tilt?: boolean
}

const MOUSE_SLOP = 4
const TOUCH_SLOP = 8
const TOUCH_DELAY = 250
const EDGE = 48

export function useDragMove(options: DragMoveOptions) {
  const dragged = ref<{ id: unknown; zone: string; index: number } | null>(null)
  const target = ref<{ zone: string; index: number } | null>(null)

  let pending: {
    id: unknown
    zone: string
    index: number
    x: number
    y: number
    el: HTMLElement
    touch: boolean
  } | null = null
  let pressTimer: number | undefined
  let ghost: HTMLElement | null = null
  let scroller: HTMLElement | null = null
  let grab = { x: 0, y: 0 }
  let justDragged = false

  function onPointerDown(event: PointerEvent, id: unknown, zone: string, index: number) {
    const from = event.target as HTMLElement
    if (event.button !== 0 || from.closest('input, textarea, select, [contenteditable], [data-no-drag]')) return
    const touch = event.pointerType === 'touch'
    pending = { id, zone, index, x: event.clientX, y: event.clientY, el: event.currentTarget as HTMLElement, touch }
    if (touch) pressTimer = window.setTimeout(() => pending && start(), TOUCH_DELAY)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', stop)
    window.addEventListener('touchmove', holdScroll, { passive: false })
    window.addEventListener('keydown', onEscape)
  }

  function start() {
    if (!pending) return
    const rect = pending.el.getBoundingClientRect()
    const width = Math.min(rect.width, options.ghostMaxWidth ?? Infinity)
    // Keep the grab point inside a narrowed copy.
    grab = { x: Math.min(pending.x - rect.left, width - 16), y: pending.y - rect.top }
    ghost = pending.el.cloneNode(true) as HTMLElement
    ghost.removeAttribute('id')
    ghost.setAttribute('aria-hidden', 'true')
    // Inline, so no class the item carries (`relative`, an app's own) can put the copy back in the page's flow.
    Object.assign(ghost.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      margin: '0',
      zIndex: '1300',
      pointerEvents: 'none',
      width: `${width}px`,
      overflow: 'hidden',
      height: `${rect.height}px`,
      opacity: '0.96',
      borderRadius: '12px',
      boxShadow: 'var(--sui-shadow-floating)',
      transition: 'none',
      ...options.ghostStyle
    })
    document.body.appendChild(ghost)
    scroller = scrollParent(options.root.value)
    follow(pending.x, pending.y)
    dragged.value = { id: pending.id, zone: pending.zone, index: pending.index }
  }

  function onPointerMove(event: PointerEvent) {
    if (!pending) return
    if (!dragged.value) {
      const moved = Math.hypot(event.clientX - pending.x, event.clientY - pending.y)
      // A finger that moves before the press is long enough is scrolling.
      if (pending.touch) return moved > TOUCH_SLOP ? stop() : undefined
      if (moved < MOUSE_SLOP) return
      start()
    }
    event.preventDefault()
    follow(event.clientX, event.clientY)
    aim(event.clientX, event.clientY)
    scrollNear(event.clientX, event.clientY)
  }

  function follow(x: number, y: number) {
    if (ghost)
      ghost.style.transform = `translate(${x - grab.x}px, ${y - grab.y}px)${options.tilt === false ? '' : ' rotate(1deg)'}`
  }

  // What's under the pointer: an item's top half drops before it, the bottom half after; the rest of a zone, at its end.
  function aim(x: number, y: number) {
    const under = document.elementFromPoint(x, y)
    const zoneEl = under?.closest<HTMLElement>('[data-drag-zone]')
    if (!zoneEl || !options.root.value?.contains(zoneEl)) {
      target.value = null
      return
    }
    const zone = zoneEl.dataset.dragZone!
    const item = under!.closest<HTMLElement>('[data-drag-index]')
    let index = options.countOf(zone)
    if (item && zoneEl.contains(item)) {
      const rect = item.getBoundingClientRect()
      index = Number(item.dataset.dragIndex) + (y < rect.top + rect.height / 2 ? 0 : 1)
    }
    if (target.value?.zone !== zone || target.value.index !== index) target.value = { zone, index }
  }

  // Near the edges of a zone that scrolls, or of the page's scroller, it scrolls that way.
  function scrollNear(x: number, y: number) {
    const zoneEl = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-drag-zone]')
    if (zoneEl && zoneEl.scrollHeight > zoneEl.clientHeight) {
      const rect = zoneEl.getBoundingClientRect()
      if (y < rect.top + EDGE) zoneEl.scrollTop -= 12
      else if (y > rect.bottom - EDGE) zoneEl.scrollTop += 12
    }
    const root = options.root.value
    if (root && root.scrollWidth > root.clientWidth) {
      const rect = root.getBoundingClientRect()
      if (x < rect.left + EDGE) root.scrollLeft -= 12
      else if (x > rect.right - EDGE) root.scrollLeft += 12
    }
    if (scroller) {
      const rect = scroller.getBoundingClientRect()
      if (y < rect.top + EDGE) scroller.scrollTop -= 12
      else if (y > rect.bottom - EDGE) scroller.scrollTop += 12
    }
  }

  function onPointerUp() {
    const from = dragged.value
    const to = target.value
    if (from && to) {
      let index = to.index
      if (from.zone === to.zone) {
        // Within a zone the dragged item leaves its old slot first.
        if (index > from.index) index--
        if (options.sortable?.() && index !== from.index) options.onMove(from.id, to.zone, index)
      } else {
        options.onMove(from.id, to.zone, index)
      }
    }
    stop()
  }

  function holdScroll(event: TouchEvent) {
    if (dragged.value) event.preventDefault()
  }

  function onEscape(event: KeyboardEvent) {
    if (event.key === 'Escape' && dragged.value) {
      event.preventDefault()
      stop()
    }
  }

  function stop() {
    window.clearTimeout(pressTimer)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', stop)
    window.removeEventListener('touchmove', holdScroll)
    window.removeEventListener('keydown', onEscape)
    ghost?.remove()
    ghost = null
    scroller = null
    // The click that ends a drag isn't a click on the item.
    if (dragged.value) {
      justDragged = true
      window.setTimeout(() => (justDragged = false))
    }
    pending = null
    dragged.value = null
    target.value = null
  }

  onBeforeUnmount(stop)

  return {
    dragged,
    target,
    onPointerDown,
    /** The click that ended a drag, to ignore. */
    endedDrag: () => justDragged
  }
}

/** The nearest ancestor that scrolls vertically, so a long list scrolls while dragging past its edge. */
function scrollParent(el: HTMLElement | null | undefined): HTMLElement | null {
  let node = el?.parentElement ?? null
  while (node) {
    const overflow = getComputedStyle(node).overflowY
    if ((overflow === 'auto' || overflow === 'scroll') && node.scrollHeight > node.clientHeight) return node
    node = node.parentElement
  }
  return null
}
