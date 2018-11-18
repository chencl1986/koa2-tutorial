const Static = require('koa-static')
const path = require('path')
const staticPath = path.resolve(__dirname, '../static')

// 由于静态文件需要通过已创建的路由实例处理，所以需要传入router参数
module.exports = (router, options = {}) => {
  const { // 定义默认缓存天数，可根据传入参数配置，单位为天
    image = 30,
    script = 1,
    styles = 30,
    html = 30,
    other = 7
  } = options

  // 通过路由使用静态文件时，表示路由直接接受访问，所以需要用all方法。
  router.all(/((\.jpg)|(\.png)|(\.gif))$/i, Static(staticPath, {
    maxage: image * 86400 * 1000
  }))

  router.all(/((\.js)|(\.jsx))$/i, Static(staticPath, {
    maxage: script * 86400 * 1000
  }))

  router.all(/(\.css)$/i, Static(staticPath, {
    maxage: styles * 86400 * 1000
  }))

  router.all(/((\.html)|(\.htm))$/i, Static(staticPath, {
    maxage: html * 86400 * 1000
  }))

  router.all('*', Static(staticPath, {
    maxage: other * 86400 * 1000
  }))
}
