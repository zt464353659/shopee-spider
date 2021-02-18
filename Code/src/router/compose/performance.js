'use strict'
// 加载依赖
const router = require('koa-router')()
const shopeInfoController = require('controllers/performance')
router
/**
 * @description: 店铺统计
 */
  .post('/shopee/performance', shopeInfoController.performance)

module.exports = router
