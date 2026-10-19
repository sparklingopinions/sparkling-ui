import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// Apps install these themselves; bundling them would ship a second copy of Vue or Reka.
const external = /^(vue|reka-ui|@tanstack\/vue-virtual)(\/|$)/

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'] },
    sourcemap: true,
    rolldownOptions: {
      external: (id) => external.test(id),
      // One file per module, so apps only bundle the components they import.
      output: { preserveModules: true, preserveModulesRoot: 'src', entryFileNames: '[name].js' }
    }
  }
})
