import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['./src/main.js'],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  outfile: 'dist/player.min.js',
  treeShaking: false,
  format: 'esm'
})
