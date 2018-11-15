# koa2-tutorial
A tutorial for beginners in Koa2.

## Koa教程之一：路由、Static、Cookie、连接数据库
文章地址：[https://blog.csdn.net/chencl1986/article/details/83930672](https://blog.csdn.net/chencl1986/article/details/83930672)

## Koa与Express的区别
 1. Express是基于回调函数开发。
 2. Koa是基于Promise思想开发。
 3. Koa1基于Generator，Koa2同时支持Generator和Async/await，但使用Generator会收到警告，因为Koa3是完全基于Async/await。
 
 ## 使用Koa创建一个服务器
```
const Koa = require('koa')

const server = new Koa()  // 使用new创建一个Server

server.listen(8080) // 监听8080端口
```
## 引入Koa路由

> 请查看server01.js

与Express不同，Koa并不自带路由，需要引入koa-router模块才可以使用路由。

```
/**
 * 代码请查看：/server01.js
 */

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

server.use(router.routes()) // 使用use方法，将router中间件添加到Server中。
```
当然在项目中，我们往往会有多级路由，这时候就需要创建嵌套路由。
## 嵌套路由

> 请查看server01.js

通过路由嵌套，实现多级路由访问。
```
/**
 * 代码请查看：/server01.js
 */
 
// 嵌套路由
const router = new Router() // 创建一个主路由
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

router.use('/user', userRouter.routes()) // 将userRouter添加到主路由router中。
```
此时当浏览器访问不同路由时，显示相应内容：
|访问路径	| 显示内容 |
|--|--|
| /user | user |
| /user/company | 企业 |
| /user/company/a | 企业的a |
Koa之所以选择这样的嵌套方式，更多的原因是为了支持大型项目。在大型项目中，若采用配置JSON的方式配置路由，会因为代码量过大造成阅读困难。
当然，若采用当前的配置方式，将所有路由都配置在一个文件中，对代码阅读毫无帮助，因此我们需要将每个层级的路由都配置到单独文件中，通过互相引用模块的方式，实现路由配置。
## 模块化嵌套路由

> 请查看server02.js

先在入口js文件中，将根节点的路由添加到server中。
```
server.use(require('./routers')) // 使用根路由配置
```
在根路由的配置中，引用下级路由的配置，以此类推。
```
const Router = require('koa-router')

const router = new Router()

router.use('/user', require('./user'))

router.get('/user', async (ctx, next) => {
  ctx.body = 'user'
})

module.exports = router.routes()
```
这样，我们就完成了整个项目的路由配置。
## 路由参数

> 请查看server03.js

在Koa中，支持通过路由传参。
```
router.get('/news/:id', async (ctx, next) => {
  console.log(ctx.params) // 通过params属性获取参数
  ctx.body = `新闻ID为：${ctx.params.id}`
})
```
同时也可以进行多级传参，此时需要注意的是，只有当传入参数数量与路由数量相同时，才可以正确匹配，同时参数的顺序是固定的。
```
router.get('/news/:id1/:id2/:id3', async (ctx, next) => {
  console.log(ctx.params)
  ctx.body = `多级新闻ID为：${ctx.params.id1}/${ctx.params.id2}/${ctx.params.id3}`
})
```
假设同时匹配了两层同样的路由，则以先匹配的路由为准，后一级路由不会执行。
```
router.get('/news/:id')	// 只会执行该路由匹配。
router.get('/news/1')
```
如果希望匹配完第一级路由之后，还可以匹配第二级，则可以通过执行next()，将方法传入下一级，但因为此时next()返回值为Promise，则需要使用await。
```
// 若不执行next，则只会匹配该路由
router.get('/news/1', async (ctx, next) => {
  console.log(ctx.params) // 通过params属性获取参数
  ctx.body = `新闻ID为：固定的1`
  await next()  // 可通过next函数，执行下一级的匹配，同时因为此时next()返回值为Promise，则需要使用await。
})

router.get('/news/:id', async (ctx, next) => {
  console.log(ctx.params) // 通过params属性获取参数
  ctx.body = `新闻ID为：${ctx.params.id}`
  await next()
})

router.get('/news/:key', async (ctx, next) => {
  console.log(ctx.params) // 通过params属性获取参数
  ctx.body = `新闻ID为：${ctx.params.key}`
  await next()
})
```
## Urlencoded传参与路由传参的区别

> 请查看server03.js

Urlencoded：http://localhost:8080/news/1/2/3/user/1/2/3
路由传参：http://localhost:8080/news?id1=1&id2=2&id3=3
|Urlencoded传参| 路由传参 |
|--|--|
| 通过ctx.query获取参数 | 通过ctx.params获取参数 |
| 顺序灵活 | 顺序固定 |
| 可省略 | 不可省略 |
| 动态地址，搜索引擎会认为只是一个地址，不利于SEO | 静态地址，搜索引擎会判断为多个地址，利于SEO |
| 参数之后不可挂载路由 | 参数之后可以挂载下级路由 |
## context上下文

> 请查看server04.js

context是ctx的原型prototype，通常用来向整个项目添加全局属性或方法。
最经常的用法是添加全局数据库的连接池。
```
server.context.db = db();

server.use(async ctx => {
  console.log(ctx.db);
});
```
添加一个全局属性并打印。
```
server.context.a = 123

router.get('/', async (ctx, next) => {
  ctx.body = `abc${server.context.a}`
})
```
## ctx.throw与ctx.assert

> 请查看server05.js

ctx.throw([status], [msg], [properties])
ctx.throw方法用于向前端抛出一个错误。
```
router.get('/login', async (ctx, next) => {
  if (!ctx.query.user || !ctx.query.pass) {
    ctx.throw(400, '用户名或密码不存在')
  } else {
    ctx.body = '成功'
  }
})
```
ctx.assert(value, [status], [msg], [properties])
ctx.assert简单来说就是对throw的封装，第一个参数是触发条件。
等价于如下代码：
```
if (!value) {
  ctx.throw(code, msg)
}
```
因此前一段throw的代码可以简写为：
```
router.get('/login', async (ctx, next) => {
  ctx.assert(ctx.query.user, 400, '用户名不存在')
  ctx.assert(ctx.query.pass, 400, '密码不存在')
  ctx.body = '成功'
})
```
## ctx.redirect

> 请查看server06.js

ctx.redirect用于重定向，可重定向到站内或站外，同时会向前端传一个302状态码。
```
router.get('/google', async (ctx, next) => {
  ctx.redirect('https://www.google.com/')
})

router.get('/login', async (ctx, next) => {
  ctx.redirect('/user')
})
```
## 使用koa-static处理静态文件

> 请查看server07.js

```
const Static = require('koa-static')

server.use(Static('./static', { // 使用./static文件夹中的静态文件
  maxage: 86400 * 1000, // 告知浏览器缓存时间
  index: '1.html' // 当黄文根路由时，默认渲染的文件，前提是路由未匹配根路由
}))
```
## 根据路由处理静态文件

> 请查看server08.js

在项目开发中批量处理静态文件，可以使用路由匹配不同的文件类型，通过koa-static处理并添加不同缓存时间等参数。

```
const staticRouter = new Router()

staticRouter.all(/(\.jpg|\.png|\.gif)/, Static('./static', {
  maxage: 60 * 86400 * 1000
}))

staticRouter.all(/(\.css)/, Static('./static', {
  maxage: 1 * 86400 * 1000
}))

staticRouter.all(/(\.html|\.htm|\.shtml)/, Static('./static', {
  maxage: 20 * 86400 * 1000
}))

staticRouter.all(/(\.js|\.jsx)/, Static('./static', {
  maxage: 1 * 86400 * 1000
}))

staticRouter.all('*', Static('./static', {
  maxage: 30 * 86400 * 1000
}))

server.use(staticRouter.routes())
```
## koa-better-body中间件

> 请查看server09.js

koa-better-body中间件是用来解析post请求，包括数据和文件。
[https://github.com/tunnckoCoreLabs/koa-better-body](https://github.com/tunnckoCoreLabs/koa-better-body)
新建一个post.html，用来上传表单：
```
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <form action="http://localhost:8080/upload" method="post" enctype="multipart/form-data">
      名字：<input type="text" name="user" /><br>
      头像：<input type="file" name="f1" /><br>
      <input type="submit" value="提交">
    </form>
  </body>
</html>
```
引入koa-better-body中间件获取传入的数据。
```
const body = require('koa-better-body')

server.use(body({
  uploadDir: './static/upload' // 将上传的文件保存在/static/upload文件夹中
}))

server.use(async (ctx) => {
  console.log(ctx.request.fields) // 请求的数据保存在ctx.request.fields中
  ctx.body = 'success'
})
```
表单提交后，服务端就可以接收到相应的user和文件数据如下：
![koa-better-body解析的请求结果](https://img-blog.csdnimg.cn/20181114125953576.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2NoZW5jbDE5ODY=,size_16,color_FFFFFF,t_70)

## cookie的使用

> 请查看server10.js

在Koa中，cookie为框架自带属性，不需要引入中间件。
ctx.cookies.set(name, value, [options])
```
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
```
## session的使用
使用session需要引入koa-session库。
> 请查看server11.js

```
const session = require('koa-session')

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
```
## 连接数据库
使用mysql和co-mysql库对数据库进行操作。
[https://github.com/mysqljs/mysql](https://github.com/mysqljs/mysql)
[https://github.com/coderhaoxin/co-mysql](https://github.com/coderhaoxin/co-mysql)

> 请查看server12.js

```
const mysql = require('mysql')
const co = require('co-mysql')

const conn = mysql.createPool({ // 创建一个数据库的连接池
  host: 'localhost',
  user: 'root',
  password: '',
  database: '20181101'
})

const db = co(conn) // 创建一个异步数据库链接

server.context.db = db // 全局保存数据库的连接池

server.use(async (ctx, next) => {
  const data = await ctx.db.query('SELECT * FROM item_table') // 通过SQL语句查询item_table表

  ctx.body = data // 前台打印结果为：[{"ID":1,"title":"测试","price":19.8,"count":298},{"ID":2,"title":"item1","price":19.8,"count":200}]
})
```
当然通常在项目中，可以将数据库的链接封装成一个模块。

> 请查看server13.js和./libs/database.js

## 错误处理
可以在代码最前执行一个空的server.use或在匹配所有路由时，进行一次try catch，用于全局处理错误，以免有时漏写了错误处理。

```
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
  try {
    await next()
  } catch (error) {
    console.log(error)
    ctx.body = '路由错误'
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
```
