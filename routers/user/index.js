const Router = require('koa-router')

const router = new Router()

router.use('/admin', require('./admin'))
router.use('/company', require('./company'))

// router.get('/company', async (ctx, next) => {  // 也可以直接匹配在下一集的根路由上。
//   ctx.body = '企业'
// })

router.get('/admin', async (ctx, next) => {
  ctx.body = '管理员'
})

module.exports = router.routes()
