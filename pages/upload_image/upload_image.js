// pages/upload_image/upload_image.js

import config from '../../config/config'
import constant from '../../config/constant'
import utils from '../../utils/utils'
import util from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
  number:'',
  user_image:'',
  user_name:'',
  Student_ID:'',
  uploadNumber: config.IMAGE_ID.MERCHANTS.EVERYDAY,
  buttonClicked: false,
  },
  number: function () {
    var that = this
    let tableID = config.IMAGE_ID.MERCHANTS
    var Product = new wx.BaaS.TableObject(tableID)
    var category = ['花卉植物','韶院建筑','多彩人物','优美风景','思维创意','校园生活','校园美食','校园动物','其它类别']
    var query1 = new wx.BaaS.Query()
    query1.in('category', category)
    let query2 = new wx.BaaS.Query()
    query2.compare('Time', '=', 'today')
    let andQuery = wx.BaaS.Query.and(query1, query2)
    let timeoutId = utils.showLoadingToast('加载中...')
    Product.setQuery(andQuery).orderBy('-created_at').limit(200).offset(0).find().then(res => {
      let hide = utils.hideLoadingToast()
      console.log(res.data.meta.total_count)
      that.setData({
        number:res.data.meta.total_count
      })
    
    }, err => {
    })

  },
  upload_image: function () {    //进行图片上传函数
      var that=this

      var Student_ID = this.data.Student_ID  //学号
      var user_image = this.data.user_image  //头像
      var user_name = this.data.user_name  //名字
      var number=this.data.number+1       //数量
      // var category=['校友分享']      //种类
      
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {


          wx.navigateTo({
            url: '../my_upload_img/my_upload_img?img=' + res.tempFilePaths[0],
          })


        
       

        // console.log(res.tempFilePaths.length)
        // for (var i = 0; i < res.tempFilePaths.length; i++) {
        //   let MyFile = new wx.BaaS.File()
        //   let fileParams = { filePath: res.tempFilePaths[i] }
        //   let metaData = { categoryName: '韶关学院图片' }
        //   MyFile.upload(fileParams, metaData).then(res => {
        //     let data = res.data  // res.data 为 Object 类型
        //     console.log(data)
        //     let tableID = config.IMAGE_ID.MERCHANTS
        //     let Image = new wx.BaaS.TableObject(tableID)
        //     let image = Image.create()

        //     image.set('ImageUrl', data.path)   //图片
        //     image.set('ImageId', data.file.id) //图片id
        //     image.set('Time', 'today')        
        //     image.set('Student_ID', Student_ID)
        //     image.set('user_image', user_image)
        //     image.set('user_name', user_name) 
        //     image.set('category', category)

        //     image.save().then(res => { 
        //       console.log(res)
        //       if (res.errMsg ==='request:ok'){
        //         wx.showToast({
        //           title: '投稿成功',
        //           icon: 'success',
        //           duration: 2000
        //         })
        //         that.setData({
        //           number: number
        //         })
        //       }
        //     }, err => { })
        //   }, err => {

        //   })

        // }







      }
    })
  },

  upload_again:function(){     //识别用户当天上传次数
    var that=this
    var number = this.data.number      //数量
    var user_created_by=wx.BaaS.storage.get('uid')
    console.log(user_created_by)
    let tableID = config.IMAGE_ID.MERCHANTS  
    let uploadNumber = config.IMAGE_ID.EVERYDAY
    let query1 = new wx.BaaS.Query()
    query1.compare('created_by', '=', user_created_by )
    let query2 = new wx.BaaS.Query()
    query2.compare('Time','=' ,'today')
    let andQuery = wx.BaaS.Query.and(query1, query2)
    var Product = new wx.BaaS.TableObject(tableID)
    Product.setQuery(andQuery).orderBy('-created_at').limit(200).offset(0).find().then(res => {
      console.log(res.data.meta.total_count)
      if (res.data.meta.total_count<10){     //一人一天一次上传
        if (number <uploadNumber){            //一天一百张
          that.upload_image()           
        }else{
          wx.showToast({
            title: '今天上传名额已满，明早6.30后再来',
            icon: 'none',
            duration: 3000
          })
        }
      }
      else{
        wx.showToast({
          title: '你今天已经上传过了，明早6.30后再来',
          icon: 'none',
          duration: 3000
        })

      }
      

    }, err => {
    })

  },
  prompt:function(e){
    console.log(e)
      wx.BaaS.wxReportTicket(e.detail.formId)

  },
  identity:function(){           //进行身份验证函数
    util.buttonClicked(this);  //删除数据防止按钮点击两次
    var that = this
    try {
      var Student_ID = wx.getStorageSync('Student_ID')
      var identity = wx.getStorageSync('identity')
      var userInfo = wx.getStorageSync('userInfo')
      if (Student_ID && identity ==='解除绑定' && userInfo) {
        // Do something with return value
        console.log('解除绑定', Student_ID)
        var user_image = userInfo.avatar
        var user_name=userInfo.nickname
        that.setData({
          Student_ID,
          user_image,
          user_name,

        })
        that.upload_again()  //验证上传次数，超过一次就不能再上传       
      }else{

        wx.showModal({
          title: '你未授权信息或者身份验证',
          content: '如需跳转到个人主页进行验证，请点击确认进行跳转。',
          success: function (res) {
            if (res.cancel) {
              console.log('用户点击取消')
              
            } else if (res.confirm) {
              wx.navigateTo({

                url: '../person/person?open=' + 'image',
              })
             
            }
          }
        })
      }
    } catch (e) {

    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.number(); 
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