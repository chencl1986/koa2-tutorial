const tableLib = require('../../libs/table')
const {
  HTTP_ROOT
} = require('../../config')
const table = 'banner_table'
const pageType = 'banner'
const pagePath = `${HTTP_ROOT}/admin/banner`
const fields = [ // 循环输出表单
  { title: '标题', name: 'title', type: 'text' },
  { title: '图片', name: 'src', type: 'file' },
  { title: '链接', name: 'href', type: 'text' },
  { title: '序号', name: 'serial', type: 'number' }
]

module.exports = tableLib(table, pageType, pagePath, fields)
