const tableLib = require('../../libs/table')
const {
  HTTP_ROOT
} = require('../../config')
const table = 'article_table'
const pageType = 'article'
const pagePath = `${HTTP_ROOT}/admin/article`
const fields = [ // 循环输出表单
  { title: '标题', name: 'title', type: 'text' },
  { title: '类目', name: 'catalog_ID', type: 'select', from: `SELECT ID,title FROM catalog_table` },
  { title: '时间', name: 'created_time', type: 'date' },
  { title: '作者', name: 'author', type: 'text' },
  { title: '浏览', name: 'view', type: 'number' },
  { title: '评论', name: 'comment', type: 'text' },
  { title: '摘要', name: 'summary', type: 'text' },
  { title: '列表图', name: 'list_img_src', type: 'file' },
  { title: 'banner图', name: 'banner_img_src', type: 'file' },
  { title: '内容', name: 'content', type: 'textarea' }
]

module.exports = tableLib(table, pageType, pagePath, fields)
