const Router = require('koa-router')
const path = require('path')
const router = new Router()
const {
  unlink
} = require('../../libs/common')
const {
  HTTP_ROOT,
  UPLOAD_DIR
} = require('../../config')
const table = 'banner_table'
const bannerPath = `${HTTP_ROOT}/admin/banner`
const fields = [ // 循环输出表单
  {
    title: '标题',
    name: 'title',
    type: 'text'
  },
  {
    title: '图片',
    name: 'src',
    type: 'file'
  },
  {
    title: '链接',
    name: 'href',
    type: 'text'
  },
  {
    title: '序号',
    name: 'serial',
    type: 'number'
  }
]

// catelog管理
router.get('/', async (ctx, next) => { // 注意根路由要加/
  ctx.body = 'catelog'
})

module.exports = router.routes()
