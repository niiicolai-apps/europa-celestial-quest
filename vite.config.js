import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [
    vue(),
    obfuscatorPlugin({
      exclude: [/node_modules/],
      apply: "build",
      debugger: true,
      options: {
        debugProtection: true,
      },
    }),
  ],
  build: {
    outDir: 'dist', // Output directory for the build
    assetsDir: './', // Relative path for assets
  },
})
