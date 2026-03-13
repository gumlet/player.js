import { defineConfig } from 'tsdown';

export default defineConfig((options) => ( {
  entry: ['src/main.ts'],
  format: ['cjs', 'esm', 'iife'],
  sourcemap: true,
  dts: true,
  clean: true,
  outputOptions: {
    name: 'playerjs',
  },
  minify: !options.watch,
}))
