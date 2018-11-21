const path = require('path')

module.exports = {
  DB_HOST: 'localhost',
  DB_USER: 'root',
  DB_PASS: '',
  DB_NAME: 'cpts',

  // 密码后缀
  ADMIN_SUFFIX: '_?:L$"OPUIOSIFJ(*UPT:LKRFG',

  // 域名配置
  HTTP_ROOT: 'http://localhost:8080',
  PORT: '8080',

  // 上传文件夹
  UPLOAD_DIR: path.resolve(__dirname, './static/upload')
}
