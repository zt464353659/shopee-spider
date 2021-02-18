'use strict'
// 加载依赖
const router = require('koa-router')()
const shopeCouponController = require('controllers/deleteCoupon')
router
    /**
     * @description: 满减优惠券
     */
    .post('/shopee/coupon/delete', shopeCouponController.deleteCoupon)

module.exports = router
