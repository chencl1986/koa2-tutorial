// crypto是系统提供的，用于处理加密的库
const crypto = require('crypto')

module.exports = {
  md5 (buffer) {
    const md5 = crypto.createHash('md5')

    // update方法可以执行多次，最终会合并成为一个待处理的值。
    // 传参支持字符串、Buffer等
    md5.update(buffer)

    // digest方法用于输出加密结果，hex为十六进制。
    return md5.digest('hex')
  }
}
