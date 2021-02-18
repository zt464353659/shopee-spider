/*
 * @Author: zhangzhengzhe
 * @Date: 2019-06-20 17:13:33
 * @LastEditors: zhangzhengzhe
 * @LastEditTime: 2019-07-04 15:00:07
 */
'use strict'
module.exports = {
  /**
     * 输出数据到客户端
     * @param ctx 上下文
     * @param data 数据内容
     * @param errCode 业务错误码
     * @param msg 提示信息
     * @param httpStatus http状态码
     */
  output: function(ctx, data, errCode = 200, msg = '请求成功', httpStatus = 200) {
    const json = {}
    json.code = errCode
    json.message = msg
    json.data = data || []
    ctx.body = JSON.stringify(json)
    ctx.status = httpStatus
  },

  /**
     * 输出数组
     */
  list: function(ctx, list = []) {
    // this.output(ctx, {list: list})
    this.output(ctx, list)
  },

  /**
     * 输出键值对
     */
  map: function(ctx, map = {}) {
    this.output(ctx, map)
  }
}
