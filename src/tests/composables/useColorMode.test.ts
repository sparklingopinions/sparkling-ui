import { defineComponent, h } from 'vue'

import { mount } from '@vue/test-utils'

import { initColorMode, useColorMode, useForceLightMode } from '../../index'

let systemDark = false
const listeners: (() => void)[] = []

beforeAll(() => {
  window.matchMedia = vi.fn(() => ({
    get matches() {
      return systemDark
    },
    addEventListener: (_: string, listener: () => void) => listeners.push(listener)
  })) as unknown as typeof window.matchMedia
})

beforeEach(() => {
  localStorage.clear()
  systemDark = false
  useColorMode().setMode('system')
})

const pageMode = () => document.documentElement.dataset.mode

describe('useColorMode', () => {
  it('follows the system until a mode is chosen, and saves the choice', () => {
    initColorMode({ storageKey: 'app-theme' })
    expect(pageMode()).toBe('light')

    systemDark = true
    listeners.forEach((listener) => listener())
    expect(pageMode()).toBe('dark')

    const { setMode, resolved, isDark } = useColorMode()
    setMode('light')
    expect(pageMode()).toBe('light')
    expect(resolved.value).toBe('light')
    expect(isDark.value).toBe(false)
    expect(localStorage.getItem('app-theme')).toBe('light')
  })

  it('restores a saved choice, and toggles', () => {
    localStorage.setItem('app-theme', 'dark')
    initColorMode({ storageKey: 'app-theme' })
    expect(pageMode()).toBe('dark')

    useColorMode().toggle()
    expect(pageMode()).toBe('light')
  })

  it('keeps the page light while a page that asks for it is mounted', () => {
    useColorMode().setMode('dark')
    const Page = defineComponent({
      setup() {
        useForceLightMode()
        return () => h('div')
      }
    })
    const page = mount(Page)
    expect(pageMode()).toBe('light')

    page.unmount()
    expect(pageMode()).toBe('dark')
  })
})
