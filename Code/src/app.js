/*
 * @Author: zhangzhengzhe
 * @Date: 2019-06-20 16:47:25
 * @LastEditors: zhangzhengzhe
 * @LastEditTime: 2019-08-29 13:18:09
 */

'use strict'
require('module-alias/register')
const Koa = require('koa')
const cors = require('koa2-cors')
const path = require('path')
const bodyParser = require('koa-body')
const Routers = require('./router')
const config = require('@config/config')
const utils = require('util/utils')
const staticFiles = require('koa-static')
// const createPuppeteerPool = require('@invertase/puppeteer-pool')
// require('events').EventEmitter.defaultMaxListeners = 15
const app = new Koa()

// 设置图片静态目录
app.use(staticFiles(path.join(__dirname + '/public/')))

/**
 * cors config
*/
app.use(cors(config.corsOptions))
app.use(async(ctx, next) => {
  if (ctx.request.header.origin !== ctx.origin) {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Credentials', true)
  }
  await next()
})

app.use(async(ctx, next) => {
  if (ctx.method === 'OPTIONS') {
    ctx.set('Access-Control-Allow-Methods', 'PUT,DELETE,POST,GET')
    ctx.set('Access-Control-Max-Age', 86400) // 3600 * 24
    ctx.body = ''
  }
  await next()
})

/**
 * Post config
 */
app.use(bodyParser(config.corsBodyParser))

/**
 * 添加报文解析中间件
 */
const xmlParser = require('koa-xml-body')
app.use(xmlParser())

/**
 * 处理输入报文中间件
 */
app.use(require('./middleware/input'))

/**
 * 处理header中间件
 */
app.use(require('./middleware/header'))

/**
 * 请求回调处理中间件
 */
app.use(require('./middleware/requestError'))

/** 注册路由 */
app.use(Routers)


/** 
 * @description: 连接池启动
 */
// utils.initPuppeteer(config)

/**
 *  继续触发error事件
 */
app.on('error', err => {
  console.error(`server error ===> ${err.message}`)
})

/**
 * 服务启动，监听端口
*/
app.listen(config.port, () => {
  console.log(`\r--------------------------------------  Console Start  --------------------------------------
                The Service Started,Port is ${config.port}  
               \r--------------------------------------  Console End  --------------------------------------`)
})
