// pages/system_validation/system_validation.js
import base64 from '../../utils/base64.js'
import utils from '../../utils/utils'
Page({

  /**
   * 页面的初始数据
   */
  data: {

    open:'',  //进入页面
    Student_ID:'',
    User_password:'',
    identity:'身份验证',
    button_color:'#921616'
  
  },

  UserInput_name: function (e) {
    var value = e.detail.value
    console.log(value)
    this.setData({
      Student_ID: value
    })

  },
  Set_name_value: function (e) {
    var value = e.detail.value
    console.log(value)
    this.setData({
      Student_ID: value
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
  Button:function(){
    var identity=this.data.identity
    if (identity==='解除绑定'){
      wx.setStorage({
        key: "identity",
        data: '身份验证'
      })
      wx.setStorage({
        key: "Student_ID",
        data: ''
      })
      wx.setStorage({
        key: "User_password",
        data: ''
      })
      this.setData({
         Student_ID: '',
         User_password: '',
         identity: '身份验证',
         button_color: '#921616'
 
      })

    } else if (identity === '身份验证' || identity === '身份验证失败，请再次验证'){
      this.Login()

    }
  },
  Login: function () {

    var that = this;
    var open=this.data.open
    var Student_ID = this.data.Student_ID
    var User_password = this.data.User_password;
    if (Student_ID && User_password){
      var encoded = base64.CusBASE64.encoder(Student_ID) + '%%%' + base64.CusBASE64.encoder(User_password)
      console.log(encoded)

      let timeoutId = utils.showLoadingToast('加载中...')
      wx.request({
        method: 'POST',
        url: 'https://zenggenghai.cn/school_system/demo.php',
        data: {

          encoded: encoded
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",

        },
        success: function (res) {
          let hide = utils.hideLoadingToast()
          console.log(res.data)
          if (res.data.login === 'ok') {
            wx.showToast({
              title: '验证成功',
              icon: 'none',
              duration: 1000
            })
            wx.setStorage({
              key: "Student_ID",
              data: Student_ID
            })
            wx.setStorage({
              key: "User_password",
              data: User_password
            })
            wx.setStorage({
              key: "identity",
              data: '解除绑定'
            })
            that.setData({
              identity: '解除绑定',
              Student_ID,
              User_password,
              button_color: 'rgb(6, 138, 34)'
            })
            //识别进来页面，验证成功返回原来页面
            if (open === 'image') {
              wx.showModal({
                title: '验证成功，将回到“投稿”页面',
                content: '如需跳转,请按确定',
                success: function (res) {
                  if (res.cancel) {
                    console.log('用户点击取消')

                  } else if (res.confirm) {
                    wx.navigateBack({

                      delta: 2

                    });

                  }
                }
              })
            }
            if (open === 'water'){
              wx.showModal({
                title: '验证成功，将回到“水电查询”页面',
                content: '如需跳转,请按确定',
                success: function (res) {
                  if (res.cancel) {
                    console.log('用户点击取消')

                  } else if (res.confirm) {
                    wx.navigateBack({

                      delta: 2

                    });

                  }
                }
              })
            }
            if(open=== 'choose_song'){
              wx.showModal({
                title: '验证成功，将回到“韶院广播点歌”页面',
                content: '如需跳转,请按确定',
                success: function (res) {
                  if (res.cancel) {
                    console.log('用户点击取消')

                  } else if (res.confirm) {
                    wx.navigateBack({

                      delta: 2

                    });

                  }
                }
              })
            }
            if (open ==='image_fllow'){
              wx.showModal({
                title: '验证成功，将回到“评论留言”页面',
                content: '如需跳转,请按确定',
                success: function (res) {
                  if (res.cancel) {
                    console.log('用户点击取消')

                  } else if (res.confirm) {
                    wx.navigateBack({

                      delta: 2

                    });

                  }
                }
              })
            }


          } else {
            wx.setStorage({
              key: "identity",
              data: '身份验证失败'
            })
            wx.setStorage({
              key: "Student_ID",
              data: ''
            })
            wx.setStorage({
              key: "User_password",
              data: ''
            })
            that.setData({
              identity: '身份验证失败，请再次验证'
            })
            wx.showModal({
              title: '您输入的账号或者密码有误',
              content: '如需重新输入，请点击确认。',
              success: function (res) {
                if (res.cancel) {
                  console.info("失败返回数据");
                } else if (res.confirm) {
                  that.setData({
                    Student_ID: '',
                    User_password: ''
                  })
                }
              }
            })

          }
        }
      })


    }else{
      wx.showToast({
        title: '请输入账号和密码',
        icon: 'none',
        duration: 1000
      })
    }

   
    // if (User_name != '' && User_password != '') { //账号密码非空
     
    //   let timeoutId = utils.showLoadingToast('加载中...')
    
       
    //       wx.showModal({
    //         title: '您输入的账号有误',
    //         content: '如需清空输入框信息，请点击确认。',
    //         success: function (res) {
    //           if (res.cancel) {
    //             console.info("失败返回数据");


    //           } else if (res.confirm) {
    //             that.setData({
    //               User_name: '',
    //               User_password: ''
    //             })
    //           }
    

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var open = options.open
    console.log(open)
    that.setData({
      open,
    })

    try {
      var Student_ID = wx.getStorageSync('Student_ID')
      var identity = wx.getStorageSync('identity')
      var User_password = wx.getStorageSync('User_password')
  
      if (Student_ID && User_password && identity) {
        // Do something with return value
        that.setData({
          Student_ID,
          User_password,
          identity,
          button_color:'rgb(6, 138, 34)'
        })

      }
    } catch (e) {
      // Do something when catch error
    }
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