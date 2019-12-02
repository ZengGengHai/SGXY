// pages/my_release/my_release.js
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

  },
  song:function(){
    wx.navigateTo({
      url: '../management_user_song/management_user_song',
    })
  },
  publish: function () {  //跳转发布页面
    wx.navigateTo({
      url: '../publish/publish',
    })
  },
  shoucang: function () {
    wx.navigateTo({
      url: '../shoucang/shoucang',
    })
  },
  my_focus:function(){
    wx.navigateTo({
      url: '../img_fllow/img_fllow?is_share='+'false',
    })
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