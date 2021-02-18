/*
 * @Author: zhangzhengzhe
 * @Date: 2019-06-20 17:11:24
 * @LastEditors: zhangzhengzhe
 * @LastEditTime: 2019-09-18 10:31:21
 */

'use strict'
/**
 * errorName: {code, message, status}
 * 错误名: {错误码, 错误信息, http状态码}
 */

const defines = {
  'common.all': { code: 1000, message: '%s', status: 200 },
  'access.forbidden': { code: 1001, message: '没有操作权限,请联系开发人员!', status: 200 },
  'auth.notPermission': { code: 1001, message: '授权失败: %s', status: 200 },
  'role.notExist': { code: 1001, message: '角色不存在,请联系开发人员!', status: 200 },
  'auth.codeExpired': { code: 1001, message: '授权码已失效,请联系开发人员重新获取!', status: 200 },
  'auth.codeError': { code: 1001, message: '授权码错误,请联系开发人员重新获取!', status: 200 },
  'auth.pargramNotExist': { code: 1001, message: '程序不存在！', status: 200 },
  'auth.pargramSecretError': { code: 1001, message: '程序秘钥错误,请联系开发人员!', status: 200 },
  'auth.pargramSecretEmpty': { code: 1001, message: '程序秘钥为空，请联系开发人员配置!', status: 200 },
  'auth.valid': { code: 1001, message: '账号或错误密码,请登录shoppe平台手动输入验证码!', status: 200 },
  'auth.validfail': { code: 1001, message: '第三方资源请求失败,请稍后再试!', status: 200 },
  'auth.passwordfail': { code: 1001, message: '密码错误,请核对后在操作,请稍后再试!', status: 200 },
  'auth.usernamefail': { code: 1001, message: '用户名错误,请核对后在操作,请稍后再试!', status: 200 },
  'auth.loginerror': { code: 1001, message: '登陆失败,请校验您的用户名或密码!', status: 200 },
  'auth.servererror': { code: 1001, message: '登陆平台失败,请稍后后再试!', status: 200 },
  'auth.loginagain': { code: 1001, message: '重复登录!', status: 200 },
  'auth.gateway': { code: 1001, message: '网关错误，请联系开发人员!', status: 200 },
  'TimeoutError': { code: 1001, message: 'shopee平台服务链接失败,请稍后再试!', status: 200 },

  // request 错误类型
  'request.connectFail': { code: 1001, message: 'shopee平台服务链接失败,请稍后再试!', status: 200 },
  'request.paramError': { code: 1001, message: '参数错误: %s', status: 200 },
  'request.error': { code: 1001, message: '第三方平台连接失败,请稍后再试!', status: 200 },
  'request.timeout': { code: 1001, message: '第三方平台连接超时,请稍后再试!', status: 200 },
  'request.rangeError': { code: 1001, message: '数值越界!', status: 200 },
  'request.referenceError': { code: 1001, message: '非法或不能识别的引用数值!', status: 200 },
  'request.syntaxError': { code: 1001, message: '发生语法解析错误!', status: 200 },
  'request.typeError': { code: 1001, message: '操作数类型错误!', status: 200 },
  'request.URIError': { code: 1001, message: 'URI处理函数使用不当!', status: 200 },
  'request.header': { code: 1001, message: 'header获取失败,请稍后再试!', status: 200 },
  'request.cookie': { code: 1001, message: 'cookie获取失败,请稍后再试!', status: 200 },
  'request.nonedata': { code: 1001, message: '已经没有数据了!', status: 200 },
  'request.notfound': { code: 1001, message: '请求地址出错!', status: 200 },
  'request.resInvalid': { code: 1001, message: '请求无效,请联系开发人员!', status: 200 },
  'request.resattempt': { code: 1001, message: '请求尝试三次失败!', status: 200 },
  'request.disconnect': { code: 1001, message: '与平台连接断开，请稍后再试!', status: 200 }

}

module.exports = function(errorName, params) {
  if (defines[errorName]) {
    const result = {
      code: defines[errorName].code,
      message: defines[errorName].message,
      status: defines[errorName].status
    }
    params.forEach(element => {
      if (element.indexOf('参数错误') !== -1) {
        result.message = element
      } else {
        result.message = result['message'].replace('%s', element)
      }
    })

    return result
  } else if (errorName) {
    let result = ''
    params.forEach(element => {
      result = element
    })
    return {
      code: 1001,
      message: result,
      status: 200
    }
  } else {
    return {
      code: 1000,
      message: '服务器内部错误,请联系开发人员!',
      status: 200
    }
  }
}
