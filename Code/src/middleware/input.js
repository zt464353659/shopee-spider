/*
 * @Author: zhangzhengzhe
 * @Date: 2019-06-20 17:35:12
 * @LastEditors: zhangzhengzhe
 * @LastEditTime: 2019-07-04 15:02:48
 */
'use strict'
module.exports = async function(ctx, next) {
  const method = ctx.method

  switch (method) {
    case 'GET':
      ctx.input = ctx.query
      break
    case 'PUT':
    case 'POST':
      ctx.input = ctx.request.body
      break
    default:
      ctx.input = {}
      break
  }
  ctx.type = 'application/json charset=utf-8'
  await next()
}
