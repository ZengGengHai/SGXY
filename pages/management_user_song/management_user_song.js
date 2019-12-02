// pages/management_user_song/management_user_song.js
import config from '../../config/config'
import constant from '../../config/constant'
import utils from '../../utils/utils'
import util from '../../utils/util'
const app = getApp()



Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_word_list: [],
    limit:8,
    offset:0,
    Tips: '点击加载用户评论'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.user_content();
  },
  user_content: function () {                  //加载用户评论
    var limit = this.data.limit
    var offset = this.data.offset

    let tableId = config.LEAVING_MESSAGES.MERCHANTS
    var Product = new wx.BaaS.TableObject(tableId)
    let user_id = app.getUserId();
    let query1 = new wx.BaaS.Query()
    query1.compare('created_by', '=', user_id)
    let query2 = new wx.BaaS.Query()
    query2.compare('type', '=', 'song')
    let andQuery = wx.BaaS.Query.and(query1, query2)

    Product.setQuery(andQuery).limit(limit).offset(offset).expand('created_by').orderBy('-created_at').find().then(res => {
      // success
      console.log(res)
      if (!res.data.meta.next) {
        console.log('fdf')
        this.setData({
          Tips: '没有更多评论了',
          Load_complete: true

        })
      }
      var user_word_list = this.data.user_word_list
      let content_time
      let user_name
      let content_id
      let user_img
      let content
      let created_by
      
      console.log(user_id)
      for (let i = 0; i < res.data.objects.length; i++) {
      
         
        
        user_word_list.push({
          content: res.data.objects[i].content,
          content_id: res.data.objects[i].id,
          content_time: util.diaplayTime(res.data.objects[i].created_at),
          user_name: res.data.objects[i].created_by.nickname,
          user_img: res.data.objects[i].created_by.avatar,
          created_by: res.data.objects[i].created_by.id,
          is_me: true

        })
      }
      console.log(user_word_list)
      this.setData({
        user_word_list,
        offset: offset + 8
      })


    }, err => {
      // err
    })
  },
  delete_content: function (e) {
    util.buttonClicked(this);  //删除数据防止按钮点击两次
    this.delete(e);
  
  },
  delete: function (e) {       //删除数据

    let timeoutId = utils.showLoadingToast('加载中...')

    let index = e.currentTarget.dataset.index
    const user_word_list = this.data.user_word_list

    let tableId = config.LEAVING_MESSAGES.MERCHANTS
    let recordID = e.currentTarget.dataset.id

    let Product = new wx.BaaS.TableObject(tableId)
    Product.delete(recordID).then(res => {
      // success
      let hide = utils.hideLoadingToast()
      user_word_list.splice(index, 1)  //删除某一项
      this.setData({
        user_word_list
      })
    }, err => {
      // err
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