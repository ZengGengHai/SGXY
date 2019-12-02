import config from '../../config/config'
import utils from '../../utils/utils'
import mapUtils from '../../utils/map'
import constant from '../../config/constant'
import choose from '../navigator/navigator'

const app = getApp()

Page({

  data: {
    merchantID: '',
    bannerUrl: '',
    companyName: '',
    logoUrl: '',
    telephone: '',
    location: '',
    introText: '',
    longitude: '',
    latitude: '',
    num:'',
    Detail:'',
    api:'',
    choose_id:''
  
    
  },

  onLoad(options) {
    let choose_id = options.choose_id
    this.setData({
      choose_id,
    })
    
   
    console.log(options,'测试')
    let num=options
    console.log(num,'第二页面')

    let merchantID = options.id

    this.setData({
      merchantID,
      num:num
    })
    console.log(num,'num')

    let timeoutId = utils.showLoadingToast('加载中...')

    // 调用promise.all接口用于所有状态完成后的后续操作
    // 简化版只涉及loadInfo
    // wx.BaaS.Promise.all([
    //   this.loadInfo()
    // ]).finally(res => {
    //   utils.hideLoadingToast()
    // })
    this.loadInfo()
  },

  loadInfo(id) {
    mapUtils.getMerchantDetail(this, (res) => {
      let merchantInfo = res.data
      this.initInfo(merchantInfo)
    })
    
  },

  initInfo(data) {
    this.setData({
      bannerUrl: data.image,
      companyName: data.title,
      logoUrl: data.logo,
      telephone: (data.phone + ''),
      location: data.address,
      introText: data.description,
      latitude: data.latitude,
      longitude: data.longitude
    })
    console.log(data,'测试')
    if (data.phone === null || data.phone === ' '){
      this.setData({
        telephone: false,
      })
    }
    if (data.logo === null) {
      this.setData({
        logoUrl:false,
      })
    }
    utils.hideLoadingToast()
  },

  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.telephone
    })
  },

  findLocation() {
    let timeoutId = utils.showLoadingToast('加载中...')
    let that = this

    
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        
        let num = that.data.num.num
        console.log(num,'num')
        let origin = utils.assembleLocation(0, res.longitude, res.latitude)
        let start = utils.assembleLocation(1, res.longitude, res.latitude)
        console.log(origin,"origin")
        let destination = utils.assembleLocation(0, that.data.longitude, that.data.latitude)
        let end = utils.assembleLocation(1, that.data.longitude, that.data.latitude)
        console.log(origin,destination)
        let api = `${config.API.CALCULATE_DISTANCE}?mode=walking&from=${start}&to=${end}&key=${config.QQ_LBS.WEB_API}`
    
        //验证是否距离超过自定义最小距离
        wx.request({
          url: api,
          complete: (res) => {
            let hide = utils.hideLoadingToast()
            console.log(res, "腾讯地图api")
            if (res.statusCode == constant.STATUS_CODE.SUCCESS) {
              //距离api还可以识别的时候
              if (res.data.message === "query ok") {
                let distance = res.data.result.elements[0].distance
                that.setData({
                  distance,
                })
                console.log(distance, "结果")

                //判断距离
               
                if (distance <= constant.MIN_DISTANCE.Distance && res.data.message != "起终点距离超长") {             //自定义可以访问的最小距离，如果太远就导航不了
                  // console.log(distance, '测试距离')
                  wx.navigateTo({
                    url: `../goToMap/goToMap?origin=${origin}&destination=${destination}&num=${num}`
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
                        success: function (res) {

                          let num = that.data.num.num
                          console.log(num, 'num')
                          let origin = utils.assembleLocation(0, res.longitude, res.latitude)
                          let start = utils.assembleLocation(1, res.longitude, res.latitude)
                          console.log(origin, "origin")
                          let destination = utils.assembleLocation(0, that.data.longitude, that.data.latitude)
                          let end = utils.assembleLocation(1, that.data.longitude, that.data.latitude)
                          console.log(origin, destination)
                          let api = `${config.API.CALCULATE_DISTANCE}?mode=walking&from=${start}&to=${end}&key=${config.QQ_LBS.WEB_API}`

                          //验证是否距离超过自定义最小距离
                          wx.request({
                            url: api,
                            complete: (res) => {
                              let hide = utils.hideLoadingToast()
                              console.log(res, "腾讯地图api")
                              if (res.statusCode == constant.STATUS_CODE.SUCCESS) {
                                //距离api还可以识别的时候
                                if (res.data.message === "query ok") {
                                  let distance = res.data.result.elements[0].distance
                                  that.setData({
                                    distance,
                                  })
                                  console.log(distance, "结果")

                                  //判断距离

                                  if (distance <= constant.MIN_DISTANCE.Distance && res.data.message != "起终点距离超长") {             //自定义可以访问的最小距离，如果太远就导航不了
                                    // console.log(distance, '测试距离')
                                    wx.navigateTo({
                                      url: `../goToMap/goToMap?origin=${origin}&destination=${destination}&num=${num}`
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
  }
})