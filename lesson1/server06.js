const Koa = require('koa')
const Router = require('koa-router')

const server = new Koa()
const router = new Router()

router.get('/google', async (ctx, next) => {
  ctx.redirect('https://www.google.com/')
})

router.get('/login', async (ctx, next) => {
  ctx.redirect('/user')
})

router.get('/user', async (ctx, next) => {
  ctx.body = 'user'
})

server.use(router.routes())

server.listen(8080)

console.log(`Server running at http://localhost:8080/`)
