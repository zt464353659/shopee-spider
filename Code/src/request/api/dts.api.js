'use strict'
const ApiError = require('errorException/apiError')
const config = require('@config/config')
const utils = require('util/utils')
const pupp = require('puppeteer')
process.setMaxListeners(0) // 将时间监听设置为不限个数

/**
* @param  { Object } params 用户信息
* @param { String } platform 平台
*/
module.exports = {

  /**
   * @description: 设置DTS
   * */

  openIndex: async(params) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async(resolve, reject) => {
      const context = await pupp.launch(config.browserOption)
      const page = await context.newPage()
      await page.setDefaultNavigationTimeout(config.timeout)
      await page.setUserAgent(config.ua)
      try {
        await page.goto(params.platform, { 'waitUntil': 'networkidle0' })
        const userEl = await page.evaluate(() => {
          const obj = {}
          if (document.querySelector('.signin-form div:nth-child(1) input[type="text"]')) {
            obj.user = '.signin-form div:nth-child(1) input[type="text"]'
          }
          if (document.querySelector('.signin-form div:nth-child(2) input[type="password"]')) {
            obj.pass = '.signin-form div:nth-child(2) input[type="password"]'
          }
          return obj
        })
        await page.type(userEl.user, params.data.username)
        await page.type(userEl.pass, params.data.password)
        await page.keyboard.press('Enter')
        await page.waitFor(500)
        await page.goto(`${params.platform}/portal/settings/shop/logistics`, { 'waitUntil': 'networkidle2' })
        await page.waitFor(800)
        await page.evaluate(() => { document.querySelector('.settings-card .operations div button').click() })
        await page.waitFor(500)
        const shopeeModel = await page.waitForSelector('.shopee-modal', { timeout: 3000 })
        page.on('error', async() => {
          await page.close()
          resolve({ status: false, message: '第三方页面请求超时,请稍后再试！'})
        })
        // const shopeeModel = await page.evaluate(() => { return document.querySelector('.shopee-modal') })
        if (!shopeeModel) { 
          resolve({ status: false, message: '第三方页面请求超时,请稍后再试！'})
        }
        // await page.evaluate((data) => { document.querySelector('.shopee-modal .content .shopee-input input').value = data.day }, params.data)
        const inputHandle = await page.waitForSelector('.shopee-modal .content .shopee-input input')
        // 获取input焦点
        // await page.focus('.shopee-modal .content .shopee-input input')
        // 点击input，按删除数值
        await inputHandle.click()
        await inputHandle.press('Backspace')
        // 填充input数值
        page.keyboard.type(params.data.day)
        // await page.setRequestInterception(true)
        // getResponseMsg(params, page).then(result => { resolve(JSON.parse(result)) })
        await page.click('.shopee-modal button:nth-child(2)')
        resolve({
          status: true,
          day: params.data.day,
          message: '设置成功'
        })
      } catch (error) {
        // console.log(error)
        // await context.close()
        utils.returnThrowError(error)
      } finally {
        await context.close()
      }
    })
  }
}

/**
 * @description: 获取拦截某条url内容的
 * @param page
 * @returns {Promise<any | never>}
 */
function getResponseMsg(params, page) {
  const url = `${params.platform}/api/v3/product/update_days_to_ship/`
  return new Promise((resolve, reject) => {
    page.on('request', request => {
      if (request.url().indexOf(url) !== -1) {
        page.on('response', response => {
          if (response.url().indexOf(url) !== -1) {
            response.text().then(async result => {
              // console.log(result)
              resolve(result)
            })
          }
        })
        request.continue()
      } else {
        request.continue()
      }
    })
  // eslint-disable-next-line no-undef
  }).catch(err => { reject(err) })
}
