'use strict'
// 加载依赖
const router = require('koa-router')()
const shopeAdsDataController = require('controllers/shopAdsData')
router
    /**
     * @description: 广告数据
     */
    .post('/shopee/shop-ads-data', shopeAdsDataController.shopAds)

module.exports = router