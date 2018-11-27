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
const table = 'article_table'
const pagePath = `${HTTP_ROOT}/admin/article`
const pageType = 'banner'
const fields = [ // 循环输出表单
  { title: '标题', name: 'title', type: 'text' },
  { title: '类目', name: 'catalog_ID', type: 'select' },
  { title: '时间', name: 'created_time', type: 'date' },
  { title: '作者', name: 'author', type: 'text' },
  { title: '浏览', name: 'view', type: 'number' },
  { title: '评论', name: 'comment', type: 'number' },
  { title: '摘要', name: 'summary', type: 'text' },
  { title: '列表图', name: 'list_img_src', type: 'file' },
  { title: 'banner图', name: 'banner_img_src', type: 'file' },
  { title: '内容', name: 'content', type: 'textarea' }
]

// article管理
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
    page_type: 'article',
    datas,
    fields
  })
})

module.exports = router.routes()
