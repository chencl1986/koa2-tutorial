const Koa = require('koa')
const session = require('koa-session')

const server = new Koa()

server.keys = [ // 设置该属性后，则会为cookie添加签名
  'afladjfaj;sdjfa;fjds;',
  'dagrhgheroggdsjfahwir',
  'jsdafdfjdalj;shghreohgegr'
]

server.use(session({
  key: 'session', // 修改session的名字，默认为koa:sess
  maxAge: 20 * 60 * 1000, // session有效期
  renew: true // 开启自动续期
}, server)) // session方法需要传入server的实例，主要为了获取server.keys

server.use(async (ctx, next) => {
  if (!ctx.session.view) {
    ctx.session.view = 0
  }

  ctx.session.view++

  ctx.body = `欢迎您第${ctx.session.view}次来访。`
})

server.listen(8080)

console.log(`Server running at http://localhost:8080/`)
