// pages/school_new/school_new.js

import config from '../../config/config'
import constant from '../../config/constant'
import utils from '../../utils/utils'
import util from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    news_limit: 6,
    news_offset: 0,
    NewsArray: [],//韶大报告
    next: true,
    scrollTop: 0,
    prompt: "滑动或者点击加载更多",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.School_news();
   

  },

  //学校新闻部分
  School_news: function () {
    let timeoutId = utils.showLoadingToast('加载中...')
    var that = this
    let tableId = config.SCHOOL_NEWS.MERCHANTS
    var Product = new wx.BaaS.TableObject(tableId)
    var limit = this.data.news_limit
    var offset = 0
    Product.orderBy('-created_at').limit(limit).offset(offset).find().then(res => {
      console.log(res)
      var Array = []
      that.setData({
        next: true,
        news_offset: 0,
        next: true,
        tabClick_two: true

      })
      for (var i = 0; i < res.data.objects.length; i++) {
        var News = {
          new_seen: false,
          new_counter: res.data.objects[i].counter,
          new_id: res.data.objects[i]._id,
          new_title: res.data.objects[i].new_title,
          new_content: res.data.objects[i].content,
          new_origin: res.data.objects[i].origin,
          new_time: util.js_date_time(res.data.objects[i].created_at),
          new_open: false
        }
        Array.push(News)
      }
      console.log(Array)
      let hide = utils.hideLoadingToast()
      that.setData({
        NewsArray: Array,
        news_offset: 5,

      })

      that.setData({
        NewsArray: Array
      })


    }, err => {
      // err
    })

  },

  //韶院消息更新
  school_news_input: function () {
    var that = this
    let tableId = config.SCHOOL_NEWS.MERCHANTS
    var Product = new wx.BaaS.TableObject(tableId)
    var limit = this.data.news_limit
    var offset = this.data.news_offset
    Product.orderBy('-created_at').limit(limit).offset(offset).find().then(res => {

      var next = that.data.next
      console.log(next, 'next')
      if (next) {
        var Array = that.data.NewsArray
        var Array_next = res.data.meta.next
        if (Array_next === null) {
          console.log('空')
          this.setData({
            next: false,
            prompt: '- End -'
          })
        }
        let timeoutId = utils.showLoadingToast('加载中...')
        for (var i = 0; i < res.data.objects.length; i++) {
          var News = {
            new_seen: false,
            new_counter: res.data.objects[i].counter,
            new_id: res.data.objects[i]._id,
            new_title: res.data.objects[i].new_title,
            new_content: res.data.objects[i].content,
            new_time: util.js_date_time(res.data.objects[i].created_at),
            new_origin: res.data.objects[i].origin,
            new_open: false
          }

          Array.push(News)
        }
        console.log(Array)
        var news_offset = this.data.news_offset + 5
        let hide = utils.hideLoadingToast()
        that.setData({
          NewsArray: Array,
          news_offset: news_offset,
          NewsArray: Array
        })
      } else {
        let hide = utils.hideLoadingToast()

      }






    }, err => {
      // err
    })
  },

  //韶院消息下滑到底部事件
  lower: function (e) {
    console.log(e)
    this.school_news_input()
  },


  //新闻单独板块点击事件
  News: function (res) {     //点击新闻，实现开合功能，看过的板块并且观看数量加一
    console.log(res, 'ffsfsfsfs')

    var id = res.currentTarget.dataset.id
    var new_counter = res.currentTarget.dataset.new_content
    var new_seen = res.currentTarget.dataset.new_seen
    var open = !res.currentTarget.dataset.open
    var NewsArray = this.data.NewsArray
    NewsArray.forEach((elem, idx) => {
      if (elem.new_id == id) {
        elem.new_open = open
        if (!elem.new_seen) {   //看过的新闻假数据加一，但不渲染出来，下次别人点击才真数据，所以后台数据还是要改动
          elem.new_counter = elem.new_counter + 1  //点击数假装加一

          let tableID = config.SCHOOL_NEWS.MERCHANTS  //点击数真实后台加一
          let recordID = elem.new_id
          let Product = new wx.BaaS.TableObject(tableID)
          let product = Product.getWithoutData(recordID)
          var newNumber = elem.new_counter
          product.set('counter', newNumber)
          product.update().then(res => {
            console.log("后台数据更新成功")
          }, err => {

          })

        }
        elem.new_seen = true

      }
    })
    this.setData({
      NewsArray,
    })
    var NewsArray = this.data.NewsArray
    console.log(NewsArray)


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