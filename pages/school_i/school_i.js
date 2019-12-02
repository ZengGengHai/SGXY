// pages/school_i/school_i.js
import config from '../../config/config'
import constant from '../../config/constant'
import utils from '../../utils/utils'
import util from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    School_introduction:'',
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.School_introduction();

  },
  //学校简介事件
  School_introduction: function () {
    let timeoutId = utils.showLoadingToast('加载中...')
    var that = this
    let tableId = config.SCHOOL_INTRODUCTION_ID.MERCHANTS
    let MyTableObject = new wx.BaaS.TableObject(tableId)
    let RECORDID = config.SCHOOL_INTRODUCTION_ID.RECORDID
    console.log(RECORDID)
    MyTableObject.get(RECORDID).then(res => {
      var data = {
        Description: res.data.description,  //学校介绍
        ImageUrl: res.data.image     //学校景点轮播图
      };
      console.log(data)
      that.setData({
        School_introduction: data,
        tabClick_one: true

      })
      let hide = utils.hideLoadingToast()
    }, err => {

    })
    // err
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