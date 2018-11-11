const Koa = require('koa')
const Router = require('koa-router')

const server = new Koa() // 使用new创建一个Server

server.listen(8080) // 监听8080端口

const router = new Router()

// router常用方法有get（匹配get请求）、post（匹配post请求）、all（匹配所有请求）

// ctx为上下文对象，其中包括原生nodejs包含的request/response对象，分别为ctx.req/ctx.res。
// next函数被调用时，会暂停该中间件的运行，并将控制传递给下一个中间件。
// 判断以get方法请求的路由
router.get('/a', async (ctx, next) => {
  console.log(ctx)
  ctx.body = 'aaa' // 通过body属性向前台传输数据
  ctx.body += 'bbb' // body属性的值可以添加或替换，与普通对象的属性相同。
})

// 嵌套路由
const userRouter = new Router() // 创建一个路由
const companyRouter = new Router()

companyRouter.get('/a', async (ctx, next) => { // 匹配路由后将输出相应内容
  ctx.body = '企业的a'
})

userRouter.use('/company', companyRouter.routes()) // 将company路由添加到父级，表示当访问/company的子路由时，匹配company下的路由。

userRouter.get('/', async (ctx, next) => {
  ctx.body = 'user'
})

userRouter.get('/company', async (ctx, next) => {
  ctx.body = '企业'
})

const admin = new Router()

admin.get('/a', async (ctx, next) => {
  ctx.body = '管理员的a'
})

userRouter.use('/admin', admin.routes())

router.use('/user', userRouter.routes()) // 将userRouter添加到主路由router中。

server.use(router.routes()) // 使用use方法，将router中间件添加到Server中。
