'use strict'
const config = require('@config/config')
const request = require('request/axios.instance')
const utils = require('util/utils')
const pupp = require('puppeteer')
process.setMaxListeners(0) // 将时间监听设置为不限个数

/**
 * @param  { Object } params 用户信息
 * @param { String } platform 平台
 */
module.exports = {

  /**
   * @description: 获取店铺扣分
   * */

  openIndex: async (params) => {
    const context = await pupp.launch(config.browserOption)
    const page = await context.newPage()
    try {
      // 需要获取的数据 penalty、rating、performance、account_healthy_info、shop_detail
      // 登录后台
      await page.setDefaultNavigationTimeout(config.timeout)
      await page.setUserAgent(config.ua)
      await page.goto(params.platform, { 'waitUntil': 'networkidle0' })
      const isRefresh = await page.evaluate(() => {
        const error = ['502 Bad Gateway', '504 Gateway Time-out']
        const badWay = document.querySelector('center>h1')
        return badWay ? error.includes(badWay.innerText) : false
      })
      isRefresh ? await page.evaluate(() => {
        window.location.reload()
      }) : false
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
      // await page.screenshot({ path: 'login_info.png' })
      await page.waitForNavigation({ waitUntil: 'networkidle2' })

      const cookie = await page.cookies()
      let headers = ''
      let SPC_CDS = ''
      let SPC_CDS_VER = ''
      cookie.forEach(async (item, index) => {
        if (item.value) {
          headers += item.name + '=' + item.value
          if (item.name === 'SPC_CDS') {
            SPC_CDS = item.value
          }
          if (item.name === 'SPC_CDS_VER') {
            SPC_CDS_VER = item.value
          }
          if (index < cookie.length - 1) {
            headers += ';'
          }
        }
      })
      const endDiscountCoupon = async (params) => {
        // //seller.my.shopee.cn/api/marketing/v3/voucher/stop/
        let path
        if (params.data.site === 'tw') {
          path = `https://seller.xiapi.shopee.cn/api/marketing/v3/voucher/stop/?SPC_CDS=${ SPC_CDS }&SPC_CDS_VER=${SPC_CDS_VER}`
        } else {
          path = `${ params.platform }/api/marketing/v3/voucher/stop/?SPC_CDS=${ SPC_CDS }&SPC_CDS_VER=${SPC_CDS_VER}`
        }
        return request({
          url: path,
          method: 'put',
          headers: {
            'cookie': headers,
            'user-agent': config.ua
          },
          data: params.data.data
        })
      }
      return  await endDiscountCoupon(params)
    } catch (error) {
      console.log(error)
      /**
       * @description: 直接关闭context,关闭page无法达到预期效果
       */
      // await context.close()
      utils.returnThrowError(error)
    } finally {
      await context.close()
    }
  }
}
