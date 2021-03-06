const Router = require('koa-router')
const fs = require('await-fs')
const path = require('path')
const {
  md5,
  unlink
} = require('../../libs/common')
const {
  HTTP_ROOT,
  UPLOAD_DIR
} = require('../../config')

const router = new Router()
const table = 'banner_table'
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

// 渲染登录页面
router.get('/login', async (ctx, next) => {
  // ctx.render为koa-ejs提供用来渲染ejs模板的方法
  await ctx.render('admin/login', {
    HTTP_ROOT: ctx.config.HTTP_ROOT,
    errmsg: ctx.query.errmsg // 接受urlencoded传入的errmsg参数
  })
})

// 登录请求接口
router.post('/login', async (ctx, next) => {
  const {
    HTTP_ROOT
  } = ctx.config

  const {
    username,
    password
  } = ctx.request.fields

  let admins = JSON.parse((await fs.readFile(path.resolve(__dirname, '../../admins.json'))).toString())

  function findAdmin (username) {
    let user = ''

    admins.forEach((item, index, arr) => {
      if (item.username === username) {
        user = item
      }
    })

    return user
  }

  const admin = findAdmin(username)
  if (!admin) {
    // 请求出错时，将错误信息通过urlencoded传入页面，在get方法中，通过ctx.query接收errmsg。
    ctx.redirect(`${HTTP_ROOT}/admin/login?errmsg=${encodeURIComponent('用户不存在')}`)
  } else if (admin.password !== md5(`${password}${ctx.config.ADMIN_SUFFIX}`)) {
    ctx.redirect(`${HTTP_ROOT}/admin/login?errmsg=${encodeURIComponent('密码错误')}`)
  } else {
    // 登录后设置session，有需要可以在此处加入权限设置
    ctx.session.admin = username
    ctx.redirect(`${HTTP_ROOT}/admin/`)
  }
})

// 由于管理页面是需要管理员登陆后才可以访问，因此在此处增加校验，但校验不可在登录之前，否则无法进入登录页。
// 若有不需要权限的页面，需要在校验之前配置路由。
router.all('*', async (ctx, next) => {
  if (ctx.session.admin) {
    await next()
  } else {
    ctx.redirect(`${ctx.config.HTTP_ROOT}/admin/login?errmsg=${encodeURIComponent('请先登录')}`)
  }
})

router.get('/', async (ctx, next) => {
  ctx.redirect(`${HTTP_ROOT}/admin/banner`)
})

// banner管理
router.get('/banner', async (ctx, next) => {
  const datas = await ctx.db.query(`SELECT * FROM ${table}`)

  await ctx.render('admin/table', {
    type: 'view',
    action: `${HTTP_ROOT}/admin/banner`,
    HTTP_ROOT,
    datas,
    fields
  })
})

router.post('/banner', async (ctx, next) => {
  let {
    title,
    src,
    href,
    serial
  } = ctx.request.fields // 通过koa-better-body解析的数据，定义在server.js中

  src = path.basename(src[0].path) // 获取图片上传后地址的文件名

  await ctx.db.query(`INSERT INTO ${table} (title, src, href, serial) VALUES(?,?,?,?)`, [title, src, href, serial]) // 将数据添加到数据库

  ctx.redirect(`${HTTP_ROOT}/admin/banner`) // 添加成功后，重定向到banner页面
})

router.get('/banner/delete/:id/', async (ctx, next) => {
  const {
    id
  } = ctx.params

  const data = await ctx.db.query(`SELECT * FROM ${table} WHERE ID=?`, [id])

  ctx.assert(data.length, 400, 'no data') // 若data.length === 0，则表示未查询到数据，此时抛出错误

  const row = data[0]

  await unlink(path.resolve(UPLOAD_DIR, row.src)) // 先删除文件

  await ctx.db.query(`DELETE FROM ${table} WHERE ID=?`, [id]) // 文件删除后，删除相应的数据库数据

  ctx.redirect(`${HTTP_ROOT}/admin/banner`)
})

router.get('/banner/modify/:id/', async (ctx, next) => {
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
})

router.post('/banner/modify/:id/', async (ctx, next) => {
  ctx.body = 'ok'
})

// catlog管理
router.get('/catlog', async (ctx, next) => {
  ctx.body = 'catlog'
})

// article管理
router.get('/article', async (ctx, next) => {
  ctx.body = 'article'
})

module.exports = router.routes()
