const Router = require('koa-router')
const fs = require('await-fs')
const path = require('path')

const router = new Router()

router.get('/login', async (ctx, next) => {
  // ctx.render为koa-ejs提供用来渲染ejs模板的方法
  await ctx.render('admin/login')
})

router.post('/login', async (ctx, next) => {
  const {
    user,
    pass
  } = ctx.request.fields

  let admins = JSON.parse((await fs.readFile(path.resolve(__dirname, '../../admins.json'))).toString())

  ctx.body = admins
})

module.exports = router.routes()
