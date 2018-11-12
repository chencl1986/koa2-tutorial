const Koa = require('koa')
const Router = require('koa-router')

const server = new Koa()
const router = new Router()

server.context.a = 123

router.get('/', async (ctx, next) => {
  ctx.body = `abc${server.context.a}`
})

server.use(router.routes())

server.listen(8080)

console.log(`Server running at http://localhost:8080/`)
