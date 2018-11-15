const pug = require('pug')

pug.renderFile(
  './lesson2/template/1.pug', // 文件路径
  { // 配置参数
    pretty: true, // 美化html
    title: '标题', // 自定义数据
    users: [
      {
        name: 'lee',
        age: 18
      },
      {
        name: 'chen',
        age: 19
      },
      {
        name: '666',
        age: 20
      }
    ]
  },
  (err, data) => {
    if (err) {
      console.log('渲染失败', err)
    } else {
      console.log(data)
    }
  }
)
