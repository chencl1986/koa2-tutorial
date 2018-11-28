const tableLib = require('../../libs/table')
const {
  HTTP_ROOT
} = require('../../config')
const table = 'catalog_table'
const pageType = 'catalog'
const pagePath = `${HTTP_ROOT}/admin/catalog`
const fields = [ // 循环输出表单
  { title: '标题', name: 'title', type: 'text' }
]

module.exports = tableLib(table, pageType, pagePath, fields)
