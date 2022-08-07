import path from 'path'
import { defineConfig } from 'vite'
import vuePlugin from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import graphql from '@rollup/plugin-graphql'

const base = '/'

export default defineConfig(({ command, ssrBuild }) => ({
  base,
  plugins: [
    vuePlugin(),
    vueJsx(),
    graphql()
  ],
  experimental: {
    renderBuiltUrl(filename, { hostType, type, ssr }) {
      if (ssr && type === 'asset' && hostType === 'js') {
        return {
          runtime: `__ssr_vue_processAssetPath(${JSON.stringify(filename)})`
        }
      }
    }
  },
  build: {
    minify: false
  },
  server: {
    host: '0.0.0.0',
    port: 8080
  }
}))
