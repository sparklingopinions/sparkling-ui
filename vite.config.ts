import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// Apps install these themselves; bundling them would ship a second copy of Vue, Reka or TipTap.
const external = /^(vue|reka-ui|@tanstack\/vue-virtual|@tiptap\/[^/]+)(\/|$)/

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    // The editor is an entry of its own, so apps without TipTap never import it.
    lib: { entry: { index: 'src/index.ts', 'markdown-editor': 'src/markdown-editor.ts' }, formats: ['es'] },
    sourcemap: true,
    rolldownOptions: {
      external: (id) => external.test(id),
      // One file per module, so apps only bundle the components they import.
      output: { preserveModules: true, preserveModulesRoot: 'src', entryFileNames: '[name].js' }
    }
  }
})
