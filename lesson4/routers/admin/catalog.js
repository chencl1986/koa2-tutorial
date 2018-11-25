const Router = require('koa-router')
const path = require('path')
const router = new Router()
const {
  unlink
} = require('../../libs/common')
const {
  HTTP_ROOT,
  UPLOAD_DIR
} = require('../../config')
const table = 'catalog_table'
const pagePath = `${HTTP_ROOT}/admin/catalog`
const fields = [ // 循环输出表单
  {
    title: '标题',
    name: 'title',
    type: 'text'
  }
]

// catalog管理
router.get('/', async (ctx, next) => { // 注意根路由要加/
  const datas = await ctx.db.query(`SELECT * FROM ${table}`)

  await ctx.render('admin/table', {
    action: pagePath,
    HTTP_ROOT,
    page_types: {
      banner: 'banner管理',
      catalog: '类目管理',
      article: '文章管理'
    },
    page_type: 'catalog',
    datas,
    fields
  })
})

module.exports = router.routes()
