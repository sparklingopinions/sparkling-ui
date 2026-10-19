<script setup lang="ts">
import { onMounted, ref } from 'vue'

const groups: { title: string; roles: string[] }[] = [
  { title: 'Surfaces', roles: ['canvas', 'surface', 'sunken'] },
  { title: 'Lines', roles: ['line-subtle', 'line', 'line-strong'] },
  { title: 'Ink', roles: ['ink', 'ink-emphasis', 'ink-body', 'ink-subtle', 'ink-muted', 'ink-faint', 'mark-faint'] },
  { title: 'Contrast', roles: ['contrast', 'contrast-hover', 'on-contrast'] },
  {
    title: 'Accent',
    roles: [
      'accent',
      'accent-solid',
      'accent-hover',
      'on-accent',
      'accent-wash',
      'accent-soft',
      'accent-line',
      'focus-ring'
    ]
  },
  ...['success', 'warning', 'danger', 'info'].map((status) => ({
    title: `Status: ${status}`,
    roles: [
      `${status}-soft`,
      `${status}-line`,
      `${status}-mid`,
      status,
      ...(status === 'warning' ? ['warning-bright'] : []),
      ...(status === 'danger' ? ['danger-solid', 'danger-hover', 'on-danger'] : [])
    ]
  })),
  ...['blue', 'green', 'orange', 'pink', 'purple', 'slate', 'red', 'amber'].map((hue) => ({
    title: `Hue: ${hue}`,
    roles: [`hue-${hue}-soft`, `hue-${hue}-line`, `hue-${hue}-ink`]
  })),
  { title: 'Inverse', roles: ['inverse', 'on-inverse', 'scrim'] }
]

const values = ref<Record<string, string>>({})

onMounted(() => {
  const style = getComputedStyle(document.documentElement)
  for (const role of groups.flatMap((group) => group.roles)) {
    values.value[role] = style.getPropertyValue(`--sui-${role}`).trim()
  }
})
</script>

<template>
  <div class="flex flex-col gap-6 bg-sui-canvas p-6 text-sui-ink">
    <section v-for="group in groups" :key="group.title">
      <h2 class="mb-3 text-sm font-semibold">{{ group.title }}</h2>
      <ul class="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-3">
        <li v-for="role in group.roles" :key="role" class="flex items-center gap-3">
          <span
            class="size-10 shrink-0 rounded-lg border border-sui-line-subtle"
            :style="{ backgroundColor: `rgb(var(--sui-${role}))` }"
          />
          <span class="flex min-w-0 flex-col">
            <code class="text-13 font-medium">{{ role }}</code>
            <code class="text-12.5 text-sui-ink-body">{{ values[role] }}</code>
          </span>
        </li>
      </ul>
    </section>
  </div>
</template>
