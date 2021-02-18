'use strict'
const shopAdsDataValidation = require('validation/shopee.serve')
const response = require('util/response')
const validator = require('util/requestValidator')
const { shopAdsData } = require('request/api')
const utils = require('util/utils')
module.exports = {
  /**
   * @description 设置dts  puppeteer
   */
  shopAds: async(ctx, next) => {
    try {
      /* 验证参数 */
      await validator.validate(
          ctx.input,
          shopAdsDataValidation.adsInfo.schema,
          shopAdsDataValidation.adsInfo.options
      )
      const result = await shopAdsData.openIndex(ctx.input)
      let obj = {
        keyword_data: result[0].length > 5 ? result[0].slice(5) : [],
        targeting_data: result[1].length > 5 ? result[1].slice(5) : [],
        shop_data: result[2].length > 5 ? result[2].slice(5) : []
      }
      obj = JSON.parse(JSON.stringify(obj).replace(/﻿Adwords/g,'Adwords'))
      return await response.map(ctx, obj)
    } catch (error) {
      utils.returnThrowError(error)
    }
  }
}
