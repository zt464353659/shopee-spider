'use strict'
const adsInfoValidation = require('validation/shopee.serve')
const response = require('util/response')
const validator = require('util/requestValidator')
const amountService = require('request/api')
const utils = require('util/utils')
module.exports = {
  /**
   * @description 获取订单金额  puppeteer
   */
  adsInfo: async (ctx, next) => {
    try {
      /* 验证参数 */
      await validator.validate(
        ctx.input,
        adsInfoValidation.adsInfo.schema,
        adsInfoValidation.adsInfo.options
      )
      const result = await amountService.adsInfoApi.openIndex(ctx.input).then(res => {
        return res
      })
      return await response.map(ctx, { ...result })
    } catch (error) {
      utils.returnThrowError(error)
    }
  }
}
