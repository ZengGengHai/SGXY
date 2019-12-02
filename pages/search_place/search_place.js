// pages/search_place/search_place.js
import config from '../../config/config'
import constant from '../../config/constant'
import utils from '../../utils/utils'
import mapUtils from '../../utils/map'
const app = getApp()




Page({

  /**
   * 页面的初始数据
   */
  data: {

    CustomBar: app.globalData.CustomBar,
    zghCustomBar: app.globalData.zghCustomBar,


    choose_id:"",        //查询哪个表
    text:'',
    resultData:'',
    image_index:0,
    school_list: [{ name: config.TABLE_ID[0].NAME, hover: false, id: 0 }, { name: config.TABLE_ID[1].NAME, hover: false, id: 1 }, { name: config.TABLE_ID[2].NAME, hover: false, id: 2 }],//配置可以选择的学校
    hover:true,
   
  },

  //按回车查找
  bindReplaceInput: function (e) {
  
    var value = e.detail.value
    this.setData({
      text:value
    })
    console.log(value)
    if(value!=""){
      let timeoutId = utils.showLoadingToast('加载中...')
      mapUtils.getSearch(this, (res) => {

        let resultData = res.data.objects
        console.log(resultData,'99')
        if (resultData.length==0){
          wx.showToast({
            title: '没有查询结果',
            icon: 'none',
            duration: 1500
          })
        }else{
          utils.hideLoadingToast() 
        }
        this.setData({
          resultData,
        }) 
   
          
      })
    }
  
   },
  //记录输入的值
  Set_value:function(e){
    var value = e.detail.value
    console.log(value,'9999')
    this.setData({
      text: value
    })
    this.Bind_replaceInput();
  },

  //点击图标查询，如果查询框有值就会查询数据
  Bind_replaceInput:function(e){
   
    var value = this.data.text

    if (value != "") {
      let timeoutId = utils.showLoadingToast('加载中...')
      mapUtils.getSearch(this, (res) => {

        let resultData = res.data.objects
        console.log(resultData, '99')
        if (resultData.length == 0) {
          wx.showToast({
            title: '没有查询结果',
            icon: 'none',
            duration: 4000
          })
        }else{
          utils.hideLoadingToast() 
        }
        this.setData({
          resultData,
        })
      
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    console.log(options,'s')
    var choose_id = options.choose_id;
    this.setData({
      choose_id,
    })
    let school_list = this.data.school_list
   
    school_list.forEach((elem, idx) => {
      if (idx == choose_id) {

        elem.hover = true
        console.log(elem, 'bbbb')
      } else {

        elem.hover = false
      }
    })
    that.setData({
      school_list
    })
  
  },

  //选择需要查询的学校
  chose_school:function(res){
    var that=this
    that.setData({
      resultData: ''
    })
    console.log(res)
    let school_list = this.data.school_list
    let activeIndex = res.currentTarget.dataset.id
    school_list.forEach((elem, idx) => {
      if (idx == activeIndex) {

        elem.hover = true
        console.log(elem, 'bbbb')
      } else {

        elem.hover = false
      }
    })
    that.setData({
      school_list,
      choose_id: activeIndex
    })
    that.Bind_replaceInput()
  },
  GoToMap: function (e) {
    let timeoutId = utils.showLoadingToast('加载中...')
    var that = this

    console.log(e)
    let ListId = e.currentTarget.dataset
    console.log(ListId)




    let api, start, end

    end = this.assembleLocation(1, ListId.longitude, ListId.latitude)

    ListId.destination = utils.assembleLocation(0, ListId.longitude, ListId.latitude)

    this.setData({
      ListId
    })
    console.log(ListId)

    // 获取用户当前位置，调用腾讯计算位置api获取距离信息
    wx.getLocation({
      type: 'gcj02',
      complete: (res) => {
        if (res.errMsg === 'getLocation:ok') {
          start = utils.assembleLocation(1, res.longitude, res.latitude)
          ListId.origin = utils.assembleLocation(0, res.longitude, res.latitude)
          that.setData({
            ListId,
          })
          console.log(ListId, '测试')

          api = `${config.API.CALCULATE_DISTANCE}?mode=walking&from=${start}&to=${end}&key=${config.QQ_LBS.WEB_API}`

          wx.request({
            url: api,
            complete: (res) => {
              let hide = utils.hideLoadingToast()
              console.log(res, "腾讯地图api")
              if (res.statusCode == constant.STATUS_CODE.SUCCESS) {
                //距离api还可以识别的时候
                if (res.data.message === "query ok") {
                  ListId.distance = res.data.result.elements[0].distance
                  that.setData({
                    ListId,
                  })
                  console.log(ListId, "结果")
                  let origin = ListId.origin

                  let destination = ListId.destination

                  let image_index = that.data.image_index
                  console.log(image_index, 'image_index数值')

                  //判断距离
                  var distance = ListId.distance
                  if (distance <= constant.MIN_DISTANCE.Distance && res.data.message != "起终点距离超长") {             //自定义可以访问的最小距离，如果太远就导航不了
                    // console.log(distance, '测试距离')
                    wx.navigateTo({
                      url: `../goToMap/goToMap?origin=${origin}&destination=${destination}&num=${image_index}`
                    })
                  } else {

                    wx.showModal({
                      title: '提示',
                      content: '距离太远无法规划路线',
                      success: function (res) {
                        if (res.confirm) {


                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                      }
                    })
                  }

                } else {

                  wx.showModal({
                    title: '提示',
                    content: '距离太远无法规划路线',
                    success: function (res) {
                      if (res.confirm) {


                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                }


              }
            }

          })
        }
      }
    })

    //未授地图或者用户拒绝想再次进入就提示是否授权获取地图
    wx.getSetting({
      success: function (res) {

        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
            success: function (res) {
              if (res.cancel) {
                console.info("1授权失败返回数据");

              } else if (res.confirm) {
                //village_LBS(that);
                wx.openSetting({
                  success: function (data) {
                    console.log(data);
                    if (data.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 5000
                      })
                      //再次授权，调用getLocationt的API
                      wx.getLocation({
                        type: 'gcj02',
                        complete: (res) => {
                          if (res.errMsg === 'getLocation:ok') {
                            start = utils.assembleLocation(1, res.longitude, res.latitude)
                            ListId.origin = utils.assembleLocation(0, res.longitude, res.latitude)
                            that.setData({
                              ListId,
                            })
                            console.log(ListId, '测试')

                            api = `${config.API.CALCULATE_DISTANCE}?mode=walking&from=${start}&to=${end}&key=${config.QQ_LBS.WEB_API}`

                            wx.request({
                              url: api,
                              complete: (res) => {
                                let hide = utils.hideLoadingToast()
                                console.log(res, "腾讯地图api")
                                if (res.statusCode == constant.STATUS_CODE.SUCCESS) {
                                  //距离api还可以识别的时候
                                  if (res.data.message === "query ok") {
                                    ListId.distance = res.data.result.elements[0].distance
                                    that.setData({
                                      ListId,
                                    })
                                    console.log(ListId, "结果")
                                    let origin = ListId.origin

                                    let destination = ListId.destination

                                    let image_index = that.data.image_index
                                    console.log(image_index, 'image_index数值')

                                    //判断距离
                                    var distance = ListId.distance
                                    if (distance <= constant.MIN_DISTANCE.Distance && res.data.message != "起终点距离超长") {             //自定义可以访问的最小距离，如果太远就导航不了
                                      // console.log(distance, '测试距离')
                                      wx.navigateTo({
                                        url: `../goToMap/goToMap?origin=${origin}&destination=${destination}&num=${image_index}`
                                      })
                                    } else {

                                      wx.showModal({
                                        title: '提示',
                                        content: '距离太远无法规划路线',
                                        success: function (res) {
                                          if (res.confirm) {


                                          } else if (res.cancel) {
                                            console.log('用户点击取消')
                                          }
                                        }
                                      })
                                    }

                                  } else {

                                    wx.showModal({
                                      title: '提示',
                                      content: '距离太远无法规划路线',
                                      success: function (res) {
                                        if (res.confirm) {


                                        } else if (res.cancel) {
                                          console.log('用户点击取消')
                                        }
                                      }
                                    })
                                  }


                                }
                              }

                            })
                          }
                        }
                      })
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 5000
                      })
                    }
                  }
                })
              }
            }
          })

        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })










  },
  assembleLocation(type, longitude, latitude) {
    if (type == 0) return longitude + ',' + latitude
    return latitude + ',' + longitude
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