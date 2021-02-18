'use strict'
const pupp = require('puppeteer')
const config = require('@config/config')
const request = require('request/axios.instance')
const utils = require('util/utils')
const qs = require('qs')
process.setMaxListeners(0) // 将时间监听设置为不限个数

/**
 * @param  { Object } params 用户信息
 * @param { String } platform   平台
 * @param { String } username   用户名
 * @param { String } password   密码
 * @param { String } start_time 开始时间(秒)
 * @param { String } end_time   结束时间(秒)
 * @param { String } type       广告类型
 */
module.exports = {

  /**
   * @description: 获取shopee卖家中心、广告数据
   * */

  openIndex: async (params) => {
    const context = await pupp.launch(config.browserOption)
    const page = await context.newPage()
    await page.setDefaultNavigationTimeout(config.timeout)
    await page.setUserAgent(config.ua)
    await page.goto(params.platform, { 'waitUntil': 'networkidle0' })
    try {
      // let image
      // 广告类型 keyword: 关键字广告 targeting: 关联广告
      const chatType = ['keyword', 'targeting', 'shop']
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
      // // 登录
      await page.type(userEl.user, params.data.username)
      await page.type(userEl.pass, params.data.password)
      await page.keyboard.press('Enter')
      await page.waitForNavigation({ waitUntil: 'networkidle2' })
      await page.waitFor(500)
      await page.goto(`${params.platform}/portal/marketing/pas/assembly?&type=keyword&group=yesterday`, { waitUntil: 'networkidle2' })
      // await page.waitFor(2000)
      const chatData = {}
      await page.goto(`${ params.platform }/portal/marketing/pas/assembly?type=${ chatType[1] }&from=${ params.data.start_time }&to=${ params.data.end_time - 1 }&group=custom`, { 'waitUntil': 'networkidle0' })
      // await page.waitFor(5000)
      await page.waitForSelector('.title-text')
      chatData.targeting = await page.evaluate(() => {
        const chatList = document.querySelectorAll('.chart-card>div>div>div.content')
        const balance = document.querySelector('.title-text')
        if (chatList && chatList.length && balance) {
          return {
            // 账户余额
            balance: balance.innerText,
            // 销售金额
            order_gmv: chatList[5].innerText,
            // 花费
            cost: chatList[6].innerText
          }
        } else {
          // 商店广告无图表
          return {
            // 账户余额
            balance: balance ? balance.innerText : '',
            // 销售金额
            order_gmv: '',
            // 花费
            cost: ''
          }
        }
      })
      console.log('target ads')
      await page.goto(`${ params.platform }/portal/marketing/pas/assembly?type=${ chatType[0] }&from=${ params.data.start_time }&to=${ params.data.end_time - 1 }&group=custom`, { 'waitUntil': 'networkidle0' })
      const advtType = await page.$$('.nav-menu ul li a')
      // await page.waitFor(5000)
      await page.waitForSelector('.title-text')
      chatData.keyword = await page.evaluate(() => {
        const chatList = document.querySelectorAll('.chart-card>div>div>div.content')
        const balance = document.querySelector('.title-text')
        if (chatList && chatList.length && balance) {
          return {
            // 账户余额
            balance: balance.innerText,
            // 销售金额
            order_gmv: chatList[5].innerText,
            // 花费
            cost: chatList[6].innerText
          }
        } else {
          // 商店广告无图表
          return {
            // 账户余额
            balance: balance ? balance.innerText : '',
            // 销售金额
            order_gmv: '',
            // 花费
            cost: ''
          }
        }
      })
      console.log('keyword ads')

      if (advtType[2]) {
        // await page.waitFor(5000)
        await page.goto(`${ params.platform }/portal/marketing/pas/assembly?type=${ chatType[2] }&from=${ params.data.start_time }&to=${ params.data.end_time - 1 }&group=custom`, { 'waitUntil': 'networkidle0' })
        // await page.waitFor(5000)
        await page.waitForSelector('.title-text')
        chatData.shop = await page.evaluate(() => {
          const chatList = document.querySelectorAll('.chart-card>div>div>div.content')
          const balance = document.querySelector('.title-text')
          if (chatList && chatList.length && balance) {
            return {
              // 账户余额
              balance: balance.innerText,
              // 销售金额
              order_gmv: chatList[5].innerText,
              // 花费
              cost: chatList[6].innerText
            }
          } else {
            // 商店广告无图表
            return {
              // 账户余额
              balance: balance ? balance.innerText : '',
              // 销售金额
              order_gmv: '',
              // 花费
              cost: ''
            }
          }
        })
      } else {
        chatData.shop = {
          // 账户余额
          balance: 0,
          // 销售金额
          order_gmv: 0,
          // 花费
          cost: 0
        }
      }
      console.log('shop ads')

      // 接口获取商业分析数据

      // 拼接header头
      const cookie = await page.cookies()
      const SPC_CDS = cookie.filter(v => v.name === 'SPC_CDS')[0].value

      let cookie_str = ''
      cookie.forEach(v => {
        cookie_str += `${ v.name }=${ v.value }; `
      })

      // 获取当前账号店铺id，用户名
      const account_info = await request({
        url: `${ params.platform }/api/v2/login/?SPC_CDS=${ SPC_CDS }&SPC_CDS_VER=2`,
        method: 'get',
        headers: {
          cookie: cookie_str
        }
      }).then(res => {
        return { username: res.username, shop_id: res.shopid }
      })
      console.log('account info')

      // 获取商业分析接口url
      // type: 'month' || past7days
      const url = `${ params.platform }/api/mydata/v2/metrics/shop/summary/?${ qs.stringify({
        SPC_CDS,
        SPC_CDS_VER: 2,
        start_time: params.data.start_time,
        end_time: params.data.end_time,
        period: params.data.place_gmv.type
      }) }`
      // 获取商业分析结果
      const place_gmv = await request({
        url,
        method: 'get',
        headers: {
          cookie: cookie_str
        }
      // }).then(res => res.confirmed_gmv.value).catch(e => e)
      }).then(res => res.result.confirmed_gmv.value).catch(e => e)
      // 获取对应时间段交易详情
      console.log('place_gmv')

      // 交易详情数据
      let trading_particulars = []
      let maxPage = 10
      for (let page = 0; page < maxPage; page++) {
        const detail_url = `${ params.platform }/api/marketing/v3/pas/translog/list/?SPC_CDS=${ SPC_CDS }&SPC_CDS_VER=2&start_time=${ params.data.start_time }&end_time=${ params.data.end_time - 1 }&limit=50&offset=${ page * 50 }&trans_type=0&placement=-1`
        const pageData = await request({
          url: detail_url,
          method: 'get',
          headers: {
            cookie: cookie_str
          }
        }).then(res => {
          maxPage = Math.ceil(res.data.total_count / 50)
          return res.data.items
        })
        trading_particulars = trading_particulars.concat(pageData)
      }
      page.on('error', async (error) => {
        console.log('奔溃了呀')
        await page.close()
      })
      trading_particulars = trading_particulars.map((v, ind) => {
        return { ...v, ...account_info, sequence: ind, start_time: Number(params.data.start_time), end_time: Number(params.data.end_time) }
      })
      console.log('trading_particulars')
      return { chatData, place_gmv, trading_particulars, ...account_info }
    } catch
        (error) {
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
