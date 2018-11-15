const Koa = require('koa')
const Router = require('koa-router')
const server = new Koa()

server.context.db = require('./libs/database') // 全局保存数据库的连接池

server.use(async (ctx, next) => { // 若在两个server.use中都有错误处理，则谁在前谁被catch
  try {
    await next()
  } catch (error) {
    ctx.status = 500
    ctx.body = '服务器内部错误'
  }
})

server.use(async (ctx, next) => {
  try {
    const data = await ctx.db.query('SELECT * FROM itesdfafm_table') // 通过SQL语句查询item_table表
    ctx.body = data // 前台打印结果为：[{"ID":1,"title":"测试","price":19.8,"count":298},{"ID":2,"title":"item1","price":19.8,"count":200}]
  } catch (error) {
    console.log(error)
    ctx.throw(500, 'database error')
  }
})

const router = new Router()

router.all('*', async (ctx, next) => { // 匹配所有路由时的错误处理，在之后的路由中，若没有try catch，则会触发此处的try catch，而此时不会触发最外层server.use中的catch
  if (ctx.session.admin) { // 也可以在全局加一些判断进行处理
    try {
      await next()
    } catch (error) {
      console.log(error)
      ctx.body = '路由错误'
    }
  } else {
    ctx.status = 500
    ctx.body = '你不是管理员'
  }
})

router.get('/a', async (ctx, next) => {
  try {
    ctx.body = test.test
  } catch (error) {
    console.log(error)
    ctx.body = '/a错误'
  }
})

server.use(router.routes())

server.listen(8080)

console.log(`Server running at http://localhost:8080/`)
