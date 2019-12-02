// pages/Management_Backstage/Management_Backstage.js

import config from '../../config/config'
import utils from '../../utils/utils'



Page({

  /**
   * 页面的初始数据
   */
  // '韶院风景', '思维创意', '校园生活', '校园美食', '校园萌宠', '毕业剪影', '其它类别'
  data: {
    showModal:false,
    User_name:'',
    User_password:'',
    Managers:[],
    click_Managers:[],  //记录点击哪个后台
    qmt_managers: true,   //全媒体中心
    hc_managers:false, //环创电脑工作室
    Imaget_category: [{ type_name: '韶院风景' }, { type_name: '思维创意' }, { type_name: '校园生活' }, { type_name: '校园美食' }, { type_name: '校园萌宠' }, { type_name: '毕业剪影' }, { type_name:'原创壁纸' }],
    watermark:'yes'
  },


  Managers:function(res){      //切换后台时候账号密码重新清空
    var that=this
    console.log(res.currentTarget.dataset.name)
    that.setData({
    click_Managers: res.currentTarget.dataset.name,  //识别后台谁点击的
    showModal: true,
    User_name: '',
    User_password: ''

    })
  },
  close_QMT_modal:function(){
    var that=this
    that.setData({
      showModal: false
    })

  },
  check_image:function(){
    wx.navigateTo({
      url: '../check_image/check_image',
    })
  },
  give_up_image:function(){
    wx.navigateTo({
      url: '../qmt_manage/qmt_manage',
    })
  },

  // 阻断事件向下传递，避免在弹窗后还可以点击或者滑动蒙层下的界面
  preventTouchMove: function () {
  },
  UserInput_name:function(e){
    var value = e.detail.value
    console.log(value)
    this.setData({
      User_name: value
    })

  },
  Set_name_value:function(e){
    var value=e.detail.value
    console.log(value)
    this.setData({
      User_name: value
    })

  },
  UserInput_password: function (e) {
    var value = e.detail.value
    console.log(value)
    this.setData({
      User_password: value
    })

  }, 
  Set_password_value: function (e) {
    var value = e.detail.value
    console.log(value)
    this.setData({
      User_password: value
    })

  },

  Login:function(){

    var that=this;
    var click_name = that.data.click_Managers
    var User_name = this.data.User_name
    var User_password = this.data.User_password
    if (User_name != '' && User_password != '') { //账号密码非空
      console.log('账号和密码非空')

      let timeoutId = utils.showLoadingToast('加载中...')
      let tableID = config.MANAGERS.MERCHANTS
      let query = new wx.BaaS.Query()
      // query.compare('User', '=', 1)
      query.compare('User', '=', click_name)
      let Product = new wx.BaaS.TableObject(tableID)
      Product.setQuery(query).find().then(res => {
          // success
          console.log(res)
        let hide = utils.hideLoadingToast()
          var name=res.data.objects[0].User_name
          var password=res.data.objects[0].User_password
        console.log(name, password)

        if (User_name != name){     //账号出错就得改账号和密码框为空
          wx.showModal({
            title: '您输入的账号有误',
            content: '如需清空输入框信息，请点击确认。',
            success: function (res) {
              if (res.cancel) {
                console.info("失败返回数据");
           

              } else if (res.confirm) {
                that.setData({
                  User_name: '',
                  User_password: ''
                })                                     
               }
            }
          })

        }else{

          if (User_password != password){   //账号对密码错，就清空密码
            wx.showModal({
              title: '您输入的密码有误',
              content: '如需重新输入，请按确认。',
              success: function (res) {
                if (res.cancel) {
                  console.info("失败返回数据");


                } else if (res.confirm) {
                  that.setData({
                    User_password: ''
                  })
                }
              }
            })


          }else{                           //账号密码都对
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 500
            })


            if (click_name==="全媒体中心"){
              that.setData({
                showModal: false,
                qmt_managers:true
              })
            } else if (click_name === "环创电脑工作室"){
              that.setData({
                showModal: false,
                hc_managers:true

              })
            }
            

          }
        }
        }, err => {
          // err
        })





    } else {                          //账号或者密码空
      console.log('账号或者密码空')
    }
    
  },
  //环创官网
  Home:function(){
    wx.navigateTo({
      url: '../home/home',
    })
  },


  watermarkChange:function(res){
    console.log(res.detail.value)
    if (res.detail.value){
      this.setData({
        watermark:'yes'
      })
    }else{
      this.setData({
        watermark: 'no'
      })
    }
  },
  input_image:function(res){
  
    console.log(res.currentTarget.dataset.kind)  //点击上传的种类
    var category = res.currentTarget.dataset.kind
    var watermark = this.data.watermark   //是否携带水印


      wx.chooseImage({
        count: 9, // 默认9
        sizeType: ['original','compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          console.log(res.tempFilePaths.length)
          for (var i = 0; i < res.tempFilePaths.length; i++) {
            let MyFile = new wx.BaaS.File()
            console.log(res.tempFilePaths[i],'hjhjhhk')
            let fileParams = { filePath: res.tempFilePaths[i]}
            let metaData = { categoryName: '韶关学院图片' }
            MyFile.upload(fileParams, metaData).then(res => {
              let data = res.data  // res.data 为 Object 类型
              console.log(data)
              let tableID = config.IMAGE_ID.MERCHANTS
              let Image = new wx.BaaS.TableObject(tableID)
              let image = Image.create()
              image.set('ImageUrl', data.path)
              image.set('ImageId', data.file.id)
              image.set('category', [category] )
              image.set('examine', 'true')
              image.set('Time', 'notoday')
              image.set('watermark', watermark)
              image.set('user_image', 'https://cloud-minapp-13676.cloud.ifanrusercontent.com/1fnj61GhuZCVSpDa.jpg')
              image.set('user_name', '全媒体中心')
              image.save().then(res => {
                console.log(res)
                if (res.errMsg ==='request:ok'){
                  wx.showToast({
                    title: '上传成功',
                    icon: 'success',
                    duration: 2000
                  })
                }else{
                  wx.showToast({
                    title: '上传失败',
                    icon: 'none',
                    duration: 2000
                  })
                }
               }, err => { })
            }, err => {
            })

          }


        }
      })

  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
    //加载管理者的图片
    var that=this
    let tableID = config.MANAGERS.MERCHANTS
    let Product = new wx.BaaS.TableObject(tableID)
    Product.find().then(res => {
      console.log(res)
      var Array=[]
      for(var i=0;i<res.data.objects.length;i++){
        var Array_list = {
          User: res.data.objects[i].User,
          User_image:res.data.objects[i].image,  
        }
      Array.push(Array_list)
      }

      that.setData({
        Managers: Array
      })
      console.log(Array)
 
      }, err => {
        // err
      })

// 不设置查询条件
Product.find().then()

  
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