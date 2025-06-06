import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => ({
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['three']
        }
      }
    }
  },
  plugins: [
    legacy(),
    sentryVitePlugin({
      include: './dist',
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      release: process.env.GITHUB_SHA,
      deploy: { env: mode }
    }),
    mode === 'analyze' && visualizer({ filename: 'dist/stats.html' })
  ].filter(Boolean)
}))
