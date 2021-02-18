/*
 * @Author: zhangzhengzhe
 * @Date: 2019-06-20 17:35:12
 * @LastEditors: zhangzhengzhe
 * @LastEditTime: 2019-07-30 16:09:59
 */
'use strict'
module.exports = async function(ctx, next) {
  ctx.headerInput = ctx.req.headers || {}
  // todo 校验header内容
  await next()
}
