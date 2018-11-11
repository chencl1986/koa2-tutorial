const Koa = require('koa')

const server = new Koa()

server.listen(8080)

server.use(require('./routers'))
