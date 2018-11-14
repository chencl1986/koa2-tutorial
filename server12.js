const Koa = require('koa')
const mysql = require('mysql')
const co = require('co-mysql')

const server = new Koa()

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

server.listen(8080)

console.log(`Server running at http://localhost:8080/`)
