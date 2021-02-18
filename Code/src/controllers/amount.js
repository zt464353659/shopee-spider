'use strict'
const amountValidation = require('validation/shopee.serve')
const response = require('util/response')
const validator = require('util/requestValidator')
const amountService = require('request/api')
const utils = require('util/utils')
module.exports = {
  /**
   * @description 获取订单金额  puppeteer
   */
  amount: async (ctx, next) => {
    try {
      /* 验证参数 */
      await validator.validate(
          ctx.input,
          amountValidation.amount.schema,
          amountValidation.amount.options
      )
      const result = await amountService.orderAmountApi.openIndex(ctx.input).then(res => {
        return res
      })
      const rating = result.rating
      return await response.map(ctx, { rating })
    } catch (error) {
      utils.returnThrowError(error)
    }
  }
}
