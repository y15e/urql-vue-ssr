// Vue
import { createSSRApp, h } from 'vue'
import createRouter from './router'
import App from './components/App.vue'

// urql
import { provideClient } from '@urql/vue'
import { createUrqlClient } from './urql'
import { Provider } from '@urql/core'

async function createApp(context: any) {

  // urql
  const { urqlClient, ssr } = await createUrqlClient(context)
  context.urqlClient = urqlClient

  // Router
  const router = await createRouter(context)
  
  // App
  const app = createSSRApp({
    setup () {
      provideClient(urqlClient)
    },
    render: () => h(App)    
  })
  app.use(router)
  
  return {
    app,
    router,
    urqlClient,
    ssr
  }
}

export default createApp