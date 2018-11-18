const Router = require('koa-router')

const router = new Router()

// 此时require('./user')实际为router.routes()，为一个中间件，需要使用router.use
router.use('/user', require('./user'))

router.get('/user', async (ctx, next) => {
  ctx.body = 'user'
})

module.exports = router.routes()
