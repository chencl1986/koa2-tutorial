const Koa = require('koa')
const Router = require('koa-router')
const Static = require('koa-static')

const server = new Koa()
const router = new Router()

router.get('/login', async (ctx, next) => {
  ctx.body = `login`
})

server.use(router.routes())

const staticRouter = new Router()

staticRouter.all(/(\.jpg|\.png|\.gif)/, Static('./static', {
  maxage: 60 * 86400 * 1000
}))

staticRouter.all(/(\.css)/, Static('./static', {
  maxage: 1 * 86400 * 1000
}))

staticRouter.all(/(\.html|\.htm|\.shtml)/, Static('./static', {
  maxage: 20 * 86400 * 1000
}))

staticRouter.all(/(\.js|\.jsx)/, Static('./static', {
  maxage: 1 * 86400 * 1000
}))

staticRouter.all('*', Static('./static', {
  maxage: 30 * 86400 * 1000
}))

server.use(staticRouter.routes())

server.listen(8080)

console.log(`Server running at http://localhost:8080/`)
