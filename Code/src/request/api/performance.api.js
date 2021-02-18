'use strict'
const config = require('@config/config')
const request = require('request/axios.instance')
const baseData = require('util/baseData')
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
    try{
      // 需要获取的数据 penalty、rating、performance、account_healthy_info、shop_detail
      // 登录后台
      const login = new Promise(async (resolve,reject) => {
        try{
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
          const accountPromise = new Promise(async (resolve,reject) => {
            try{
              const accountPage = await context.newPage()
              await accountPage.goto(`${params.platform}/portal/accounthealth/home`, { waitUntil: 'networkidle2' })
              let account_healthy
              account_healthy = await accountPage.waitForSelector('#service', { timeout: 180000 })
              if (!account_healthy) {
                await accountPage.evaluate(() => {
                  window.location.reload()
                })
                account_healthy = await accountPage.waitForSelector('#service', { timeout: 180000 })
              }
              await accountPage.waitFor(1000)
              const account_healthy_info = await accountPage.evaluate(() => {
                return {
                  response_time: document.querySelector('#service section section:nth-child(3) .metric-my').innerText,
                  amount_of_the_days: document.querySelectorAll('#listing .metric-item-child')[3].children[1].innerText,
                  other_listing_violations: document.querySelector('#listing .is-parent-last .metric-my').innerText
                }
              })
              const penalty = await accountPage.evaluate(() => {
                const el = document.querySelectorAll('.card')[0]
                const dates = el.querySelector('.top span').innerText.replace(/[\(\)]/ig, '')
                const sum_points = el.querySelectorAll('.quarter-left p')[0].innerText
                return {
                  sum_points: sum_points,
                  time: dates
                }
              })
              resolve([account_healthy_info, penalty])
            }catch (e) {
              reject(e)
            }
          })
          const ratingPromise = new Promise(async(resolve,reject) => {
            try{
              const ratingPage = await context.newPage()
              await ratingPage.goto(`${params.platform}/portal/settings/shop/rating`, { 'waitUntil': 'networkidle2',timeout: 120000 })
              await ratingPage.waitFor(1000)
              let performance = await ratingPage.waitForSelector('.performance', { timeout: 180000 })
              if (!performance) {
                await ratingPage.evaluate(() => {
                  window.location.reload()
                })
                performance = await ratingPage.waitForSelector('.performance', { timeout: 180000 })
              }
              const rating = await ratingPage.evaluate((el) => {
                const rateArr = Array.prototype.slice.call(document.querySelectorAll('.shopee-tabs__nav-warp .shopee-tabs__nav-tab'))
                rateArr.splice(0, 4)
                const five_star = rateArr[0].children[1] ? rateArr[0].children[1].innerText.replace(/[\s+()]/g, '') : 0
                const four_star = rateArr[1].children[1] ? rateArr[1].children[1].innerText.replace(/[\s+()]/g, '') : 0
                const three_star = rateArr[2].children[1] ? rateArr[2].children[1].innerText.replace(/[\s+()]/g, '') : 0
                const two_star = rateArr[3].children[1] ? rateArr[3].children[1].innerText.replace(/[\s+()]/g, '') : 0
                const one_star = rateArr[4].children[1] ? rateArr[4].children[1].innerText.replace(/[\s+()]/g, '') : 0
                const rating_info = {
                  five_star: five_star && five_star.indexOf('k') !== -1 ? five_star.slice(0, -1) * 1000 : five_star,
                  four_star: four_star && four_star.indexOf('k') !== -1 ? four_star.slice(0, -1) * 1000 : four_star,
                  three_star: three_star && three_star.indexOf('k') !== -1 ? three_star.slice(0, -1) * 1000 : three_star,
                  two_star: two_star && two_star.indexOf('k') !== -1 ? two_star.slice(0, -1) * 1000 : two_star,
                  one_star: one_star && one_star.indexOf('k') !== -1 ? one_star.slice(0, -1) * 1000 : one_star
                }
                return {
                  shop_rating: el.querySelectorAll('span')[0].innerText,
                  shop_rating_target: el.querySelectorAll('span')[1].innerText.slice(-1),
                  rating_info
                }
              }, performance)
              resolve(rating)
            }catch (e) {
              reject(e)
            }
          })
          // const performancePromise = new Promise(async(resolve,reject) => {
          //   try{
          //     let headers = ''
          //     let SPC_CDS = ''
          //     const cookie = await page.cookies()
          //     cookie.forEach(async (item, index) => {
          //       if (item.value) {
          //         headers += item.name + '=' + item.value
          //         if (item.name === 'SPC_CDS') SPC_CDS = item.value
          //         if (index < cookie.length - 1) {
          //           headers += ';'
          //         }
          //       }
          //     })
          //     // 接口数据
          //     const query = {
          //       platform: params.platform,
          //       data: {
          //         SPC_CDS,
          //         SPC_CDS_VER: 2
          //       },
          //       cookie: headers
          //     }
          //     const performanceRequest = async (params) => {
          //       const path = baseData.shopee.performance(params)
          //       return request({
          //         url: params.platform + path,
          //         method: 'get',
          //         headers: {
          //           'cookie': params.cookie,
          //           'user-agent': config.ua
          //         }
          //       })
          //     }
          //     resolve(await performanceRequest(query))
          //   }catch (e) {
          //     reject(e)
          //   }
          // })
          // 店铺配额
          const shopQuota = new Promise(async (resolve,reject) => {
            try{
              const shopQuotaPage = await context.newPage()
              await shopQuotaPage.goto(`${params.platform}/portal/product/list/all`, { 'waitUntil': 'networkidle0',timeout: 120000 })
              const quota = await shopQuotaPage.evaluate(() => {
                let str = ''
                const el = document.querySelector('.title-box .list-percent-bar .percent-bar')
                // el ? str = el.innerText.replace(/[\s\,\.]/g, '') : ''
                el ? str = el.innerText : ''
                return str
              })
              resolve(quota)
            }catch (e) {
              reject(e)
            }
          })
          Promise.all([accountPromise,ratingPromise,shopQuota]).then(res => {
            resolve(res.flat())
          }).catch(e => {
            reject(e)
          })
        } catch (e) {
          reject(e)
        }
      })

      // 店铺详情
      const shop_detail = new Promise(async (resolve,reject) => {
        try{
          const shopInfoPage = await context.newPage()
          await shopInfoPage.goto(baseData.shopee.shop_info(params), { waitUntil: 'networkidle2' })
          await shopInfoPage.mouse.click(10, 10)
          await shopInfoPage.waitFor(1000)
          await shopInfoPage.mouse.click(10, 10)
          await shopInfoPage.waitFor(5000)
          const obj = await shopInfoPage.evaluate(() => {
            const nameArr = document.querySelectorAll('.section-seller-overview-horizontal__seller-info-list .section-seller-overview__item-text-name:last-child')
            const valueArr = document.querySelectorAll('.section-seller-overview-horizontal__seller-info-list .section-seller-overview__item-text-value:last-child')
            const obj = {}
            nameArr.forEach((v, i) => {
              let prop = v.innerText.toLowerCase().replace(' ', '_')
              let value = valueArr[i].innerText
              if (value.charAt(value.length - 1) === 'k') {
                value = value.slice(0, -1) * 1000
              }
              obj[prop] = value
            })
            return obj
          })
          resolve(obj)
        } catch (e) {
          reject(e)
        }
      })
      return await Promise.all([login, shop_detail])
    } catch (error) {
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
