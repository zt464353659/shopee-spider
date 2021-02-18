/*
 * @Author: zhangzhengzhe
 * @Date: 2019-06-20 17:13:33
 * @LastEditors: zhangzhengzhe
 * @LastEditTime: 2019-08-27 17:52:57
 */
'use strict'
const Joi = require('@hapi/joi')
const ApiError = require('errorException/apiError')

module.exports = {
  validate: async function(data, schema, options = {}) {
    await Joi.validate(data, schema, options).then(function(data) {
      // console.log(`validate data ==> ${JSON.stringify(data)}`)
    }).catch(function(err) {
      throw new ApiError('request.paramError', err.message)
    })
  }
}
