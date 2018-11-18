const Koa = require('koa')
const Router = require('koa-router')
const Static = require('./routers/static')
const body = require('koa-better-body')
const path = require('path')
const session = require('koa-session')
const fs = require('fs')
const db = require(path.resolve(__dirname, './libs/database'))
const ejs = require('koa-ejs')

// 实例化Koa
const server = new Koa()
server.listen(8080)

// 中间件
server.use(body({
  uploadDir: path.resolve(__dirname, './static/upload')
}))

// 从已生成的keys文件中读取keys，并设置
server.keys = fs.readFileSync(path.resolve(__dirname, './.keys')).toString().split('\n')

// 使用session
server.use(session({
  maxAge: 20 * 60 * 1000,
  renew: true
}, server))

// 数据库
server.context.db = db

// 模板引擎渲染
ejs(server, {
  root: path.resolve(__dirname, './template'),
  layout: false,
  viewExt: 'ejs',
  cache: false,
  debug: false
})

// 路由配置
const router = new Router()

// 统一处理错误
router.use(async (ctx, next) => {
  try {
    await next()
    // 代码运行到此处，代表请求正常，可进行一些处理。
  } catch (error) {
    console.log(error)
    ctx.throw(500, 'Internal Server Error')
  }
})

router.use('/admin', require('./routers/admin'))

router.use('/api', require('./routers/api'))

// 此时require('./user')实际为router.routes()，为一个中间件，需要使用router.use
router.use('', require('./routers/www'))

// 使用路由处理静态文件
Static(router, {
  html: 1 // 自定义缓存时间
})

server.use(router.routes())

console.log(`Server running at http://localhost:8080/`)
