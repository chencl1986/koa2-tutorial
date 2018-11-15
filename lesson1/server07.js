const Koa = require('koa')
const Router = require('koa-router')
const Static = require('koa-static')

const server = new Koa()
const router = new Router()

router.get('/login', async (ctx, next) => {
  ctx.body = `login`
})

server.use(router.routes())

server.use(Static('./static', { // 使用./static文件夹中的静态文件
  maxage: 86400 * 1000, // 告知浏览器缓存时间
  index: '1.html' // 当黄文根路由时，默认渲染的文件，前提是路由未匹配根路由
}))

server.listen(8080)

console.log(`Server running at http://localhost:8080/`)
