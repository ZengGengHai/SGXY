// pages/draw_head_portrait/draw_head_portrait.js
import config from '../../config/config'
import constant from '../../config/constant'
import utils from '../../utils/utils'
import util from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    var that = this

    let timeoutId = utils.showLoadingToast('加载中...')
   
 
   
     let tableID = config.HEAD_PROTRAIT_ID.MERCHANTS
      var Product = new wx.BaaS.TableObject(tableID)  //查询数据项
      Product.limit(200).offset(0).orderBy('created_at').find().then(res => {
        // success
        console.log(res)

        for (var i = 0; i < res.data.meta.total_count; i++) {
          history_list.push({ year: res.data.objects[i].year, title: res.data.objects[i].title, content: res.data.objects[i].content })

        }
        that.setData({
          history_list: history_list
        })
        console.log(history_list)
      }, err => {
        // err
      })



      let hide = utils.hideLoadingToast()
   

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log("来自页面内转发按钮");
      console.log(res.target);
    }
    else {
      console.log("来自右上角转发菜单")
    }
    return {
      title: '韶院校园小程序',
      path: '/pages/index/index',
      imageUrl: "../../images/oo.png",
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})