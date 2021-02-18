'use strict'
const performanceValidation = require('validation/shopee.serve')
const response = require('util/response')
const validator = require('util/requestValidator')
const { createCouponApi } = require('request/api')
const utils = require('util/utils')
module.exports = {
  /**
   * @description 创建广告优惠券  puppeteer
   */
  createCoupon: async(ctx, next) => {
    try {
      /* 验证参数 */
      await validator.validate(
          ctx.input,
          performanceValidation.createCoupon.schema,
          performanceValidation.createCoupon.options
      )
      const result = await createCouponApi.openIndex(ctx.input)
      return await response.output(ctx, result.data, result.code === 0 ? 200 : result.code, result.message)
    } catch (error) {
      utils.returnThrowError(error)
    }
  }
}
