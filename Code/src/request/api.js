/*
 * @Author: zhangzhengzhe
 * @Date: 2019-06-20 16:47:25
 * @LastEditors: zhangzhengzhe
 * @LastEditTime: 2019-08-05 16:49:51
 */

'use strict'
/* DTS设置 */
const dtsApi = require('./api/dts.api')

/* 店铺扣分 */
const performanceApi = require('./api/performance.api')

/* 后台卖家广告数据 */

const adsInfoApi = require('./api/adsInfo.api')

/* 巴西子订单 */
const orderAmountApi = require('./api/amount.api')

// 店铺满减优惠券创建
const createCouponApi = require('./api/createCoupon.api')
// 店铺满减优惠券删除
const deleteCouponApi = require('./api/deleteCoupon.api')
// 店铺满减优惠券end
const endCouponApi = require('./api/endCoupon.api')
// 卖家店铺广告日报表
const shopAdsData = require('./api/shopAdsData')

module.exports = {
  dtsApi,
  performanceApi,
  orderAmountApi,
  adsInfoApi,
  createCouponApi,
  deleteCouponApi,
  endCouponApi,
  shopAdsData
}
