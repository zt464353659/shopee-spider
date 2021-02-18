'use strict'
const performanceValidation = require('validation/shopee.serve')
const response = require('util/response')
const validator = require('util/requestValidator')
const { deleteCouponApi } = require('request/api')
const utils = require('util/utils')
module.exports = {
  /**
   * @description 设置店铺扣分  puppeteer
   */
  deleteCoupon: async(ctx, next) => {
    try {
      /* 验证参数 */
      await validator.validate(
          ctx.input,
          performanceValidation.deleteCoupon.schema,
          performanceValidation.deleteCoupon.options
      )
      const result = await deleteCouponApi.openIndex(ctx.input)
      return await response.output(ctx, result.data, result.code === 0 ? 200 : result.code, result.message)
    } catch (error) {
      utils.returnThrowError(error)
    }
  }
}
