const Router = require('koa-router')

const router = new Router()
const {
  HTTP_ROOT
} = require('../../config')

router.get('/', async (ctx, next) => {
  const banners = await ctx.db.query(`SELECT * FROM banner_table ORDER BY serial ASC`, [])
  const catalogs = await ctx.db.query(`SELECT * FROM catalog_table`, [])
  const articles = await ctx.db.query(`
    SELECT 
    *, 
    article_table.title AS article_title, 
    article_table.ID AS article_ID, 
    catalog_table.title AS catalog_title
    FROM article_table 
    LEFT JOIN catalog_table ON article_table.catalog_ID=catalog_table.ID
    ORDER BY created_time DESC LIMIT 10
  `, [])

  articles.forEach((article, index) => {
    const oDate = new Date(article.created_time * 1000)

    article.created_time = `${oDate.getFullYear()}-${oDate.getMonth() + 1}-${oDate.getDate()}`
  })

  await ctx.render('www/index', {
    HTTP_ROOT,
    banners,
    catalogs,
    articles
  })
})

router.get('/list/:id', async (ctx, next) => {
  const {
    id
  } = ctx.params

  const rows = await ctx.db.query(`SELECT * FROM catalog_table WHERE ID=?`, [id])
  const articles = await ctx.db.query(`
    SELECT 
    *, 
    article_table.title AS article_title, 
    article_table.ID AS article_ID, 
    catalog_table.title AS catalog_title
    FROM article_table 
    LEFT JOIN catalog_table ON 
    article_table.catalog_ID=catalog_table.ID
    WHERE article_table.catalog_ID=?
    ORDER BY created_time DESC LIMIT 10
  `, [id])

  articles.forEach((article, index) => {
    let oDate = new Date(article.created_time * 1000)

    article.created_time = `${oDate.getFullYear()}-${oDate.getMonth() + 1}-${oDate.getDate()}`
  })

  await ctx.render('www/list', {
    HTTP_ROOT,
    catalog_title: rows[0].title,
    articles
  })
})

router.get('/article/:id', async (ctx, next) => {
  const {
    id
  } = ctx.params
  const rows = await ctx.db.query(`SELECT * FROM article_table WHERE ID=?`, [id])
  const article = rows[0]
  const oDate = new Date(article.created_time * 1000)

  article.created_time = `${oDate.getFullYear()}-${oDate.getMonth() + 1}-${oDate.getDate()}`

  await ctx.render('www/article', {
    HTTP_ROOT,
    article
  })
})

module.exports = router.routes()
