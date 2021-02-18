'use strict'
const Joi = require('@hapi/joi')

module.exports = {

  /**
   * @description: shopee后台登录模拟
   * @param { String } platform 平台标识
   * @param { String } username 用户名
   * @param { String } password   密码
   * @param { Number } day       预购时间
   */
  dts: {
    schema: Joi.object({
      platform: Joi.string().required(),
      data: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        day: Joi.string().required()
      }).required()
    }),
    options: {
      // 允许存在不在 schema 中的字段
      allowUnknown: true,
      // 过滤不存在 schema 中的字段
      stripUnknown: true,
      // 替换提示文本
      language: {
        any: {
          required: '是必填项'
        }
      }
    }
  },

  /**
   * @description: shopee后台登录模拟
   * @param { String } platform 平台标识
   * @param { String } username 用户名
   * @param { String } password   密码
   * @param { Number } day       预购时间
   */
  performance: {
    schema: Joi.object({
      platform: Joi.string().required(),
      data: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
      }).required()
    }),
    options: {
      // 允许存在不在 schema 中的字段
      allowUnknown: true,
      // 过滤不存在 schema 中的字段
      stripUnknown: true,
      // 替换提示文本
      language: {
        any: {
          required: '是必填项'
        }
      }
    }
  },

  /**
   * @description: shopee后台广告获取数据
   * @param { String } platform   平台标识
   * @param { String } username   用户名
   * @param { String } password   密码
   * @param { String } start_time 开始时间(秒)
   * @param { String } end_time   结束时间(秒)
   */
  adsInfo: {
    schema: Joi.object({
      platform: Joi.string().required(),
      data: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        start_time: Joi.string().required(),
        end_time: Joi.string().required()
      }).required()
    }),
    options: {
      // 允许存在不在 schema 中的字段
      allowUnknown: true,
      // 过滤不存在 schema 中的字段
      stripUnknown: true,
      // 替换提示文本
      language: {
        any: {
          required: '是必填项'
        }
      }
    }
  },

  /**
   * @description: shopee后台登录模拟
   * @param { String } platform 平台标识
   * @param { String } username 用户名
   * @param { String } password   密码
   * @param { Number } day       预购时间
   */
  amount: {
    schema: Joi.object({
      platform: Joi.string().required(),
      data: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
      }).required()
    }),
    options: {
      // 允许存在不在 schema 中的字段
      allowUnknown: true,
      // 过滤不存在 schema 中的字段
      stripUnknown: true,
      // 替换提示文本
      language: {
        any: {
          required: '是必填项'
        }
      }
    }
  },
  /**
   @description: shopee后台创建满减优惠券
   * @param { String } platform 平台标识
   * @param { String } username 用户名
   * @param { String } password   密码
   * @param { String } site       shopee站点
   * @param { Object } data       创建优惠券表单信息
   */
  createCoupon: {
    schema: Joi.object({
      platform: Joi.string().required(),
      data: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        site: Joi.string().required(),
        data: Joi.object().required()
        })
    }),
    options: {
      // 允许存在不在 schema 中的字段
      allowUnknown: true,
      // 过滤不存在 schema 中的字段
      stripUnknown: false,
      // 替换提示文本
      language: {
        any: {
          required: '是必填项'
        }
      }
    }
  },
  /**
   @description: shopee后台删除满减优惠券
   * @param { String } platform 平台标识
   * @param { String } username 用户名
   * @param { String } password   密码
   * @param { String } site       shopee站点
   * @param { Object } data       删除优惠券表单信息
   */
  deleteCoupon: {
    schema: Joi.object({
      platform: Joi.string().required(),
      data: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        data: Joi.object().required()
      }).required()
    }),
    options: {
      // 允许存在不在 schema 中的字段
      allowUnknown: true,
      // 过滤不存在 schema 中的字段
      stripUnknown: false,
      // 替换提示文本
      language: {
        any: {
          required: '是必填项'
        }
      }
    }
  },
  /**
   @description: shopee后台end满减优惠券
   * @param { String } platform 平台标识
   * @param { String } username 用户名
   * @param { String } password   密码
   * @param { String } site       shopee站点
   * @param { Object } data       删除优惠券表单信息
   */
  endCoupon: {
    schema: Joi.object({
      platform: Joi.string().required(),
      data: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        data: Joi.object().required()
      }).required()
    }),
    options: {
      // 允许存在不在 schema 中的字段
      allowUnknown: true,
      // 过滤不存在 schema 中的字段
      stripUnknown: false,
      // 替换提示文本
      language: {
        any: {
          required: '是必填项'
        }
      }
    }
  }
}
