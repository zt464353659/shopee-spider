/*
 * @Author: zhangzhengzhe
 * @Date: 2019-06-20 16:47:25
 * @LastEditors: zhangzhengzhe
 * @LastEditTime: 2019-09-02 15:08:48
 */
'use strict'
const compose = require('koa-compose')
const router = require('koa-router')()

/* 设置DTS */
const setDTSRouters = require('./compose/dts').routes()

/** 获取店铺扣分  */
const performanceRouters = require('./compose/performance').routes()

/** 获取后台广告数据  */
const chatDataRouters = require('./compose/adsInfo').routes()

/* 巴西子订单 */
const amountRouters = require('./compose/amount').routes()

// 店铺满减优惠券创建
const createFullCoupon = require('./compose/createCoupon').routes()

// 店铺满减优惠券删除
const deleteFullCoupon = require('./compose/deleteCoupon').routes()
// 店铺满减优惠券end
const endFullCoupon = require('./compose/endCoupon').routes()
// 店铺日费用报表
const shopAdsData = require('./compose/shopAdsData').routes()
// 首页
const index = router.get('/', ctx => {
  ctx.type = 'text/html;charset=utf-8'
  ctx.body = `
      <h2 style="display: flex;
        justify-content: center;
        align-items: center;
        height: calc(100vh - 40px);">
        Welcome to Shopee Chat System
      </h2>`
}).routes()

const errorLog = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.response.status = err.statusCode || err.status || 500
    ctx.response.body = {
      code: 0,
      message: err.msg,
      data: []
    }
    // 手动释放error事件
    ctx.app.emit('error', err, ctx)
  }
}

/*
* 日志输出
* */
const errorConsole = ctx => {
  console.log(`\r============================= Error log: =============================
              method  ==> ${ ctx.request.method } 
              url  ==> ${ ctx.request.url }
              msg  ==> ${ JSON.stringify(ctx.request.body || ctx.query) }
              \r============================= Error end =============================`)
}

const middlewares = compose(
    [
      // end已开始的满减优惠券
      endFullCoupon,
      // 删除满减优惠券
      deleteFullCoupon,
      // 创建满减优惠券
      createFullCoupon,
      /* 店铺扣分 */
      performanceRouters,
      setDTSRouters,
      // 获取后台广告相关数据
      chatDataRouters,
      // 店铺日费用报表excel数据
      shopAdsData,
      amountRouters,
      index,
      errorLog,
      errorConsole
    ])

module.exports = middlewares
