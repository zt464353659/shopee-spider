'use strict'
// 加载依赖
const router = require('koa-router')()
const shopeCouponController = require('controllers/createCoupon')
router
    /**
     * @description: 满减优惠券
     */
    .post('/shopee/coupon/create', shopeCouponController.createCoupon)

module.exports = router
