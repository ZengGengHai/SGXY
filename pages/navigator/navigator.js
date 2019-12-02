// app导航页
import config from '../../config/config'
import constant from '../../config/constant'
import utils from '../../utils/utils'
import mapUtils from '../../utils/map'

const app = getApp()

Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    zghCustomBar: app.globalData.zghCustomBar,



    isMapShow: true,
    tabs: constant.tabs[0][0],
    tabsList:constant.tabs[0],
    merchantsData: [],
    coreLongitude: '113.671729',
    coreLatitude: '24.774389',
    markers: [],
    isMerchantInfoShow: false,
    isSpread: true,
    scrollTop: 0,
    num:'0',
    animationData: {},
    category:'' ,
    scale:'15',
    show_location:true,
    id:99999,
    hover:false,
    true:true,
    array: [config.TABLE_ID[0].NAME, config.TABLE_ID[1].NAME,config.TABLE_ID[2].NAME],//配置可以选择的学校
    choose_array: config.TABLE_ID[0].NAME,
    choose_id:'0',
    image_index:'0'
    
  }, 
  onLoad(options) {

    


    let timeoutId = utils.showLoadingToast('加载中...')

    // 每隔3000秒验证一次用户有没有登录
    // let intervalId = setInterval(() => {
    //   let uid = app.getUserId()
    //   if (uid) {
    //     this.getCategory()
    //     clearInterval(intervalId)
    //   }
    // }, 3000)


    this.getCategory()

  },

  //显示当前位置
  Location:function(e) {
    var that=this
    let show_location = that.data.show_location
    console.log(show_location)
    this.setData({
      show_location: true,
    })

    // wx.getLocation({
    //   type: 'gcj02',
    //   success: function (res) {
  
    //   }
    // })
 
    this.mapCtx = wx.createMapContext('myMap');//获取地图对象同canvas相似，获取后才能调用相应的方法  
  
    this.mapCtx.moveToLocation()//将当前位置移动到地图中心  
    console.log('hjh')

  },
  //查找地点
  Search:function(e){

    // wx.showToast({
    //   title: '此功能暂时未开放,敬请期待',
    //   icon: 'none',
    //   duration: 2000
    // })
    var choose_id = this.data.choose_id;
    console.log(choose_id)
    wx.navigateTo({
      url: '../search_place/search_place?choose_id=' + choose_id,
      // image=' +'https://cloud-minapp-13676.cloud.ifanrusercontent.com/1fRd6HFZPmCpdRdw.jpg'+'&text='+text,

    })
  },
  Recommend:function(e){

    wx.showToast({
      title: '此功能暂时未开放，敬请期待',
      icon: 'none',
      duration: 2000
    })

  },


  //选择学校
  choose_school:function(e){
  var that = this
 
  let index=e.detail.value

  this.setData({
    choose_array: config.TABLE_ID[index].NAME,
    choose_id:index,
    tabsList: constant.tabs[index],
    tabs: constant.tabs[index][0],

  })
  this.getCategory()

  //编辑hover样式，被选中的种类
  console.log('index---------onUnload')
  let tabsList = constant.tabs[index]
  tabsList.forEach((elem, idx) => {
    if (idx === 0) {

      elem.hover = true
      console.log(elem, 'bbbb')
    } else {

      elem.hover = false
    }
  })
  that.setData({
    tabsList
  })
 


  //调节视野
  var leftLongitude = this.data.tabs.leftLongitude  //选中类型的左边视野
  var leftLatitude = this.data.tabs.leftLatitude
  var rightLongitude = this.data.tabs.rightLongitude  //选中类型的右边视野
  var rightLatitude = this.data.tabs.rightLatitude
  console.log(e)
  console.log(leftLongitude, leftLatitude, rightLongitude, rightLatitude)
  

  this.mapCtx = wx.createMapContext('myMap');//获取地图对象同canvas相似，获取后才能调用相应的方法  
  // this.mapCtx.moveToLocation()//将当前位置移动到地图中心  


  this.mapCtx.includePoints({
    padding: [10, 10, 10, 10],
    points: [{

      latitude: leftLatitude,
      longitude: leftLongitude

    }, {
      latitude: rightLatitude,
      longitude: rightLongitude,


    }]
  })

  //换页面的时候初始化被选中marker的方框
  that.setData({
    scrollTop: 0,
    activeMerchantIndex: -1
  })



  },
  


  //选择分类
  choseTab:function(e){
    console.log(e)
    var that=this
    let choose_id = this.data.choose_id
    let timeoutId = utils.showLoadingToast('加载中...')
    var num = e.currentTarget.dataset.id
    var image_index = e.currentTarget.dataset.image_index
    console.log(image_index,' image_index')
    var leftLongitude = e.currentTarget.dataset.leftlongitude  //选中类型的左边视野
    var leftLatitude = e.currentTarget.dataset.leftlatitude
    var rightLongitude = e.currentTarget.dataset.rightlongitude  //选中类型的右边视野
    var rightLatitude = e.currentTarget.dataset.rightlatitude
    console.log(e)
    console.log(leftLongitude, leftLatitude, rightLongitude, rightLatitude)
    this.setData({
      tabs: constant.tabs[choose_id][num],
     num:num,
     image_index:image_index

     
    })

      this.getCategory()

      this.mapCtx = wx.createMapContext('myMap');//获取地图对象同canvas相似，获取后才能调用相应的方法  
      // this.mapCtx.moveToLocation()//将当前位置移动到地图中心  
      

      this.mapCtx.includePoints({
        padding:[10,10,10,10],
        points: [{
       
          latitude: leftLatitude,
          longitude: leftLongitude

        }, {
            latitude: rightLatitude,
            longitude: rightLongitude,
      
          
        }]
      })

    //编辑被点击的种类样式
      // let that = this
      console.log(e,'种类')
      let activeIndex = e.currentTarget.dataset.id
      let tabsList = constant.tabs[choose_id]
      tabsList.forEach((elem, idx) => {
        if (activeIndex == idx) {
          elem.hover = true
          console.log(elem,'bbbb')
        } else {
          
          elem.hover = false
        }
    })
    that.setData({
      tabsList
    })

 
    //换页面的时候初始化被选中marker的方框
    that.setData({
      scrollTop:0,
      activeMerchantIndex: -1
    })


  },





  // tabs part
  // 获取分类下的所有merchants数据
  getCategory() {
    
    mapUtils.getMerchants(this, (res) => {
      // 数组，每个成员为商家的对象
      // console.log(this.data.tabs.value, "选出分类")
      let category=this.data.tabs.value
      let merchantsData = res.data.objects
      this.setData({
        merchantsData,
        category
      
      })
      // 获取merchants数据后，将数据
      // 格式化到tabsMarkers
      this.setTabsMarkers(merchantsData)
      console.log(merchantsData)
    })

  },

  
  setTabsMarkers(merchants) {
    var image_index = this.data.image_index
    let markers = []
    console.log(image_index)
    merchants.forEach((item) => {
      let marker = {
        id: item.id,
        longitude: item.longitude,
        latitude: item.latitude,
        iconPath: '../../resources/' + image_index + '@3x.png', // 分类的图片名的image_index
        width: 32,
        height: 40
      }
      markers.push(marker)
    })

    this.setData({
      markers,
    })

    console.log(markers,'ddddddd')
    let hide = utils.hideLoadingToast()
  },

  markerTap(e) {

    let that = this
    let isSpread = this.data.isSpread
    let merchantID = e.markerId
    let merchantsData = this.data.merchantsData

    // marker激活态
    this.updateMarkerColor(merchantID)

    // 从markers中筛选出正在点击的marker
    let activeMerchant = merchantsData.find(item => {
      return merchantID === item.id
    })

    if (isSpread) {
      let activeMerchantIndex;
      let scrollTop;

      merchantsData.forEach((item, index) => {
        if (merchantID == item.id) {
          scrollTop = index * 78
          this.setData({
            scrollTop,
            activeMerchantIndex: index
          })
        }
      })
   console.log(scrollTop)

      return
    }
   



    let api, start, end

    end = this.assembleLocation(1, activeMerchant.longitude, activeMerchant.latitude)

    activeMerchant.destination = utils.assembleLocation(0, activeMerchant.longitude, activeMerchant.latitude)

    this.setData({
      activeMerchant
    })

    // 获取用户当前位置，调用腾讯计算位置api获取距离信息
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        if (res.errMsg === 'getLocation:ok') {
          start = utils.assembleLocation(1, res.longitude, res.latitude)
          activeMerchant.origin = utils.assembleLocation(0, res.longitude, res.latitude)
          that.setData({
            activeMerchant,
          })

          api = `${config.API.CALCULATE_DISTANCE}?mode=walking&from=${start}&to=${end}&key=${config.QQ_LBS.WEB_API}`

          wx.request({
            url: api,
            complete: (res) => {
              console.log(res)
              if (res.statusCode == constant.STATUS_CODE.SUCCESS) {
                if (res.data.message === "query ok"){
                  activeMerchant.distance = res.data.result.elements[0].distance
                  that.setData({
                    activeMerchant,
                  })
                  console.log(activeMerchant)
                }else{
                  activeMerchant.distance = "大于" + constant.MIN_DISTANCE.Distance
                  that.setData({
                    activeMerchant,
                  })
                }
               
              }
            }
          })
        }
        that.setData({
          isMerchantInfoShow: true,
          isMapShow: false
        })
      }

    })
   


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
                        success: (res) => {
                          if (res.errMsg === 'getLocation:ok') {
                            start = utils.assembleLocation(1, res.longitude, res.latitude)
                            activeMerchant.origin = utils.assembleLocation(0, res.longitude, res.latitude)
                            that.setData({
                              activeMerchant,
                            })

                            api = `${config.API.CALCULATE_DISTANCE}?mode=walking&from=${start}&to=${end}&key=${config.QQ_LBS.WEB_API}`

                            wx.request({
                              url: api,
                              complete: (res) => {
                                console.log(res)
                                if (res.statusCode == constant.STATUS_CODE.SUCCESS) {
                                  if (res.data.message === "query ok") {
                                    activeMerchant.distance = res.data.result.elements[0].distance
                                    that.setData({
                                      activeMerchant,
                                    })
                                    console.log(activeMerchant)
                                  } else {
                                    activeMerchant.distance = "大于" + constant.MIN_DISTANCE.Distance
                                    that.setData({
                                      activeMerchant,
                                    })
                                  }

                                }
                              }
                            })
                          }
                          that.setData({
                            isMerchantInfoShow: true,
                            isMapShow: false
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


   
  },

  closePopup(e) {
    this.setData({
      isMerchantInfoShow: false,
      isMapShow: true
    })
  },

  hiddenMerchantInfo(e) {
    this.setData({
      isMerchantInfoShow: false,
      isMapShow: true
    })
  },

  // map parts
  getCoreLocation() {

    let that = this

    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        let coreLatitude = res.latitude
        let coreLongitude = res.longitude

        that.setData({
          coreLongitude,
          coreLatitude
        })

      }
    })
  },

  /**
   * @description 根据 type 值组装位置字符串
   * 百度和高德都是经度在前纬度在后，而腾讯是反过来的，要注意处理
   * @param  {Int} type      0 代表正常顺序, 1 代表反序
   * @param  {Float} longitude  经度
   * @param  {Float} latitude  纬度
   * @return {String}           拼凑好的位置字符串
   */
  assembleLocation(type, longitude, latitude) {
    if (type == 0) return longitude + ',' + latitude
    return latitude + ',' + longitude
  },

  navigateToMerchant(e) {

    var that=this
    let {
      origin,
      destination
    } = this.data.activeMerchant
    var distance = this.data.activeMerchant.distance
    if (distance <= constant.MIN_DISTANCE.Distance){                                     //判断距离，如果太远就导航不了
      console.log(distance, '测试距离')
      this.setData({
        isMerchantInfoShow: false,
        isMapShow: true,
        isSpread: true
      })
      var image_index = this.data.image_index

      wx.navigateTo({
        url: `../goToMap/goToMap?origin=${origin}&destination=${destination}&num=${image_index}`
      })
    }else{

      wx.showModal({
        title: '提示',
        content: '距离太远无法规划路线',
        success: function (res) {
          if (res.confirm) {

            // that.hiddenMerchantInfo();   
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
   
  },

  //选中选项下标
  GoToMap:function(e){
    let timeoutId = utils.showLoadingToast('加载中...')
    var that=this

    console.log(e)
    let ListId=e.currentTarget.dataset
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
      success: function(res) {

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
      fail: function(res) {},
      complete: function(res) {},
    })
 

     
     


 

  
  
  },

  // markers
  updateMarkerColor(id) {
    var image_index = this.data.image_index
    let activeMarkerId = id
    let markers = this.data.markers
    let activeMerchantIndex = image_index
    let activeIconPath = `/resources/${activeMerchantIndex}`

    markers.forEach(item => {
      if (item.id === activeMarkerId) {
        console.log(activeIconPath,'66')
        item.iconPath = activeIconPath +'choosed@3x.png'
      } else if (item.id !== activeMarkerId) {
        item.iconPath = activeIconPath +'@3x.png'
      }
    })
    this.setData({
      markers
    })
  },


  // merchants parts
  switchMerchantsItems(e) {
    this.setData({
      isSpread: !this.data.isSpread
    })
  },
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
  
  },


  //销毁点击的数据，让重新进入页面的时候恢复到初始状态
  onUnload: function () {
    var that=this
    console.log('index---------onUnload')
    let tabsList = constant.tabs[0]
    tabsList.forEach((elem, idx) => {
      if (idx === 0) {

        elem.hover = true
        console.log(elem, 'bbbb')
      } else {

        elem.hover = false
      }
    })
    that.setData({
      tabsList
    })
    console.log(tabsList)
  },
  onShow: function () {
 

  }

})