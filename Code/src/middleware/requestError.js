/*
 * @Author: zhangzhengzhe
 * @Date: 2019-06-20 17:35:12
 * @LastEditors: zhangzhengzhe
 * @LastEditTime: 2019-08-27 13:41:16
 */
'use strict'
const logger = require('./../util/logger')
const response = require('./../util/response')

module.exports = async function(ctx, next) {
  const beginTime = new Date().getTime()
  try {
    await next()
    const req = ctx.request
    const res = ctx.response
    const input = ctx.input
    const endTime = new Date().getTime()
    const ip = req.get('X-Real-IP') || req.get('X-Forwarded-For') || req.ip
    const fields = {
      status: res.status,
      accept: req.header['accept'],
      cookie: req.header['cookie'],
      ua: req.header['user-agent'],
      method: req.method,
      headers: ctx.headers,
      url: req.url,
      client_ip: ip,
      cost: endTime - beginTime,
      input: input
    }
    // 此处根据环境变量将请求信息写入日志
    if (!process.env.MSF_ENV && process.env.MSF_ENV !== 'docker') {
      logger.getLogger('access').trace('requestSuccess', fields)
    }
  } catch (e) {
    const req = ctx.request
    const res = ctx.response
    const status = e.status || 500
    const msg = e.message || e
    const input = ctx.input
    const endTime = new Date().getTime()
    const ip = req.get('X-Real-IP') || req.get('X-Forwarded-For') || req.ip

    const fields = {
      status: res.status,
      accept: req.header['accept'],
      cookie: req.header['cookie'],
      ua: req.header['user-agent'],
      method: req.method,
      headers: ctx.headers,
      url: req.url,
      client_ip: ip,
      cost: endTime - beginTime,
      input: JSON.stringify(input),
      msg: msg
    }
    ctx.status = status
    // 此处根据环境变量决定是否将错误异常写入日志
    if (!process.env.MSF_ENV && process.env.MSF_ENV !== 'docker') {
      // console.log('日志写入')
      if (status === 500) {
        logger.getLogger('access').error('requestError', fields)
      } else {
      // console.log('日志写入')
        logger.getLogger('access').warn('requestException', fields)
      }
    }
    let errCode = e.code || 1
    if (!(parseInt(errCode) > 0)) {
      errCode = 1
    }
    return response.output(ctx, [], errCode, msg, status)
  }
}
