import createApp from './app'

(async () => {
  
  const { app, router } = await createApp({
    ssr: false
  })
  
  router.isReady().then(() => {
    app.mount('#app')
  })
  
})()
