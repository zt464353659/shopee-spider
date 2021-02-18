'use strict'
// 加载依赖
const router = require('koa-router')()
const shopeAmountController = require('controllers/amount')
router
/**
 * @description: 巴西子订单
 */
    .post('/shopee/amount', shopeAmountController.amount)

module.exports = router