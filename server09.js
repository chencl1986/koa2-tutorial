const Koa = require('koa')
const body = require('koa-better-body')

const server = new Koa()

server.listen(8080)

server.use(body({
  uploadDir: './static/upload' // 将上传的文件保存在/static/upload文件夹中
}))

server.use(async (ctx) => {
  console.log(ctx.request.fields) // 请求的数据保存在ctx.request.fields中
  ctx.body = 'success'
})

console.log(`Server running at http://localhost:8080/`)
