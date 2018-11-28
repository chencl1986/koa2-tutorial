const Router = require('koa-router')
const path = require('path')
const {
  unlink
} = require('./common')
const {
  HTTP_ROOT,
  UPLOAD_DIR
} = require('../config')

module.exports = function (table, pageType, pagePath, fields) {
  const router = new Router() // router的实例化必须在function中，因为每次导出的router都不同，否则会出现互相覆盖。

  // 获取列表
  router.get('/', async (ctx, next) => { // 注意根路由要加/
    const datas = await ctx.db.query(`SELECT * FROM ${table}`)

    fields.forEach(async (field, index) => {
      if (field.type === 'select') {
        field.items = await ctx.db.query(field.from)
      }
    })

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
    const post = ctx.request.fields
    let keys = [] // 存储表单的字段
    let vals = [] // 存储数据库中相应字段的值

    fields.forEach((field, index) => {
      const {
        name,
        type
      } = field

      keys.push(name) // 存储表单字段

      if (type === 'file') {
        if (post[name] && post[name].length && post[name][0].size) {
          vals.push(path.basename(ctx.request.fields[name][0].path)) // 从提交的表单中读取文件名
        }
      } else if (type === 'date') {
        vals.push(Math.floor(new Date(post[name]).getTime() / 1000))
      } else {
        vals.push(post[name]) // 从提交的表单中读取相应字段的值
      }
    })

    console.log(vals)
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

  // 修改详情
  router.post('/modify/:id/', async (ctx, next) => {
    const {
      id
    } = ctx.params
    const post = ctx.request.fields

    // 获取原文件地址，供删除功能使用
    let rows = await ctx.db.query(`SELECT * FROM ${table} WHERE ID=?`, [id])

    ctx.assert(rows.length, 400, 'no this data')

    let paths = {}
    fields.forEach(({ name, type }, index) => {
      if (type === 'file') {
        paths[name] = rows[0][name]
      }
    })

    const keys = []
    const vals = []
    let srcChanged = {} // 判断是否修改文件

    fields.forEach(({ name, type }, index) => {
      if (type === 'file') {
        if (post[name] && post[name].length && post[name][0].size) {
          srcChanged[name] = true
          keys.push(name)
          vals.push(path.basename(post[name][0].path))
        }
      } else if (type === 'date') {
        keys.push(name)
        vals.push(Math.floor(new Date(post[name]).getTime() / 1000))
      } else {
        keys.push(name)
        vals.push(post[name])
      }
    })

    // 将修改数据写入数据库。
    await ctx.db.query(`UPDATE ${table} SET ${
      keys.map((key) => {
        return `${key}=?`
      }).join(',')
    } WHERE ID=?`, [...vals, id])

    // 如果文件已修改，则删除原文件，或者将文件转移到临时文件夹，定期清理。
    fields.forEach(async ({ name, type }, index) => {
      if (type === 'file' && srcChanged[name]) {
        await unlink(path.resolve(UPLOAD_DIR, paths[name]))
      }
    })

    ctx.redirect(pagePath)
  })

  return router.routes()
}
