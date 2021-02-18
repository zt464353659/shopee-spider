/*
 * @Author: zhangzhengzhe
 * @Date: 2019-06-20 16:47:25
 * @LastEditors: zhangzhengzhe
 * @LastEditTime: 2019-09-10 15:38:24
 */
'use strict'
const axios = require('axios')
const filterUrl = [
  '/api/v2/authentication/login',
  '/buyer/login/login_post/',
  '/api/v2/login/'
]
/** 写入cookie */
const writeCookie = async params => {
  if (
    params.config.url.indexOf(filterUrl[0]) !== -1 ||
    params.config.url.indexOf(filterUrl[1]) !== -1 ||
    params.config.url.indexOf(filterUrl[2]) !== -1
    ) {   // 将文件写入json
    const cookies = params['headers']['set-cookie']
    const strCookie = {
      userid: '',
      data: []
    }
    if (cookies && cookies.length > 0) {
      cookies.forEach((item, index) => {
        const value = item.split(';')[0]
        if (value.indexOf('SPC_U') !== -1) {
          strCookie.userid = value.split('=')[1]
        }
        // if (filterCookie.includes(value.split('=')[0])) {
        const newKeys = value.slice(0, value.indexOf('='))
        const newValue = value.slice(value.indexOf('=') + 1).replace(/"/g, '')
        strCookie.data.push({
          name: newKeys,
          value: newValue
        })
      })
      process.COOKIE = strCookie
    }
  }
}

/**  axios 标准处理，如果项目需要特殊处理，可以在接口位置单独处理 */
const axiosInstance = axios.create()

/** 静态请求数据*/
axiosInstance.defaults.timeout = 6000000 // 1000 * 6000
/** 请求数据拦截器*/
axiosInstance.requestData = function(config) {
  return config
}
/** 返回数据拦截器*/
axiosInstance.responseData = function(response) {
  writeCookie(response)
  return response
}
/** 请求异常处理*/
axiosInstance.error = function(error) {
  return error
}

/** 请求拦截器*/
axiosInstance.interceptors.request.use(function(config) {
  config = requestDataByConfig(config)
  return config
})

/** 请求返回拦截器*/
axiosInstance.interceptors.response.use(function(response) {
  response = axiosInstance.responseData(response)
  return response.data
}, function(error) {
  error = axiosInstance.error(error)
  return Promise.reject(error.message)
})

/** 请求数据前，先进行一层封装 判断*/
async function requestDataByConfig(config) {
  // console.log(`post config ===> ${JSON.stringify(config)}`)
  return axiosInstance.requestData(config)
}

module.exports = axiosInstance
