'use strict'
const performanceValidation = require('validation/shopee.serve')
const response = require('util/response')
const validator = require('util/requestValidator')
const { endCouponApi } = require('request/api')
const utils = require('util/utils')
module.exports = {
  /**
   * @description 终止广告优惠券  puppeteer
   */
  endCoupon: async(ctx, next) => {
    try {
      /* 验证参数 */
      await validator.validate(
          ctx.input,
          performanceValidation.endCoupon.schema,
          performanceValidation.endCoupon.options
      )
      const result = await endCouponApi.openIndex(ctx.input)
      return await response.output(ctx, result.data, result.code === 0 ? 200 : result.code, result.message)
    } catch (error) {
      utils.returnThrowError(error)
    }
  }
}
