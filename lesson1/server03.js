const Koa = require('koa')
const Router = require('koa-router')

const router = new Router()

const server = new Koa()

server.listen(8080)

// 若不执行next，则只会匹配该路由
router.get('/news/1', async (ctx, next) => {
  console.log(ctx.params) // 通过params属性获取参数
  ctx.body = `新闻ID为：固定的1`
  await next() // 可通过next函数，执行下一级的匹配，同时因为此时next()返回值为Promise，则需要使用await。
})

router.get('/news/:id', async (ctx, next) => {
  console.log(ctx.params) // 通过params属性获取参数
  ctx.body = `新闻ID为：${ctx.params.id}`
  await next()
})

router.get('/news/:key', async (ctx, next) => {
  console.log(ctx.params) // 通过params属性获取参数
  ctx.body = `新闻ID为：${ctx.params.key}`
  await next()
})

router.get('/news/:id1/:id2/:id3', async (ctx, next) => {
  console.log(ctx.params)
  ctx.body = `多级新闻ID为：${ctx.params.id1}/${ctx.params.id2}/${ctx.params.id3}`
})

server.use(router.routes())

console.log(`Server running at http://localhost:8080/`)
