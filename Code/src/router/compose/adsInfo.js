'use strict'
// 加载依赖
const router = require('koa-router')()
const shopeAdsInfoController = require('controllers/adsInfo')
router
/**
 * @description: 广告数据
 */
.post('/shopee/ads-info', shopeAdsInfoController.adsInfo)

module.exports = router