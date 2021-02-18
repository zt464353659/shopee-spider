/*
 * @Author: zhangzhengzhe
 * @Date: 2019-06-20 17:13:33
 * @LastEditors: zhangzhengzhe
 * @LastEditTime: 2019-08-29 09:43:44
 */
'use strict'
const log4js = require('log4js')
const config = require('@config/config')
const path = require('path')
const logPath = (!process.env.MSF_ENV && process.env.MSF_ENV !== 'docker') ? path.resolve(__dirname, '.' + config.logPath) : `./src/util${config.logPath}` // 此处需要写相对路径

log4js.configure({
  appenders: {

    // 错误日志
    error: {
      type: 'dateFile',
      filename: logPath + config.logPath,
      pattern: 'error.yyyy-MM-dd.log',
      compress: true,
      layout: { type: 'basic' },
      backups: 4,
      maxLogSize: 100000000, // 10M
      alwaysIncludePattern: true
    },

    // 系统日志
    default: {
      type: 'dateFile',
      filename: logPath + config.logPath,
      pattern: 'default.yyyy-MM-dd.log',
      compress: true,
      layout: { type: 'basic' },
      backups: 4,
      maxLogSize: 100000000, // 10M
      alwaysIncludePattern: true
    },

    // 统计日志
    stats: {
      type: 'dateFile',
      filename: logPath + config.logPath,
      pattern: 'stats.yyyy-MM-dd.log',
      compress: true,
      layout: { type: 'basic' },
      backups: 4,
      maxLogSize: 100000000, // 10M
      alwaysIncludePattern: true
    },

    // 异常日志
    exception: {
      type: 'dateFile',
      filename: logPath + config.logPath,
      pattern: 'exception-yyyy-MM-dd.log',
      compress: true,
      layout: { type: 'basic' },
      backups: 4,
      maxLogSize: 100000000, // 10M
      alwaysIncludePattern: true
    },

    // 请求访问日志
    request: {
      type: 'dateFile',
      filename: logPath + config.logPath,
      pattern: 'request-yyyy-MM-dd.log',
      compress: true,
      layout: { type: 'basic' },
      backups: 4,
      maxLogSize: 100000000, // 10M
      alwaysIncludePattern: true
    }
  },

  categories: {
    default: { appenders: ['default', 'stats'], level: 'ALL' },
    error: { appenders: ['error', 'stats'], level: 'ALL' },
    exception: { appenders: ['exception', 'stats'], level: 'ALL' },
    access: { appenders: ['request'], level: 'ALL' }
  },

  pm2: true,
  disableClustering: true
})

module.exports = log4js
