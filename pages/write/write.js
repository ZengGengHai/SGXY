// pages/write/write.js

import config from '../../config/config'
import constant from '../../config/constant'
import utils from '../../utils/utils'
import util from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonClicked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  input:function (e) {    //先判断输入是否为空
    util.buttonClicked(this);
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];   //上一个页面
    var inputValue = prevPage.data.inputValue
    if (inputValue === "") {
      wx.showToast({
        title: '输入内容为空',
        icon: 'loading',
        duration: 2000
      })
    } else {
      console.log(prevPage)
      this.identity(e);
      // wx.navigateBack({
      //   delta: 1  // 返回上一级页面。
      // })



    }
  },
  bindKeyInput(e) {          //价盘输入
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];   //上一个页面

    prevPage.setData({
      inputValue: e.detail.value
    })

  },
  identity: function (e) {           //进行身份验证函数
  
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];   //上一个页面

    var that = this
    try {
      var Student_ID = wx.getStorageSync('Student_ID')
      var identity = wx.getStorageSync('identity')
      var userInfo = wx.getStorageSync('userInfo')


      if (Student_ID && identity === '解除绑定' && userInfo) {
        // Do something with return value
        console.log('解除绑定', Student_ID)
        var user_image = prevPage.data.userInfo.avatarUrl
        var user_name = prevPage.data.userInfo.nickName


        prevPage.input_content(e);  //验证成功就可以留言
        // console.log('dfjfjdfkjdfkjdfkjk')
      } else {

        wx.showModal({
          title: '你未授权信息或者身份验证',
          content: '如需跳转到个人主页进行验证，请点击确认进行跳转。',
          success: function (res) {
            if (res.cancel) {
              console.log('用户点击取消')

            } else if (res.confirm) {
              wx.navigateTo({

                url: '../person/person?open=' + 'image_fllow',
              })

            }
          }
        })
      }
    } catch (e) {

    }

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
  onShareAppMessage: function () {

  }
})