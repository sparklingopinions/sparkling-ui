<script setup lang="ts">
import { onMounted, ref } from 'vue'

type Mode = 'light' | 'dark'

// `min: 3` marks a boundary or a focus ring, not text: WCAG 1.4.11 asks 3:1 of those.
const pairs: { text: string; background: string; usage: string; min?: number }[] = [
  { text: 'ink', background: 'surface', usage: 'Headings, primary text' },
  { text: 'ink-emphasis', background: 'surface', usage: 'Secondary buttons, dialog titles' },
  { text: 'ink-body', background: 'surface', usage: 'Body text' },
  { text: 'ink-subtle', background: 'surface', usage: 'Ghost buttons, tabs, select options, links' },
  { text: 'ink-subtle', background: 'canvas', usage: 'Ghost buttons on the page background' },
  { text: 'ink-subtle', background: 'sunken', usage: 'Grey pills, table headers' },
  { text: 'ink-muted', background: 'surface', usage: 'Ledger labels, inline form hints, empty states, chips' },
  { text: 'ink-muted', background: 'canvas', usage: 'The same text, on the page background' },
  { text: 'ink-faint', background: 'surface', usage: 'Placeholders' },
  { text: 'accent', background: 'surface', usage: 'Active tabs, the selected calendar day' },
  { text: 'accent', background: 'accent-wash', usage: 'Tinted buttons, sorted table headers' },
  { text: 'ink-body', background: 'accent-wash', usage: 'Selected table rows' },
  { text: 'ink-muted', background: 'accent-wash', usage: 'Meta on selected list rows' },
  { text: 'ink-muted', background: 'sunken', usage: 'List group counts' },
  { text: 'accent', background: 'accent-soft', usage: 'Tinted buttons on hover' },
  { text: 'on-accent', background: 'accent-solid', usage: 'Primary buttons' },
  { text: 'on-accent', background: 'accent-hover', usage: 'Primary buttons on hover' },
  { text: 'on-contrast', background: 'contrast', usage: 'Contrast buttons' },
  { text: 'on-danger', background: 'danger-solid', usage: 'Danger buttons' },
  { text: 'on-danger', background: 'danger-hover', usage: 'Danger buttons on hover' },
  { text: 'danger', background: 'surface', usage: 'Danger outline buttons, errors' },
  { text: 'danger', background: 'danger-soft', usage: 'Danger pills, danger outline buttons on hover' },
  { text: 'success', background: 'success-soft', usage: 'Pills' },
  { text: 'warning', background: 'warning-soft', usage: 'Pills' },
  { text: 'info', background: 'info-soft', usage: 'Pills' },
  { text: 'on-inverse', background: 'inverse', usage: 'Tooltips, toasts' },
  { text: 'ink-body', background: 'sunken', usage: 'Tags, grey avatars' },
  { text: 'ink-body', background: 'danger-soft', usage: 'Danger banners' },
  { text: 'ink-body', background: 'warning-soft', usage: 'Warning banners' },
  { text: 'ink-body', background: 'accent-soft', usage: 'Info banners' },
  { text: 'ink-body', background: 'canvas', usage: 'Neutral banners' },
  { text: 'warning', background: 'surface', usage: 'Text pills' },
  { text: 'success', background: 'surface', usage: 'Text pills' },
  { text: 'info', background: 'surface', usage: 'Text pills' },
  { text: 'hue-blue-ink', background: 'hue-blue-soft', usage: 'Avatar initials' },
  { text: 'hue-green-ink', background: 'hue-green-soft', usage: 'Avatar initials' },
  { text: 'hue-orange-ink', background: 'hue-orange-soft', usage: 'Avatar initials' },
  { text: 'hue-pink-ink', background: 'hue-pink-soft', usage: 'Avatar initials' },
  { text: 'hue-purple-ink', background: 'hue-purple-soft', usage: 'Avatar initials' },
  { text: 'hue-slate-ink', background: 'hue-slate-soft', usage: 'Avatar initials' },
  { text: 'hue-red-ink', background: 'hue-red-soft', usage: 'Avatar initials' },
  { text: 'hue-amber-ink', background: 'hue-amber-soft', usage: 'Avatar initials' },
  { text: 'line-control', background: 'surface', usage: 'Field, checkbox and radio borders', min: 3 },
  { text: 'line-control', background: 'canvas', usage: 'The same borders, on the page background', min: 3 },
  { text: 'line-control', background: 'sunken', usage: 'The same borders, on sunken panels', min: 3 },
  { text: 'accent', background: 'surface', usage: 'The focus ring', min: 3 },
  { text: 'accent', background: 'canvas', usage: 'The focus ring, on the page background', min: 3 },
  { text: 'accent', background: 'sunken', usage: 'The focus ring on a highlighted option', min: 3 },
  { text: 'on-inverse', background: 'inverse', usage: 'The focus ring on toasts', min: 3 }
]

const probes = ref<Record<Mode, HTMLElement | null>>({ light: null, dark: null })
const channels = ref<Record<Mode, Record<string, number[]>>>({ light: {}, dark: {} })

onMounted(() => {
  for (const mode of ['light', 'dark'] as const) {
    const style = getComputedStyle(probes.value[mode]!)
    for (const role of pairs.flatMap((pair) => [pair.text, pair.background])) {
      channels.value[mode][role] = style.getPropertyValue(`--sui-${role}`).trim().split(/\s+/).map(Number)
    }
  }
})

const luminance = (rgb: number[]) =>
  rgb
    .map((c) => (c / 255 <= 0.03928 ? c / 255 / 12.92 : ((c / 255 + 0.055) / 1.055) ** 2.4))
    .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i]!, 0)

function ratio(mode: Mode, text: string, background: string) {
  const a = channels.value[mode][text]
  const b = channels.value[mode][background]
  if (!a || !b) return 0
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (high + 0.05) / (low + 0.05)
}

const rgb = (mode: Mode, role: string) => `rgb(${channels.value[mode][role]?.join(' ')})`
</script>

<template>
  <div class="bg-sui-surface p-6 text-sui-ink">
    <div :ref="(el) => (probes.light = el as HTMLElement)" data-mode="light" hidden />
    <div :ref="(el) => (probes.dark = el as HTMLElement)" data-mode="dark" hidden />
    <table class="w-full border-collapse text-left text-sm">
      <thead>
        <tr class="border-b border-sui-line text-13 text-sui-ink-body">
          <th class="py-2 pr-4 font-medium" scope="col">Colour on background</th>
          <th class="py-2 pr-4 font-medium" colspan="2" scope="colgroup">Light</th>
          <th class="py-2 pr-4 font-medium" colspan="2" scope="colgroup">Dark</th>
          <th class="py-2 font-medium" scope="col">Where MustLoop uses it</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pair in pairs" :key="`${pair.text}/${pair.background}`" class="border-b border-sui-line-subtle">
          <th class="py-2 pr-4 font-normal whitespace-nowrap" scope="row">
            <code class="text-13">{{ pair.text }}</code>
            <span class="text-sui-ink-body"> on </span>
            <code class="text-13">{{ pair.background }}</code>
          </th>
          <template v-for="mode in ['light', 'dark'] as const" :key="mode">
            <td class="py-2 pr-2">
              <span
                v-if="pair.min"
                class="flex h-7 w-24 items-center justify-center rounded-md border border-sui-line-subtle"
                :style="{ backgroundColor: rgb(mode, pair.background) }"
              >
                <span class="h-4 w-14 rounded-sm border-2" :style="{ borderColor: rgb(mode, pair.text) }" />
              </span>
              <span
                v-else
                class="inline-flex h-7 items-center rounded-md border border-sui-line-subtle px-2.5 font-medium whitespace-nowrap"
                :style="{ backgroundColor: rgb(mode, pair.background), color: rgb(mode, pair.text) }"
              >
                Add contact
              </span>
            </td>
            <td class="py-2 pr-4 whitespace-nowrap tabular-nums">
              {{ ratio(mode, pair.text, pair.background).toFixed(2) }}
              <span
                v-if="ratio(mode, pair.text, pair.background) < (pair.min ?? 4.5)"
                class="ml-1 font-medium text-sui-danger"
              >
                Below AA
              </span>
            </td>
          </template>
          <td class="py-2 text-sui-ink-body">{{ pair.usage }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
