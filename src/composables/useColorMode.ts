import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export type ColorMode = 'light' | 'dark' | 'system'

const mode = ref<ColorMode>('system')
// Pages that must stay light (a landing page) hold this while mounted: their root says data-mode="light", but
// overlays attached to <body> (tooltips, toasts) sit outside it and would take the visitor's dark mode.
const forcedLight = ref(0)
let storageKey = 'sui-color-mode'
let media: MediaQueryList | null = null

const resolve = (value: ColorMode): 'light' | 'dark' =>
  value === 'system' ? (media?.matches ? 'dark' : 'light') : value

function apply() {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.mode = forcedLight.value > 0 ? 'light' : resolve(mode.value)
}

/**
 * Sets the page's mode from the saved choice (or the system's) and follows the system while on `system`. Call once,
 * before mounting; `storageKey` keeps an existing app's saved choice.
 */
export function initColorMode(options: { storageKey?: string } = {}) {
  if (options.storageKey) storageKey = options.storageKey
  if (typeof window !== 'undefined' && !media) {
    media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', () => mode.value === 'system' && apply())
  }
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(storageKey) : null
  if (saved === 'light' || saved === 'dark' || saved === 'system') mode.value = saved
  apply()
}

/** The chosen mode (`light`, `dark` or `system`) and what it resolves to, with ways to change it. */
export function useColorMode() {
  const setMode = (value: ColorMode) => {
    mode.value = value
    if (typeof localStorage !== 'undefined') localStorage.setItem(storageKey, value)
    apply()
  }

  return {
    mode,
    resolved: computed(() => resolve(mode.value)),
    isDark: computed(() => resolve(mode.value) === 'dark'),
    setMode,
    toggle: () => setMode(resolve(mode.value) === 'dark' ? 'light' : 'dark')
  }
}

/** Keeps the whole page light while the calling component is mounted. */
export function useForceLightMode() {
  onMounted(() => {
    forcedLight.value += 1
    apply()
  })
  onBeforeUnmount(() => {
    forcedLight.value -= 1
    apply()
  })
}
