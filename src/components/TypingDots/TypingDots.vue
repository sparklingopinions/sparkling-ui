<!-- Three dots that pulse in turn while something is being written. Decorative: say what's happening in text nearby. -->
<template>
  <span aria-hidden="true" class="inline-flex gap-0.75">
    <span
      v-for="n in 3"
      :key="n"
      class="size-1 animate-sui-typing rounded-full bg-sui-accent-solid"
      :style="{ animationDelay: `${(n - 1) * 0.15}s` }"
    />
  </span>
</template>
