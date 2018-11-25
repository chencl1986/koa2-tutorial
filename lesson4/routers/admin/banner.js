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
const table = 'banner_table'
const bannerPath = `${HTTP_ROOT}/admin/banner`
const fields = [ // 循环输出表单
  {
    title: '标题',
    name: 'title',
    type: 'text'
  },
  {
    title: '图片',
    name: 'src',
    type: 'file'
  },
  {
    title: '链接',
    name: 'href',
    type: 'text'
  },
  {
    title: '序号',
    name: 'serial',
    type: 'number'
  }
]

// banner管理
router.get('/', async (ctx, next) => { // 注意根路由要加/
  const datas = await ctx.db.query(`SELECT * FROM ${table}`)

  await ctx.render('admin/table', {
    type: 'view',
    action: bannerPath,
    HTTP_ROOT,
    page_type: 'banner',
    datas,
    fields
  })
})

router.post('/', async (ctx, next) => {
  let {
    title,
    src,
    href,
    serial
  } = ctx.request.fields // 通过koa-better-body解析的数据，定义在server.js中

  src = path.basename(src[0].path) // 获取图片上传后地址的文件名

  await ctx.db.query(`INSERT INTO ${table} (title, src, href, serial) VALUES(?,?,?,?)`, [title, src, href, serial]) // 将数据添加到数据库

  ctx.redirect(bannerPath) // 添加成功后，重定向到banner页面
})

router.get('/delete/:id/', async (ctx, next) => {
  const {
    id
  } = ctx.params // params用赖接收路由传参

  const data = await ctx.db.query(`SELECT * FROM ${table} WHERE ID=?`, [id])

  ctx.assert(data.length, 400, 'no data') // 若data.length === 0，则表示未查询到数据，此时抛出错误

  const row = data[0]

  await unlink(path.resolve(UPLOAD_DIR, row.src)) // 先删除文件

  await ctx.db.query(`DELETE FROM ${table} WHERE ID=?`, [id]) // 文件删除后，删除相应的数据库数据

  ctx.redirect(bannerPath)
})

/* router.get('/modify/:id/', async (ctx, next) => {
  const {
    id
  } = ctx.params

  const data = await ctx.db.query(`SELECT * FROM ${table} WHERE ID=?`, [id])

  ctx.assert(data.length, 400, 'no data')

  const row = data[0]

  await ctx.render('admin/table', {
    HTTP_ROOT,
    type: 'modify',
    old_data: row,
    fields,
    action: `${HTTP_ROOT}/admin/banner/modify/${id}`
  })
}) */

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
  const keys = ['title', 'href', 'serial']
  const vals = []

  // 获取原文件地址，供删除功能使用
  let rows = await ctx.db.query(`SELECT src FROM ${table} WHERE ID=?`, [id])

  ctx.assert(rows.length, 400, 'no this data')

  const oldSrc = rows[0].src

  keys.forEach((key, index) => {
    vals.push(post[key])
  })

  // 单独处理文件，若有上传文件才插入文件名。
  let srcChanged = false // 判断是否修改文件
    ; (post.src && post.src.length && post.src[0].size) && (srcChanged = true)
  if (srcChanged) { // 不同库返回的src，即文件属性，在无上传文件时，数据格式不同。此处做了兼容，判断不同库都有上传文件的情况。
    keys.push('src')
    vals.push(path.basename(post.src[0].path))
  }

  // 将修改数据写入数据库。
  await ctx.db.query(`UPDATE ${table} SET ${
    keys.map((key) => {
      return `${key}=?`
    }).join(',')
  } WHERE ID=?`, [...vals, id])

  // 如果文件已修改，则删除原文件，或者将文件转移到临时文件夹，定期清理。
  if (srcChanged) {
    unlink(path.resolve(UPLOAD_DIR, oldSrc))
  }

  ctx.redirect(bannerPath)
})

module.exports = router.routes()
