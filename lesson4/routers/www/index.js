const Router = require('koa-router')

const router = new Router()
const table = 'banner_table'
const {
  HTTP_ROOT
} = require('../../config')

router.get('/', async (ctx, next) => {
  const banners = await ctx.db.query(`SELECT * FROM ${table} ORDER BY serial ASC`, [])

  await ctx.render('www/index', {
    HTTP_ROOT,
    banners,
    catalogs: []
  })
})

module.exports = router.routes()
