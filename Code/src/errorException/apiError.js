/*
 * @Author: zhangzhengzhe
 * @Date: 2019-06-20 17:11:24
 * @LastEditors: zhangzhengzhe
 * @LastEditTime: 2019-08-26 14:03:10
 */
'use strict'
const apiErrorDefines = require('./apiErrorDefines')
class ApiError extends Error {
  /**
     * 构造方法
     * @param errorName 错误名称
     * @param params 错误信息参数
     */
  constructor(errorName, ...params) {
    super()
    const errorInfo = apiErrorDefines(errorName, params)
    this.name = errorName
    this.code = errorInfo.code
    this.status = errorInfo.status
    this.message = errorInfo.message
  }
}
module.exports = ApiError
