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

// 通过路由使用静态文件时，表示路由直接接受访问，所以需要用all方法。
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

// '' 空字符串代表根路由
// '*' 字符串*代表匹配所有路由
staticRouter.all('*', Static('./static', {
  maxage: 30 * 86400 * 1000
}))

server.use(staticRouter.routes())

server.listen(8080)

console.log(`Server running at http://localhost:8080/`)
