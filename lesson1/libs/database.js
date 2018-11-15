const mysql = require('mysql')
const co = require('co-mysql')

const conn = mysql.createPool({ // 创建一个数据库的连接池
  host: 'localhost',
  user: 'root',
  password: '',
  database: '20181101'
})

const db = co(conn) // 创建一个异步数据库链接

module.exports = db // 将数据库链接导出
