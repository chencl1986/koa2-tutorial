const ejs = require('ejs')

ejs.renderFile(
  './lesson2/template/1.ejs', // 文件路径
  { // 自定义属性
    name: 'lee',
    arr: [11, 22, 33]
  },
  (err, data) => { // 回到函数
    if (err) {
      console.log('渲染失败', err)
    } else {
      console.log(data)
    }
  }
)
