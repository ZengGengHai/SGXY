// pages/img_fllow/img_fllow.js
import config from '../../config/config'

import utils from '../../utils/utils'
import util from '../../utils/util'

const app = getApp();

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
    var is_share = options.is_share
    
    this.focus_user_list();
  },
  focus_user_list: function () {   //关注作者
    var that = this
    let user_id = wx.BaaS.storage.get('uid')
    let tableID = config.Focus_on_users.MERCHANTS
    let query1 = new wx.BaaS.Query()
    query1.compare('created_by', '=', parseInt(user_id))


    // let andQuery = wx.BaaS.Query.and(query1, query2)

    let Product = new wx.BaaS.TableObject(tableID)
    Product.setQuery(query1).expand(['focus_id']).find().then(res => {
     console.log(res)
      var options=res.data.objects;
      
      that.setData({
        options,
      })
    }, err => {
      // err
    })

   

  },
  person_info: function (e) {


    console.log(e)
    var user_id = e.currentTarget.dataset.user_id
    var user_name = e.currentTarget.dataset.user_name
    var user_image = e.currentTarget.dataset.user_image

    var is_share = this.data.is_share


    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];   //上一个页面

    console.log(prevPage)

    if (!is_share) {


      console.log(prevPage)
      if (prevPage.route === 'pages/School_Introduction/School_Introduction' || prevPage.route === 'pages/my_release/my_release' || prevPage.route ==="pages/person/person") {
        wx.navigateTo({
          url: '../img_person/img_person?user_id=' + user_id + '&user_name=' + user_name + '&user_image=' + user_image,
        })
      } else {
        wx.navigateBack({
          delta: 1  // 返回上一级页面。
        })
      }
    } else {


      wx.navigateTo({
        url: '../img_person/img_person?user_id=' + user_id + '&user_name=' + user_name + '&user_image=' + user_image,
      })


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