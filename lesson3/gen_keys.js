// 生成长度为1024，共2048个key
const fs = require('fs')
const path = require('path')

const KEY_LEN = 1024
const KEY_COUNT = 2048
const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

let arr = []
for (let index = 0; index < KEY_COUNT; index++) {
  let key = ''

  for (let index = 0; index < KEY_LEN; index++) {
    key += CHARS[Math.floor(Math.random() * CHARS.length)]
  }

  arr.push(key)
}

fs.writeFileSync(path.resolve(__dirname, './.keys'), arr.join('\n'))

console.log(`generated ${KEY_COUNT} keys`)
