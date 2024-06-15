const { build } = require("esbuild");

build({
  entryPoints: ["src/index.ts"],
  outdir: "dist",
  bundle: true,
  minify: true,
  platform: "node", // or 'browser' or 'neutral'
  format: "esm", // or 'cjs' or 'iife'
  target: "es2022",
  sourcemap: true,
}).catch(() => process.exit(1));
