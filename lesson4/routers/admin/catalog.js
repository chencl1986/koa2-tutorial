const Router = require('koa-router')
const router = new Router()
const {
  HTTP_ROOT
} = require('../../config')
const table = 'catalog_table'
const pagePath = `${HTTP_ROOT}/admin/catalog`
const fields = [ // 循环输出表单
  { title: '标题', name: 'title', type: 'text' }
]

// catalog管理
// 获取列表
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

// 添加banner
router.post('/', async (ctx, next) => {
  let {
    title
  } = ctx.request.fields // 通过koa-better-body解析的数据，定义在server.js中

  await ctx.db.query(`INSERT INTO ${table} (title) VALUES(?)`, [title]) // 将数据添加到数据库

  ctx.redirect(pagePath) // 添加成功后，重定向到banner页面
})

// 删除项目
router.get('/delete/:id/', async (ctx, next) => {
  const {
    id
  } = ctx.params // params用赖接收路由传参

  const data = await ctx.db.query(`SELECT * FROM ${table} WHERE ID=?`, [id])

  ctx.assert(data.length, 400, 'no data') // 若data.length === 0，则表示未查询到数据，此时抛出错误

  await ctx.db.query(`DELETE FROM ${table} WHERE ID=?`, [id]) // 文件删除后，删除相应的数据库数据

  ctx.redirect(pagePath)
})

// 获取详情
router.get('/get/:id', async (ctx, next) => {
  const {
    id
  } = ctx.params

  const rows = await ctx.db.query(`SELECT * FROM ${table} WHERE ID=?`, [id])

  if (!rows.length) {
    ctx.body = {
      err: 1,
      msg: 'no this data'
    }
  } else {
    ctx.body = {
      err: 0,
      msg: 'success',
      data: rows[0]
    }
  }
})

router.post('/modify/:id/', async (ctx, next) => {
  const {
    id
  } = ctx.params
  const post = ctx.request.fields
  const keys = ['title']
  const vals = []

  keys.forEach((key, index) => {
    vals.push(post[key])
  })

  // 将修改数据写入数据库。
  await ctx.db.query(`UPDATE ${table} SET ${
    keys.map((key) => {
      return `${key}=?`
    }).join(',')
  } WHERE ID=?`, [...vals, id])

  ctx.redirect(pagePath)
})

module.exports = router.routes()
