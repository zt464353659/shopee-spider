'use strict'
const DTSValidation = require('validation/shopee.serve')
const response = require('util/response')
const validator = require('util/requestValidator')
const DTSService = require('request/api')
const utils = require('util/utils')
module.exports = {
  /**
   * @description 设置dts  puppeteer
   */
  setDts: async(ctx, next) => {
    try {
      /* 验证参数 */
      await validator.validate(
        ctx.input,
        DTSValidation.dts.schema,
        DTSValidation.dts.options
      )
      const result = await DTSService.dtsApi.openIndex(ctx.input).then(res => { return res })
      return result.status ? await response.map(ctx, result) : utils.returnThrowError(result.message)
    } catch (error) {
      utils.returnThrowError(error)
    }
  }
}
