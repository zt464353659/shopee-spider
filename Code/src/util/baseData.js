/*
 * @Author: zhangzhengzhe
 * @Date: 2019-08-28 09:31:41
 * @LastEditors: zhangzhengzhe
 * @LastEditTime: 2019-09-02 15:04:58
 */
const qs = require('qs')
module.exports = {

  /**
   * @description: 会话聊天相关api
   * @param { Object } params 前端请求接口的所有参数
   */

  /**
   * @description: 店铺扣分
   */
  shopee: {
    performance: params => {
      return `/api/v2/shops/sellerCenter/shopPerformance/?SPC_CDS=${params.data.SPC_CDS}&SPC_CDS_VER=${params.data.SPC_CDS_VER}`
    },
    shop_info: params => {
      if(params.account.site !== 'tw') {
        return `https://${params.account.site}.xiapibuy.com/shop/${params.account.shop_id}/`
      } else {
        return `https://xiapi.xiapibuy.com/shop/${params.account.shop_id}/`
      }
    }
  }
}
