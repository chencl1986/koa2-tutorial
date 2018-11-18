const Router = require('koa-router')

const router = new Router()

router.get('/news', async (ctx, next) => {
  ctx.body = 'news'
})

module.exports = router.routes()
