/*
 * @Author: zhangzhengzhe
 * @Date: 2019-06-20 17:13:33
 * @LastEditors: zhangzhengzhe
 * @LastEditTime: 2019-09-26 15:49:27
 */
'use strict'
const path = require('path')
const puppeteer = require('puppeteer')
const ApiError = require('errorException/apiError')
const createPuppeteerPool = require('@invertase/puppeteer-pool')
module.exports = {
  /**
 *
 * @param { Object } params  koa上下文对象
 * @param { String } path   请求路径
 * @param { String } method 请求类型
 */
  getheaders: (ctx, path, method, url) => {
    let referer = ''
    let cookie = ''
    if (ctx.url.indexOf('/shopee-chat/product/list') !== -1) {
      referer = `${ctx.input.platform}/webchat/conversations`
    } else if (ctx.url.indexOf('/shopee-chat/fans/list') !== -1) {
      referer = `${ctx.input.platform}/shop/${ctx.input.data.shop_id}/followers/?__classic__=1`
    } else {
      referer = ctx.input.platform + path
    }
    if (ctx.url.indexOf('order/meta') !== -1) {
      cookie = ctx.input.cookie
    } else {
      cookie = ctx.headerInput.cookie ? ctx.headerInput.cookie : ctx.input.cookie ? ctx.input.cookie : ''
    }
    return {
      'authority': ctx.input.platform.indexOf('tw') !== -1 ? url.slice(8) : ctx.input.platform.slice(8),
      'method': method,
      'path': path,
      'scheme': 'https',
      'content-type': method === 'post' ? 'application/json' : method === 'delete' ? '' : 'application/x-www-form-urlencoded',
      'Origin': ctx.input.platform.indexOf('tw') !== -1 ? url : ctx.input.platform,
      'cookie': cookie,
      'Referer': referer,
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
      'authorization': ctx.input.authorization ? ctx.input.authorization : ctx.headerInput.authorization ? ctx.headerInput.authorization : ''
    }
  },

  /* 改变puppeteer中chromium打包后的路径 */

  initChromiumPath: () => {
    const isPkg = typeof process.pkg !== 'undefined'
    // mac path replace
    let chromiumExecutablePath = (isPkg ? puppeteer.executablePath().replace(/^.*?\/node_modules\/puppeteer\/\.local-chromium/, path.join(path.dirname(process.execPath), 'chromium')) : puppeteer.executablePath())
    // check win32
    // process.platform 返回值有: aix darwin freebsd linux openbsd sunos win32
    if (process.platform === 'win32') {
      chromiumExecutablePath = (isPkg ? puppeteer.executablePath().replace(/^.*?\\node_modules\\puppeteer\\\.local-chromium/, path.join(path.dirname(process.execPath), 'chromium')) : puppeteer.executablePath()
      )
    }
    return chromiumExecutablePath
  },

  /**
   * @description: 异常抛出设置
   * @param { String || Object } error 错误数据（可能是字符串，也可能是object）
   * @param { Boolean } type  用于识别统一状态码下，不同的信息提示
   * */

  returnThrowError(error, type) {
    let errorMssage = ''
    if (error.name) {
      throw new ApiError(error.name, error.message)
    } else {
      if (error.indexOf('400') !== -1) {
        errorMssage = type ? 'request.nonedata' : 'request.resInvalid'
        throw new ApiError(errorMssage, error)
      } else if (error.indexOf('401') !== -1) {
        throw new ApiError('auth.codeExpired', error)
      } else if (error.indexOf('403') !== -1) {
        throw new ApiError('access.forbidden', error)
      } else if (error.indexOf('404') !== -1) {
        throw new ApiError('request.notfound', error)
      } else if (error.indexOf('408') !== -1) {
        throw new ApiError('request.timeout', error)
      } else if (error.indexOf('422') !== -1) {
        errorMssage = type ? 'request.nonedata' : 'auth.validfail'
        throw new ApiError(errorMssage, error)
      } else if (error.indexOf('502') !== -1) {
        throw new ApiError('auth.gateway', error)
      } else if (error.indexOf('504') !== -1 ||
          error.indexOf('The upstream server is timing out') !== -1 ||
          error.indexOf('timeout of 3000ms exceeded') !== -1) {
        throw new ApiError('request.timeout', error)
      } else if (error.indexOf('connect EHOSTUNREACH') !== -1) {
        throw new ApiError('request.connectFail', error)
      } else if (error.indexOf('Client network socket disconnected before secure TLS connection was established') !== -1) {
        throw new ApiError('request.error', error)
      } else if (error.indexOf('Navigation failed because browser has disconnected!') !== -1) {
        throw new ApiError('request.disconnect', error)
      } else if (error === 'auth.valid') {
        throw new ApiError('auth.valid')
      } else if (error === 'Error') {
        throw new ApiError('auth.servererror')
      } else {
        throw new ApiError('common.all', error)
      }
    }
  },

  /** 
   * @description: puppeteer 连接池
   * @param { Object } options 参数配置
   */
  initPuppeteer: async(options) => {
    const pool = createPuppeteerPool({
      ...options.pool,
      puppeteerLaunchArgs: [options.browserOption]
    })
    if (!options.initPuppeteer.browser) {
      let browser = null
      try {
        options.initPuppeteer.pool = pool
        browser = await pool.acquire()
        options.initPuppeteer.browser = browser
      } catch (error) {
        await pool.drain()
        await pool.clear()
      } finally {
        await pool.drain()
        await pool.clear()
      }
    }
  },

  /** 
   * @description: 关闭冗余页签
   */
  closePages: async(browser) => {
    const pages = await browser.pages()
    if (pages.length > 5) {
      for (let i = 0; i < pages.length; i++) {
        if (i < pages.length - 5) {
          await pages[i].close()
          console.log(`共打开了${pages.length}个页面,已经关闭第${i}页面`)
        }
      }
    }
  },

  /** 
   * @description: 拦截图片等
   * @param { Object } page 上下文page对象
   * @param { Object } options 配置
   */
  interceptedRequest: (page, options) => {
    try {
      page.on('request', interceptedRequest => {
        // 判断如果是 图片请求  就直接拦截 
        let type = interceptedRequest.resourceType()
        if (options.includes(type)) {
          /* 中止请求 */
          interceptedRequest.abort().then((res) => {
          }).catch((err) => {
            console.log('中止请求错误信息')
            console.log(err)
          })
        } else {
          /* 跳过 */
          interceptedRequest.continue().then((res) => {
          }).catch((err) => {
            console.log('允许请求错误信息')
            console.log(err)
          })
        }
      })
    } catch (error) {
      console.log(error)
      return new ApiError('common.all', '拦截错误信息')
    }
  }
}
