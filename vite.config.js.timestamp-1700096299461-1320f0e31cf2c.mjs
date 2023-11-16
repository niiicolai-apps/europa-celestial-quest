// vite.config.js
import { defineConfig } from "file:///D:/Arbejde/Apps/ls/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/Arbejde/Apps/ls/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import obfuscatorPlugin from "file:///D:/Arbejde/Apps/ls/node_modules/vite-plugin-javascript-obfuscator/dist/index.cjs.js";
var vite_config_default = defineConfig({
  base: "",
  plugins: [
    vue(),
    obfuscatorPlugin({
      exclude: [/node_modules/],
      apply: "build",
      debugger: true,
      options: {
        debugProtection: true
      }
    })
  ],
  build: {
    outDir: "dist",
    // Output directory for the build
    assetsDir: "./"
    // Relative path for assets
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxBcmJlamRlXFxcXEFwcHNcXFxcbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEFyYmVqZGVcXFxcQXBwc1xcXFxsc1xcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovQXJiZWpkZS9BcHBzL2xzL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBvYmZ1c2NhdG9yUGx1Z2luIGZyb20gXCJ2aXRlLXBsdWdpbi1qYXZhc2NyaXB0LW9iZnVzY2F0b3JcIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgYmFzZTogJycsXHJcbiAgcGx1Z2luczogW1xyXG4gICAgdnVlKCksXHJcbiAgICBvYmZ1c2NhdG9yUGx1Z2luKHtcclxuICAgICAgZXhjbHVkZTogWy9ub2RlX21vZHVsZXMvXSxcclxuICAgICAgYXBwbHk6IFwiYnVpbGRcIixcclxuICAgICAgZGVidWdnZXI6IHRydWUsXHJcbiAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICBkZWJ1Z1Byb3RlY3Rpb246IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBvdXREaXI6ICdkaXN0JywgLy8gT3V0cHV0IGRpcmVjdG9yeSBmb3IgdGhlIGJ1aWxkXHJcbiAgICBhc3NldHNEaXI6ICcuLycsIC8vIFJlbGF0aXZlIHBhdGggZm9yIGFzc2V0c1xyXG4gIH0sXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBZ1AsU0FBUyxvQkFBb0I7QUFDN1EsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sc0JBQXNCO0FBRzdCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLGlCQUFpQjtBQUFBLE1BQ2YsU0FBUyxDQUFDLGNBQWM7QUFBQSxNQUN4QixPQUFPO0FBQUEsTUFDUCxVQUFVO0FBQUEsTUFDVixTQUFTO0FBQUEsUUFDUCxpQkFBaUI7QUFBQSxNQUNuQjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQTtBQUFBLElBQ1IsV0FBVztBQUFBO0FBQUEsRUFDYjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
