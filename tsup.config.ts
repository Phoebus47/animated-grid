import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['react', 'react-dom'],
  banner: {
    js: `/**
 * AnimatedGrid - Production-ready animated background grid for React
 * @license MIT
 * @author Thanakrit Thanyawatsakul
 */`,
  },
});
