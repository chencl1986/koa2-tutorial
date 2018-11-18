const Koa = require('koa')
const ejs = require('koa-ejs')
const path = require('path')

const server = new Koa()

server.listen(8080)

// ejs中间件比较特殊，并不需要使用server.use引入，而是包裹server
ejs(
  server,
  { // ejs配置项
    root: path.resolve(__dirname, './render/template/'), // 处理的文件目录
    layout: false, // 不需要模板文件夹，若需要设置，则参数为文件夹路径，表示所有模板文件都放置在该文件夹中。
    viewExt: 'ejs', // 模板文件扩展名
    cache: false, // 缓存设置，开发模式时设置关闭缓存，若存在缓存会影响调试。该缓存指的是服务端的缓存，设置缓存则不会重新读取模板文件。
    debug: false // 关闭debug模式，开启则会在控制台输出ejs模板文件的便以结果
  }
)

// 渲染ejs文件
server.use(async (ctx, next) => {
  await ctx.render( // render是一个异步操作
    '1', // 渲染的文件路径
    { // 自定义属性
      name: 'render test',
      arr: [11, 22, 33, 44, 55]
    }
  )
})

console.log(`Server running at http://localhost:8080/`)
