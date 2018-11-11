const Router = require('koa-router')

const router = new Router()

router.get('/', async (ctx, next) => { // 匹配路由后将输出相应内容
  ctx.body = '企业'
})

router.get('/a', async (ctx, next) => { // 匹配路由后将输出相应内容
  ctx.body = '企业的a'
})

module.exports = router.routes()
