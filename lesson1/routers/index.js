const Router = require('koa-router')

const router = new Router()

router.use('/user', require('./user'))

router.get('/user', async (ctx, next) => {
  ctx.body = 'user'
})

module.exports = router.routes()
