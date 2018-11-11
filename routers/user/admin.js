const Router = require('koa-router')

const router = new Router()

router.get('/a', async (ctx, next) => {
  ctx.body = '管理员的a'
})

module.exports = router.routes()
