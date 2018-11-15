const Koa = require('koa')
const Router = require('koa-router')

const server = new Koa()
const router = new Router()

router.get('/login', async (ctx, next) => {
  /* if (!ctx.query.user || !ctx.query.pass) {
    ctx.throw(400, '用户名或密码不存在')
  } else {
    ctx.body = '成功'
  } */
  ctx.assert(ctx.query.user, 400, '用户名不存在')
  ctx.assert(ctx.query.pass, 400, '密码不存在')
  ctx.body = '成功'
})

server.use(router.routes())

server.listen(8080)

console.log(`Server running at http://localhost:8080/`)
