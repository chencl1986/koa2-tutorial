const Router = require('koa-router')

const router = new Router()
const {
  HTTP_ROOT
} = require('../../config')

router.get('/', async (ctx, next) => {
  const banners = await ctx.db.query(`SELECT * FROM banner_table ORDER BY serial ASC`, [])
  const catalogs = await ctx.db.query(`SELECT * FROM catalog_table`, [])
  const articles = await ctx.db.query(`SELECT * FROM article_table`, [])

  await ctx.render('www/index', {
    HTTP_ROOT,
    banners,
    catalogs,
    articles
  })
})

router.get('/list/:id', async (ctx, next) => {
  await ctx.render('www/list', {
    HTTP_ROOT
  })
})

module.exports = router.routes()
