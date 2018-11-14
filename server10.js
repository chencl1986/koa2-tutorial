const Koa = require('koa')

const server = new Koa()

server.keys = [ // 设置该属性后，则会为cookie添加签名
  'afladjfaj;sdjfa;fjds;',
  'dagrhgheroggdsjfahwir',
  'jsdafdfjdalj;shghreohgegr'
]

server.use(async (ctx, next) => {
  // ctx.cookies.set('user', 'lee', { // 设置cookie
  //   maxAge: 14 * 86400 * 1000
  // })

  ctx.cookies.set('age', '18', { // 设置cookie
    maxAge: 14 * 86400 * 1000,
    signed: false // signed属性为true时会添加签名，默认为true
  })

  console.log(ctx.cookies.get('user')) // 获取签名cookie时，若不传signed: true，则不会校验其有效性
  console.log(ctx.cookies.get('user', { // 开启校验时，若cookie被修改，则会读取到undefined
    signed: true
  }))
  console.log(ctx.cookies.get('age'))
})

server.listen(8080)

console.log(`Server running at http://localhost:8080/`)
