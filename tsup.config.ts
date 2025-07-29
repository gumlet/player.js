import { defineConfig } from 'tsup';

export default defineConfig((options) => ( {
  entry: ['src/main.ts'],
  format: ['cjs', 'esm', 'iife'],
  sourcemap: true,
  dts: true,
  clean: true,
  minify: !options.watch,
}))
