// pages/my_upload_img/my_upload_img.js

import config from '../../config/config'
import constant from '../../config/constant'
import utils from '../../utils/utils'
import util from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  // '韶院风景', '思维创意', '校园生活', '校园美食', '校园萌宠', '毕业剪影', '其它类别'
  data: {
    img_url:'',
    imgWidth:0,
    scroll_H:0,
    imgHeight:0,
    input_style:[{
      index:0,
      style: ['韶院风景'],
      Selected:false,
      },{
        index:1,
          style: ['思维创意'],
        Selected:false,
      },{
        index:2,
          style: ['校园生活'],
        Selected: false,
      },{
        index:3,
          style: ['校园美食'],
        Selected: false,
      },{
        index:4,
          style: ['校园萌宠'],
        Selected:false,
      },{
        index:5,
          style: ['毕业剪影'],
        Selected:false,
      },{
        index:6,
          style: ['其它类别'],
        Selected:true,
      }],
    hasLocation:false,
    locationAddress:'',
    longitude:"",
    latitude:"",
    chooseStyle:['其它类别'],
    inputWord:"",
    buttonClicked: false,


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    console.log(options)
    var img_url=options.img
    this.setData({
      img_url,
    })
    wx.getSystemInfo({//获取屏幕宽高
      success: function (res) {
        var _width = res.windowWidth;
        var imgWidth = _width * 0.60; //样式表里面设置的宽度
        var scroll_H = res.windowHeight * (750 / res.windowWidth);

        that.setData({
          scroll_H: scroll_H,
          imgWidth: imgWidth
        })
      }
    })

  },
  img:function(e){
    console.log(e)
    
    var imgWidth = this.data.imgWidth;//图片设置的宽度
    var oImgW = e.detail.width;//图片原始宽度
    var scal = imgWidth / oImgW;//比例计算
    var oImgH = e.detail.height;//图片原始高度
    var imgHeight = oImgH * scal;//自适应高度
    this.setData({
      imgHeight,
    })

    
  },
  InputWord:function(e){
    console.log(e.detail.value)
    this.setData({
      inputWord:e.detail.value
    })


  },
  chooseStyle:function(e){
    console.log(e)
    var id=e.currentTarget.dataset.id
    var style=e.currentTarget.dataset.style
    var input_style = this.data.input_style
    input_style.forEach((elem, idx) => {
      if (elem.index === id) {
        elem.Selected=true
      }else{
        elem.Selected = false
      }
    }) 
    this.setData({
      input_style,
      chooseStyle:style
    }) 

  },
  chooseLocation() {
    const that = this
    wx.chooseLocation({
      success(res) {
        console.log(res)
        that.setData({
          hasLocation: true,
          longitude: res.longitude,
          latitude: res.latitude,
          locationAddress: res.address
        })
      }
    })
  },
  clear:function(){
    this.setData({
      hasLocation: false,
      longitude: "",
      latitude:"",
      locationAddress:""
    })
  },
  InputImg:function(){
    util.buttonClicked(this);  //删除数据防止按钮点击两次
    let timeoutId = utils.showLoadingToast('投稿中')
      
    try {
      var Student_ID = wx.getStorageSync('Student_ID')  
      var userInfo = wx.getStorageSync('userInfo')
      

    } catch (e) {
    }
   
    
    var longitude = this.data.longitude+''
    var latitude = this.data.latitude+''
    var category = this.data.chooseStyle
    
    var inputWord = this.data.inputWord
    var img_usr=this.data.img_url
  


    let MyFile = new wx.BaaS.File()
    let fileParams = { filePath: img_usr }
    let metaData = { categoryName: '韶关学院图片' }
    MyFile.upload(fileParams, metaData).then(res => {
      let data = res.data  // res.data 为 Object 类型
      console.log(data)
      let tableID = config.IMAGE_ID.MERCHANTS
      let Image = new wx.BaaS.TableObject(tableID)
      let image = Image.create()
      // image.set('user_image', user_image)
      var user_name = userInfo.nickname
      image.set('user_name', user_name) 
      image.set('ImageUrl', data.path)   //图片
      image.set('ImageId', data.file.id) //图片id
      image.set('Time', 'today')        
      image.set('Student_ID', Student_ID)
      image.set('content', inputWord)
      image.set('category',category)
      image.set('latitude',latitude)
      image.set('longitude',longitude)

      image.save().then(res => { 
        console.log(res)
        let hide = utils.hideLoadingToast()
        if (res.errMsg ==='request:ok'){
          wx.showToast({
            title: '投稿成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateBack({
            delta:2
          });
        }
      }, err => { })
    }, err => {

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