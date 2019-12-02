// pages/aiministrator/aiministrator.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Sowing_map_console:false,
    Sowing_map_item:[],
  },

   //点击轮播图后按钮显示内容
  Sowing_map:function(){                                     
    var that=this
    if (this.data.Sowing_map_console){
      that.setData({
        Sowing_map_console: false,
      })
    }else{
      that.setData({
        Sowing_map_console: true,
      })
    }
 
  },
     
//上传图片到文件库
  upload:function(){
    wx.chooseImage({
      success: function (res) {
        let MyFile = new wx.BaaS.File()
        let fileParams = { filePath: res.tempFilePaths[0] }
        let metaData = { categoryName: '轮播图' }

        MyFile.upload(fileParams, metaData).then(res => {
          /*
           * 注: 只要是服务器有响应的情况都会进入 success, 即便是 4xx，5xx 都会进入这里
           * 如果上传成功则会返回资源远程地址,如果上传失败则会返回失败信息
           */

          let data = res.data  // res.data 为 Object 类型
        }, err => {

        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this                                              //获取轮播图的文件夹列表
    let MyFileCategory = new wx.BaaS.FileCategory()

    MyFileCategory.getFileList('5aeb038bcf675401bde3bf4e').then(res => {
     console.log(res.data.objects)
    that.setData({
      Sowing_map_item:res.data.objects
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
  onShareAppMessage: function (res) {
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