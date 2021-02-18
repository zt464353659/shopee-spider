'use strict'
const performanceValidation = require('validation/shopee.serve')
const response = require('util/response')
const validator = require('util/requestValidator')
const performanceService = require('request/api')
const utils = require('util/utils')
module.exports = {
  /**
   * @description 设置店铺扣分  puppeteer
   */
  performance: async (ctx, next) => {
    try {
      /* 验证参数 */
      await validator.validate(
          ctx.input,
          performanceValidation.performance.schema,
          performanceValidation.performance.options
      )
      let result = await performanceService.performanceApi.openIndex(ctx.input).then(res => {
        return res
      })
      result = result.flat()
      const [account_healthy_info, penalty, rating, shop_quota, shop_detail] = result
      return await response.map(ctx, { account_healthy_info, penalty, rating, shop_quota, shop_detail })
    } catch (error) {
      utils.returnThrowError(error)
    }
  }
}
