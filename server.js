const { createServer } = require('http')
const { join } = require('path')
const { parse } = require('url')
const next = require('next')
const micro = require('micro')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = micro((req, res) => {
      if (req.headers.host === 'web-cinema-stg.truemoney.net') {
        app.setAssetPrefix('http://web-cinema-stg.truemoney.net/Home')
      } else {
        app.setAssetPrefix('')
      }
      handle(req, res)
    })

    server.listen(3000, () => {
      console.log(`> Ready on https://localhost:${3000}`)
    })

    createServer((req, res) => {
      const parsedUrl = parse(req.url, true)
      const { pathname } = parsedUrl
      if (pathname === '/service-worker.js') {
        const filePath = join(__dirname, '.next', pathname)
        app.serveStatic(req, res, filePath)
      } else {
        handle(req, res, parsedUrl)
      }
    })
  })



