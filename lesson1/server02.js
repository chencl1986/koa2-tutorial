const Koa = require('koa')

const server = new Koa()

server.listen(8080)

server.use(require('./routers')) // 使用根路由配置

console.log(`Server running at http://localhost:8080/`)
