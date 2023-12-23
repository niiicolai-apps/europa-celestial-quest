// vite.config.js
import { defineConfig } from "file:///Users/nicolaiandersen/Desktop/europa-celestial-quest/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/nicolaiandersen/Desktop/europa-celestial-quest/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import obfuscatorPlugin from "file:///Users/nicolaiandersen/Desktop/europa-celestial-quest/node_modules/vite-plugin-javascript-obfuscator/dist/index.cjs.js";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbmljb2xhaWFuZGVyc2VuL0Rlc2t0b3AvZXVyb3BhLWNlbGVzdGlhbC1xdWVzdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL25pY29sYWlhbmRlcnNlbi9EZXNrdG9wL2V1cm9wYS1jZWxlc3RpYWwtcXVlc3Qvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL25pY29sYWlhbmRlcnNlbi9EZXNrdG9wL2V1cm9wYS1jZWxlc3RpYWwtcXVlc3Qvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgb2JmdXNjYXRvclBsdWdpbiBmcm9tIFwidml0ZS1wbHVnaW4tamF2YXNjcmlwdC1vYmZ1c2NhdG9yXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBiYXNlOiAnJyxcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSgpLFxuICAgIG9iZnVzY2F0b3JQbHVnaW4oe1xuICAgICAgZXhjbHVkZTogWy9ub2RlX21vZHVsZXMvXSxcbiAgICAgIGFwcGx5OiBcImJ1aWxkXCIsXG4gICAgICBkZWJ1Z2dlcjogdHJ1ZSxcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgZGVidWdQcm90ZWN0aW9uOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdkaXN0JywgLy8gT3V0cHV0IGRpcmVjdG9yeSBmb3IgdGhlIGJ1aWxkXG4gICAgYXNzZXRzRGlyOiAnLi8nLCAvLyBSZWxhdGl2ZSBwYXRoIGZvciBhc3NldHNcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlWLFNBQVMsb0JBQW9CO0FBQzlXLE9BQU8sU0FBUztBQUNoQixPQUFPLHNCQUFzQjtBQUc3QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixpQkFBaUI7QUFBQSxNQUNmLFNBQVMsQ0FBQyxjQUFjO0FBQUEsTUFDeEIsT0FBTztBQUFBLE1BQ1AsVUFBVTtBQUFBLE1BQ1YsU0FBUztBQUFBLFFBQ1AsaUJBQWlCO0FBQUEsTUFDbkI7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUE7QUFBQSxJQUNSLFdBQVc7QUFBQTtBQUFBLEVBQ2I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
