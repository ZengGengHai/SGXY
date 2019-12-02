import amapFile from '../../utils/amap-wx'
import config from '../../config/config'
import constant from '../../config/constant'
import utils from '../../utils/utils'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    origin: '',
    destination: '',
    coreLongitude: '113.66845',
    coreLatitude: '24.77925',
    routeColor: "#0091FF",
    polyline: [],
    controls:[],
    includePoints: [],
    markers: [],
    num:'',

    come_from_img:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var come_from_img = options.come_from_img||""
    console.log(options,'导航页面')
    var that=this

    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowWidth)
        console.log(res.windowHeight)

      var  controls= [{
          id: 'goHome',
          iconPath: '/resources/go-map@3x.png',
          clickable: true,
          position: {
            left: res.windowWidth-80,
            top: res.windowHeight-100,
            width: 52,
            height: 52,
          }
        }]
      
        that.setData({
          controls,
          come_from_img,
        })

      }
    })
    let num=options.num
    console.log(num,'测试种类图片下标')
    this.setData({
      num:num
    })
    let origin = options.origin
    console.log(options,'查看页面导过来的所有数据')
    let destination = options.destination

    let originArr = this.disassembleLocation(origin)      //把字符串分割成数组
    let destinationArr = this.disassembleLocation(destination)  //把字符串分割成数组


    this.setData({
      mapLongitude: originArr[0],
      mapLatitude: originArr[1]
    })

    this.setData({
      origin,
      destination
    })

    this.setDestinationMarker(destinationArr[0], destinationArr[1])
    this.routeArrange(origin, destination)
  

  },
  disassembleLocation(locString) {
    return locString.split(',')
  },

  setDestinationMarker(longitude, latitude) {          //设置图标

    let markers = []
    var num=this.data.num
    console.log(num,'sjdhagjskghskjghjksdhgjsdhgsdh')
    var iconPath = '/resources/' + num +'@3x.png'
    let marker = {
      id: 'destination',
      longitude,
      latitude,
      iconPath: iconPath, // 简化版值用到科技IT分类的公司
      width: 32,
      height: 40
    }

    markers.push(marker)
    this.setData({
      markers
    })
  },

  routeArrange(origin, destination) {
    let origins = origin.split(',')
    let routeColor = this.data.routeColor

    this.setData({
      mapLongitude: origins[0],
      mapLatitude: origins[1]
    })

    let that = this
    let aMap = new amapFile.AMapWX({
      key: config.AUTO_NAVI.JS_SDK
    })

    // 调用高德地图微信api获取路线规划
    // http://lbs.amap.com/api/javascript-api/summary/
    aMap.getWalkingRoute({
      origin: origin,
      destination: destination,
      success: function (data) {
        let points = [];
        console.log(data)
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }

        that.setData({
          polyline: [{
            points: points,
            color: routeColor,
            width: 2,
            dottedLine: true,
          }]
        });

        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if (data.paths[0] && data.paths[0].duration) {
          that.setData({
            cost: parseInt(data.paths[0].duration / 60) + '分钟'
          });
        }

        that.setIncludePoints(points)
      },

      fail: function (info) {
        console.log("info faild: ", info)
      }
    })
  },
  setIncludePoints(polylinePoints) {
    console.log(polylinePoints,'aaaaa')
    let origin = this.data.origin.split(',')
    let destination = this.data.destination.split(',')

    let originDestinationPonits = [{
      longitude: parseFloat(origin[0]),
      latitude: parseFloat(origin[1])
    }, {
      longitude: parseFloat(destination[0]),
      latitude: parseFloat(destination[1])
    }]
    // console.log(originDestinationPonits, 'aaaaa')
    let includePoints = originDestinationPonits.concat(polylinePoints)
    // console.log(includePoints)
    this.setData({
      includePoints: includePoints
    })
  },
  controlTap(e) {
   console.log(e)
    let id = e.controlId

    if (id == 'goHome') {
      var come_from_img = this.data.come_from_img
      if (come_from_img){
        wx.navigateBack({
          delta: 1
        });
      }else{

      getApp().navToHome()
      }
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