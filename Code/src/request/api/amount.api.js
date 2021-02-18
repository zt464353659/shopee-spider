'use strict'
const config = require('@config/config')
const utils = require('util/utils')
const pupp = require('puppeteer')

/**
 * @param  { Object } params 用户信息
 * @param { String } platform 平台
 */
module.exports = {

  /**
   * @description: 获取订单金额
   * */

  openIndex: async (params) => {
    const context = await pupp.launch(config.browserOption)
    const page = await context.newPage()
    /* 关闭荣誉页签 */
    // utils.closePages(browser)
    await page.setDefaultNavigationTimeout(config.timeout)
    await page.setUserAgent(config.ua)
    try {
      await page.goto(params.platform, { 'waitUntil': 'networkidle2'})
      await page.waitFor(500)
      // await page.screenshot({ path: 'go_after.png' })
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
      await page.waitFor(1000)
      await page.goto(`${params.platform}/portal/sale/?search=${params.data.order_id}&sip_shopid=${params.data.shop_id}&sip_region=br`, { 'waitUntil': 'networkidle2' })
      // await page.screenshot({ path: 'go_after.png' })
      // page.on('error', async(error) => {
      //   console.log('奔溃了呀')
      //   await page.close()
      // })
      const list = await page.evaluate(() => {
        return document.querySelector('.order-list-body > a') ? document.querySelector('.order-list-body > a').getAttribute('href') : false
      })
      await page.waitFor(1000)
      if (!list) {
        utils.returnThrowError('属性获取失败,请稍后再试!')
      } else {
        await page.goto(`${params.platform}${list}`, { 'waitUntil': 'networkidle2' })
        await page.waitFor(2000)
        // await page.screenshot({ path: 'get_attr.png' })
        const rating = await page.evaluate((data) => {
          const el = document.querySelectorAll('.payment-info-details .income-value')[0]
          const arr = []
          const productListEl = document.querySelectorAll('.product-list .product-list-item')
          for (let i = 1; i < productListEl.length; i++) {
            let nodeEl = productListEl[i].children[1].children[1].children[1]
            arr.push({
              sku: nodeEl.innerText.split(':')[nodeEl.innerText.split(':').length-1].trim(),
              unitPrice: productListEl[i].children[2].innerText,
              quantity: productListEl[i].children[3].innerText,
              subtotal: productListEl[i].children[4].innerText
            })
          }
          return {
            amount: el.innerText || '',
            order_id: data.data.order_id,
            items: arr
          }
        }, params)
        await page.waitFor(1000)
        return { rating }
      }
    } catch (error) {
      console.log(error)
      // await context.close()
      utils.returnThrowError(error)
    } finally {
      await context.close()
      // // 本地测试不用传SIGHUP，此命令是针对Linux系统
      // if (!process.env.MSF_ENV && process.env.MSF_ENV !== 'docker') {
      //   await browser.process().kill()
      // } else {
      //   await browser.process().kill('SIGHUP')
      // }
    }
  }
}
