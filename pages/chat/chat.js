var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    markers: [{
      iconPath: "../../images/icon/water.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 22.21229
      },{
          longitude: 111.324520,
          latitude: 22.21229
      }],
      color: "red",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: '../../images/icon/lightning.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },
  regionchange(e) {
    console.log(e)
  },
  markertap(e) {
    console.log(e)
  },
  controltap(e) {
    console.log(e)
  },

  onLoad: function () {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'JDZBZ-PEZKX-JBN47-T5CWB-RWFCJ-EQFN5'
    });
  },
  onShow: function () {
    // 调用接口
    qqmapsdk.search({
      keyword: '酒店',
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });

  }
})