// 'use strict'
const pupp = require('puppeteer')
const config = require('@config/config')
const request = require('request/axios.instance')
const utils = require('util/utils')
const XLSX = require('xlsx')
process.setMaxListeners(0) // 将时间监听设置为不限个数

/**
 * @param  { Object } params 用户信息
 * @param { String } platform   平台
 * @param { String } username   用户名
 * @param { String } password   密码
 * @param { String } start_time 开始时间(秒)
 * @param { String } end_time   结束时间(秒)
 */
module.exports = {

  /**
   * @description: 获取shopee卖家广告 keyword targeting shop花费数据
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
      // await page.goto(`${ params.platform }/portal/marketing/pas/assembly?&type=keyword`, { waitUntil: 'networkidle0' })
      // await page.waitFor(2000)
      // const excelData = {
      //   keyword: [],
      //   targeting: [],
      //   shop: []
      // }
      // length 为3有shop类型
      // const advtType = await page.$$('.nav-menu ul li a')
      // 拼接header头
      const cookie = await page.cookies()
      const SPC_CDS = cookie.filter(v => v.name === 'SPC_CDS')[0].value
      let cookie_str = ''
      cookie.forEach(v => {
        cookie_str += `${ v.name }=${ v.value }; `
      })
      page.on('error', async (error) => {
        console.log('奔溃了呀')
        await page.close()
      })
      const getKeyword = new Promise(async (resolve, reject) => {
        await request({
          url: `${ params.platform }/api/marketing/v3/pas/campaign_statistics/export/?SPC_CDS=${ SPC_CDS }&SPC_CDS_VER=2&campaign_type=keyword&start_time=${ params.data.start_time }&end_time=${ params.data.end_time }`,
          method: 'get',
          headers: {
            cookie: cookie_str
          }
        }).then(res => {
          if (typeof (res) === 'string') {
            const workbook = XLSX.read(res, { type: 'string', raw: false })
            resolve(XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1, { raw: false, header: 'string' }))
          } else {
            resolve([])
          }
        }).catch(e => {
          reject(e)
        })
      })
      const getTargeting = new Promise(async (resolve, reject) => {
        await request({
          url: `${ params.platform }/api/marketing/v3/pas/campaign_statistics/export/?SPC_CDS=${ SPC_CDS }&SPC_CDS_VER=2&campaign_type=targeting&start_time=${ params.data.start_time }&end_time=${ params.data.end_time }`,
          method: 'get',
          headers: {
            cookie: cookie_str
          }
        }).then(res => {
          if (typeof (res) === 'string') {
            const workbook = XLSX.read(res, { type: 'string', raw: false })
            resolve(XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1, { raw: false, header: 'string' }))
          } else {
            resolve([])
          }
        }).catch(e => {
          reject(e)
        })
      })
      const getShop = new Promise(async (resolve, reject) => {
        await request({
          url: `${ params.platform }/api/marketing/v3/pas/campaign_statistics/export/?SPC_CDS=${ SPC_CDS }&SPC_CDS_VER=2&campaign_type=shop&start_time=${ params.data.start_time }&end_time=${ params.data.end_time }`,
          method: 'get',
          headers: {
            cookie: cookie_str
          }
        }).then(res => {
          if (typeof (res) === 'string') {
            const workbook = XLSX.read(res, { type: 'string', raw: false })
            resolve(XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1, { raw: false, header: 'string' }))
          } else {
            resolve([])
          }
        }).catch(e => {
          reject(e)
        })
      })
      return await Promise.all([getKeyword, getTargeting, getShop])
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
