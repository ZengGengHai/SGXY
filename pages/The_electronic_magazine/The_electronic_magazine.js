// pages/The_electronic_magazine/The_electronic_magazine.js
import config from '../../config/config'
import constant from '../../config/constant'
import utils from '../../utils/utils'
import util from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://imgpub.chuangkit.com/designTemplate/2018/06/22/311437077_thumb?v=1530774240000&x-oss-process=image/resize,w_400',
      'https://imgpub.chuangkit.com/designTemplate/2018/06/22/311436966_thumb?v=1530598561000&x-oss-process=image/resize,w_400',
      'https://imgpub.chuangkit.com/designTemplate/2018/06/21/307949065_thumb?v=1529550721000&x-oss-process=image/resize,w_400'
    ],
    interval: 5000,
    duration: 1000,
    circular: true,
    leftMargin: '70rpx',
    rightMargin: '80rpx',
    currentIndex: 0,
    book_height:'',
    cover_img:[],
    limit:4,
    offset:0,
    buttonClicked: false,
  },
  handleChange: function (e) {
    this.setData({
      currentIndex: e.detail.current
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.cover_img();
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight) // 获取可使用窗口高度
        let windowHeight = (res.windowHeight * (750 / res.windowWidth)); //将高度乘以换算后的该设备的rpx与px的比例
        console.log(windowHeight) //最后获得转化后得rpx单位的窗口高度
        var book_height= windowHeight-430+"rpx"
        that.setData({
          book_height
        })
      }
    })
   

  },
  loading:function(){
    let timeoutId = utils.showLoadingToast('加载中...')
    util.buttonClicked(this);
    this.cover_img();

  },
  cover_img:function(){    //加载电子杂志

    var that=this
    var limit=this.data.limit
    var offset=this.data.offset
    var cover_img = this.data.cover_img
    let tableId = config.E_bool.MERCHANTS
    let Product = new wx.BaaS.TableObject(tableId)
   
   
    
  
    Product.limit(limit).offset(offset).orderBy('-created_at').find().then(res => {

      console.log(res.data)
    

      for (let i = 0; i < res.data.objects.length;i++){
        cover_img.push({
          book_title: res.data.objects[i].book_title,
          book_url: res.data.objects[i].book_url,
          chapter:res.data.objects[i].chapter,
          cover_img:res.data.objects[i].cover_img
           })
      }
    
      if (!res.data.meta.next){ 
        wx.showToast({
          title: '没有更多了',
          icon: 'loading',
          duration: 2000
        })
      }
      that.setData({
        cover_img: cover_img,
        offset: offset + 4
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