const Router = require('koa-router')
const router = new Router()
const path = require('path')
const {
  HTTP_ROOT
} = require('../../config')
const table = 'catalog_table'
const pagePath = `${HTTP_ROOT}/admin/catalog`
const pageType = 'catalog'
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
    page_type: pageType,
    datas,
    fields
  })
})

// 添加项目
router.post('/', async (ctx, next) => {
  let keys = [] // 存储表单的字段
  let vals = [] // 存储数据库中相应字段的值

  fields.forEach(({ name, type }, index) => {
    keys.push(name) // 存储表单字段

    if (type === 'file') {
      vals.push(path.basename(ctx.request.fields[name][0].path)) // 从提交的表单中读取文件名
    } else {
      vals.push(ctx.request.fields[name]) // 从提交的表单中读取相应字段的值
    }
  })

  await ctx.db.query(`INSERT INTO ${table} (${keys.join(',')}) VALUES(${new Array(keys.length).fill('?').join(',')})`, vals) // 将数据添加到数据库

  ctx.redirect(pagePath) // 添加成功后，重定向到banner页面
})

// 删除项目
router.get('/delete/:id/', async (ctx, next) => {
  const {
    id
  } = ctx.params // params用赖接收路由传参

  const data = await ctx.db.query(`SELECT * FROM ${table} WHERE ID=?`, [id])

  ctx.assert(data.length, 400, 'no data') // 若data.length === 0，则表示未查询到数据，此时抛出错误

  const row = data[0]

  fields.forEach(async ({ name, type }, index) => {
    if (type === 'file') {
      await unlink(path.resolve(UPLOAD_DIR, row[name])) // 先删除文件
    }
  })

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
