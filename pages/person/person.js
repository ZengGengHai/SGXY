//index.js

var config = require('../../config/config')
var util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    type:'',
    open:'',   //页面进入的方式
    StatusBar: app.globalData.StatusBar + 6,

    userInfo: { avatarUrl:'../../images/icon/user.png'},
    logged: false,
    takeSession: false,
    requestResult: '',
    first_time: true,
    box: true,
    aiministrator:false,
    latitude: "",
    longitude:"",
    name_open:false,
    validation_open:false,
    imgAdmin:false,




    publicnum:0,  //发布通过数量
    shoucangnum:0,  //收藏数
    focususernum:0 //关注数





    
  },

  // 用户登录示例



  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {

  },
  publish: function () {  //跳转发布页面
    wx.navigateTo({
      url: '../publish/publish',
    })
  },
  shoucang: function () {
    wx.navigateTo({
      url: '../shoucang/shoucang',
    })
  },
  my_focus: function () {
    wx.navigateTo({
      url: '../img_fllow/img_fllow?is_share=' + 'false',
    })
  },
  leave_word:function(){
    wx.showToast({
      title: '图片留言管理努力开发中',
      icon: 'none',
      duration: 2000
    })

  },
  usingDocument:function(){
    wx.navigateTo({
      url: '../usingDocuments/usingDocuments',
    })
  },
 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    that.publishNum();
    that.shoucangNum();
    that.focusUserNum();
    wx.getSetting({
      success: function (res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {  //如果有授权
          try {
            var userInfo = wx.getStorageSync('userInfo')
            console.log(userInfo, '用户授权信息')
            var name = userInfo.nickName||''
            console.log(name)
            if (name != '' || name === undefined) {
              console.log("这是老版本，需要从新授权")
              that.setData({
                box: true,
              })
            }else{
              console.log("新的授权接口")
            }
          } catch (e) {
          }



        } else {
          wx.removeStorage({
            key: 'userInfo',
            success: function (res) {    
              console.log('用户授权已经关闭，移除授权缓存记录')
            }
          })
          that.setData({
            box: true,
          })

        }

      },
      fail: function (res) { },
      complete: function (res) { },
    })



  },


 
  onLoad: function (e) {
    var that=this
    console.log(e)
    var open=e.open||""     //验证两种
    var type=e.type||""     //验证一种
    console.log(type,'type')
    wx.getSetting({
      success: function (res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {  //如果有授权
  
        } else {
          wx.removeStorage({
            key: 'userInfo',
            success: function (res) {
              console.log(res.data)
              console.log('meiyou hsouquan')
            }
          })
          that.setData({
            box: true,
          })

        }

      },
      fail: function (res) { },
      complete: function (res) { },
    })

    if (type!= '') {           //头像授权
      try {
        var userInfo = wx.getStorageSync('userInfo')
        console.log(userInfo, 'ghjgjhg')
        if (!userInfo) {
          that.setData({
            name_open: true,
            type:'one',
          })
          console.log('meiyou hsouquan')
        }
      } catch (e) {
      }
      that.setData({
        open,
      })
    } else {
                if (open != '') {           //头像授权和身份授权
                  try {
                    var Student_ID = wx.getStorageSync('Student_ID')
                    var identity = wx.getStorageSync('identity')
                    var userInfo = wx.getStorageSync('userInfo')
                    console.log(userInfo, 'ghjgjhg')
                    if (!userInfo) {
                      that.setData({
                        name_open: true
                      })
                      console.log('meiyou hsouquan')
                    }
                    if (identity != '解除绑定') {
                      that.setData({
                        nvalidation_open: true
                      })
                    }
                  } catch (e) {

                  }
                  that.setData({
                    open,
                  })
                } else {
                }

    }

   
    var that = this
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          userInfo: res.data,
          logged: true,
          box: false
        })
      }
    })

  
    that.publishNum();
    that.shoucangNum();
    that.focusUserNum();

    //验证是否图片墙管理员
    let user_id = wx.BaaS.storage.get('uid')
    let admin_Id = config.ImgAdmin
    for (let i = 0; i < admin_Id.length; i++) {
      console.log(user_id)
      if (user_id === admin_Id[i].MERCHANTS) {
        this.setData({
          imgAdmin: true
        })
        console.log('是图片墙管理员')
      }
    }
   








  },
  userInfoHandler(data) {
    var that = this
    wx.BaaS.handleUserInfo(data).then(res => {


      console.log(res)  //用户授权成功
      that.setData({
        userInfo: res,
        logged: true,
        box: false,
        name_open:false,
      })
      wx.setStorage({//存储到本地
        key: "userInfo",
        data: res
      })
      var type=that.data.type
      var open=that.data.open
      if (type ==='one') {
        if (open === 'image_fllow') {
          wx.showModal({
            title: '验证成功，将回到“图片详情”页面',
            content: '如需跳转,请按确定',
            success: function (res) {
              if (res.cancel) {
                console.log('用户点击取消')

              } else if (res.confirm) {
                wx.navigateBack({

                  delta: 1

                });

              }
            }
          })
        }
      }
  
    }, res => {
      // that.setData({
      //    box: true,
      //   userInfo: {}
      // })
    })

  },
  publishNum: function () {
    var category=['韶院风景', '思维创意', '校园生活', '校园美食', '校园萌宠', '毕业剪影', '其它类别']
    var that = this
    var user_created_by = wx.BaaS.storage.get('uid')  //用户id
    let tableID = config.IMAGE_ID.MERCHANTS
    var Product = new wx.BaaS.TableObject(tableID)
    let query1 = new wx.BaaS.Query()
    query1.compare('examine', '=', 'true')
    var query2 = new wx.BaaS.Query()
    query2.compare('created_by', '=', user_created_by)
    var query3 = new wx.BaaS.Query()
    query3.in('category', category)
    let andQuery = wx.BaaS.Query.and(query1, query2,query3) 
    Product.setQuery(andQuery).orderBy('-created_at').find().then(res => {
      console.log(res.data.meta.total_count)
       var publicnum=res.data.meta.total_count
       that.setData({
         publicnum,
       })

    
      }, err => {
      })

  },
  shoucangNum: function () {
    var that = this
    var uid = wx.BaaS.storage.get('uid')  //用户id
    let tableID = config.SHOUCANG_IMAGE.MERCHANTS
    var Product = new wx.BaaS.TableObject(tableID)
    let query1 = new wx.BaaS.Query()
    query1.compare('created_by', '=', uid)
    
    Product.setQuery(query1).orderBy('-created_at').find().then(res => {
      console.log(res.data.meta.total_count)
      var shoucangnum = res.data.meta.total_count
      that.setData({
        shoucangnum ,
      })


    }, err => {
    })




  


  },
  focusUserNum: function () {   //关注作者
    var that = this
    let user_id = wx.BaaS.storage.get('uid')
    let tableID = config.Focus_on_users.MERCHANTS
    let query1 = new wx.BaaS.Query()
    query1.compare('created_by', '=', parseInt(user_id))


    let Product = new wx.BaaS.TableObject(tableID)
    Product.setQuery(query1).expand(['focus_id']).find().then(res => {
      var focususernum = res.data.meta.total_count
      that.setData({
        focususernum,
      })
    }, err => {
      // err
    })



  },

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
  
  },


  //正方系统身份验证
  system_validation:function(){
    // var text ='点击图片放大，长按识别二维码赞赏，你的赞赏，用于小程序的服务维护费用，让地图服务能一直持续下去'


    // wx.navigateTo({
    //   url: '../author/author?image=' +'https://cloud-minapp-13676.cloud.ifanrusercontent.com/1fRd6HFZPmCpdRdw.jpg'+'&text='+text,
      
    
    // })
    this.setData({
      nvalidation_open: false
    })

    
    var open = this.data.open
 
    if (open != '') {
      wx.navigateTo({
        url: '../system_validation/system_validation?open=' + open,
      })
    }else{
      wx.navigateTo({
        url: '../system_validation/system_validation?open=' + 'no',
      })
    }

  },


 //管理后台
  Management_Backstage:function(){
    wx.navigateTo({
      url: '../Management_Backstage/Management_Backstage',
    }) 
  },
  my_release:function(){
    wx.navigateTo({
      url:'../my_release/my_release',
    })
  },

  
  About:function(){
    
    wx.navigateTo({
      url: '../about/about',
    }) 

  },



})
