/*
 * @Author: zhangzhengzhe
 * @Date: 2019-06-20 17:35:12
 * @LastEditors: zhangzhengzhe
 * @LastEditTime: 2019-07-30 15:20:29
 */
'use strict'
const userValidation = require('./../app/validation/user.js')
const validator = require('./../util/requestValidator.js')
const ApiError = require('./../library/apiError.js')

module.exports = {
  /**
    * @author dven
    * @description 校验请求头，判断传过来的token和fid是否相等
    */
  checkHeader: async function(ctx, next) {
    await validator.validate(
      ctx.headerInput,
      userValidation.checkHeader.schema,
      userValidation.checkHeader.options
    )
    if (!ctx.headerInput.authorization || !ctx.input.authorization) {
      throw new ApiError('access.forbidden' + '(或签名不正确)')
    }
    await next()
  }
}
