// pages/song_name_more/song_name_more.js

import config from '../../config/config'
import constant from '../../config/constant'
import utils from '../../utils/utils'
import util from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    song_List: [],
    limit:10,
    offset:0,
    Tips: '点击加载更多',
    Load_complete: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.song_list();
  },
  song_list: function () {
    var that = this

    let tableId = config.CHOOSE_SONG.MERCHANTS
    var Product = new wx.BaaS.TableObject(tableId)
    var limit=this.data.limit
    var offset=this.data.offset

    Product.limit(limit).offset(offset).orderBy('-created_at').find().then(res => {
      // success
      console.log(res.data.objects)
      if (!res.data.meta.next) { 
        this.setData({
          Tips: '没有更多了',
          Load_complete: true

        })
      }

      var song_List = []
      var song_time = ""
      var song_name = []
      var song_id = ""
      var open = ""

      for (let i = 0; i < res.data.objects.length; i++) {
        song_List.push({
          song_id: res.data.objects[i].id,
          song_time: util.js_date_time(res.data.objects[i].created_at),
          song_name: res.data.objects[i].song_name,
          open: false
        })
      }
      console.log(song_List)
      that.setData({
        song_List: song_List,
        offset:offset+10
      })
    }, err => {
      // err
    })
  },
  see: function (e) {     //歌曲展示详情
    console.log(e)
    var id = e.currentTarget.dataset.id
    const song_List = this.data.song_List
    for (let i = 0, len = song_List.length; i < len; ++i) {
      if (song_List[i].song_id === id) {
        song_List[i].open = !song_List[i].open
      } else {
        song_List[i].open = false
      }
    }
    console.log(song_List)
    this.setData({
      song_List
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