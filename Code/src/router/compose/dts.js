'use strict'
// 加载依赖
const router = require('koa-router')()
const shopeDtsController = require('controllers/dts')
router
/**
 * @description: 设置dts
 */
  .post('/shopee/dts/set', shopeDtsController.setDts)

module.exports = router
