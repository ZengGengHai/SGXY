// pages/cs/cs.js

// import ImgLoader from '../../utils/img-loader.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    js_code:'',
    phone:''
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
   
 
    // 9d968dd1 - 2afc - 4eba - 884f - cfb75ad8cd06
   
  },
 api:function (e) {
    
    // wx.request({
    //   url: "http://api.heclouds.com/cmds?device_id=515394264",
    //   data:{
    //     "cmd_uuid": "{blueled}1"

    //   },
      
    //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   header: { 
    //     'api-key': 'JJeGOIiHG8=FGgAeKXUKXjubkVg='
    //   }, // 设置请求的 header
    //   success: function (data) {
    //     console.log(data)
      
    //   },
    //   fail: function (err) {
    //     console.log(err)
    //     //wx.request({
    //     // url: '',
    //     //})
    //   }
    // })


  //  wx.request({
  //    url: "http://api.heclouds.com/devices/515394264",
  //   //  data: {
  //   //    "cmd_uuid": "9d968dd1 - 2afc - 4eba - 884f - cfb75ad8cd06"
  //   //  },

  //    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
  //    header: {


  //      'api-key': 'JJeGOIiHG8=FGgAeKXUKXjubkVg='
  //    }, // 设置请求的 header
  //    success: function (data) {
  //      console.log(data)

  //    },
  //    fail: function (err) {
  //      console.log(err)
  //      //wx.request({
  //      // url: '',
  //      //})
  //    }
  //  })



   wx.request({
     url: "https://api.heclouds.com/devices",
    //  data: {
    //    "cmd_uuid": "{blueled}1"

    //  },

     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     header: {
       'api-key': 'JJeGOIiHG8=FGgAeKXUKXjubkVg='
     }, // 设置请求的 header
     success: function (data) {
       console.log(data)

     },
     fail: function (err) {
       console.log(err)
       //wx.request({
       // url: '',
       //})
     }
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