// @ts-check
const fs = require('fs')
const path = require('path')
const express = require('express')

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD

async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production'
) {
  
  const resolve = (p) => path.resolve(__dirname, p)

  const indexProd = isProd
    ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
    : ''

  const manifest = isProd
    ? // @ts-ignore
      require('./dist/client/ssr-manifest.json')
    : {}

  const appContext = {}
  
  const app = express()

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use('/favicon.ico', express.static(__dirname + '/public/favicon.ico'))
  
  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite
  if (!isProd) {
    vite = await require('vite').createServer({
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: true,
        watch: {
          usePolling: false,
          interval: 100
        }
      },
      appType: 'custom'
    })
    // use vite's connect instance as middleware
    app.use(vite.middlewares)
  } else {
    app.use(require('compression')())
    app.use(
      require('serve-static')(resolve('dist/client'), {
        index: false
      })
    )
  }

  app.use('*', async (req, res) => {
    
    const url = req.originalUrl
    
    let template = fs.readFileSync(resolve('index.html'), 'utf-8')
    template = await vite.transformIndexHtml(url, template)
    
    const render = (await vite.ssrLoadModule('/src/entry-server.ts')).render
    
    const [appHtml, ssr] = await render(url, appContext)
    
    const urqlState = ssr.extractData()
    const urqlStateString = JSON.stringify(urqlState)
    
    const renderState = `
      <script>
        window.__URQL_DATA__ = ${urqlStateString}
      </script>`
    
    const html = template.replace(`<!--app-html-->`, appHtml + renderState)
    
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)

  })

  return { app, vite }
}

createServer().then(({ app }) =>
  app.listen(80, () => {
    console.log('server started.')
  })
)
