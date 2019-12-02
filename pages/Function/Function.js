// pages/Function/Function.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  water_electric:function(){
    wx.navigateTo({
      url: '../inquiry_water_electric/inquiry_water_electric',
    })
  },
  
  choose_song:function(){
    wx.navigateTo({
      url: '../choose_song/choose_song',
    })
  },
  E_book:function(){
    wx.navigateTo({
      url: '../The_electronic_magazine/The_electronic_magazine',
    })
  },
  school_new:function(){
    wx.navigateTo({
      url: '../school_new/school_new',
    })
  },
  school_i:function(){
    wx.navigateTo({
      url: '../school_i/school_i',
    })
    console.log('a');
    console.log('a');
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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