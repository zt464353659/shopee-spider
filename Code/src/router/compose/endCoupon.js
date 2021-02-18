'use strict'
// 加载依赖
const router = require('koa-router')()
const shopeCouponController = require('controllers/endCoupon')
router
    /**
     * @description: 满减优惠券
     */
    .post('/shopee/coupon/end', shopeCouponController.endCoupon)

module.exports = router
