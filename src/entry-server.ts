import { renderToString } from 'vue/server-renderer'
import createApp from './app'

export async function render(url, context) {
  
  const { app, router, urqlClient, ssr } = await createApp({
    ssr: true,
    ...context
  })
  
  router.push(url)
  
  await router.isReady()

  const ctx = {}
  const html = await renderToString(app, ctx)

  return [ html, ssr ]
}
