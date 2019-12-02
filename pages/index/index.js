
import amapFile from '../../utils/amap-wx'
import config from '../../config/config'
import constant from '../../config/constant'
import utils from '../../utils/utils'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      title: '韶院视野',
      img: 'https://cloud-minapp-13676.cloud.ifanrusercontent.com/1fuEBvRsKrFDKMCk.jpg',
      url: '/School_Introduction/School_Introduction'
    },
    {
      title: '校园导览',
      img: 'https://cloud-minapp-13676.cloud.ifanrusercontent.com/1hSgpaP3KaDrkfJ7.jpg',
      url: '/navigator/navigator'
    },
    {
      title: '水电查询',
      img: 'https://cloud-minapp-13676.cloud.ifanrusercontent.com/1fvLPCUgFIZldLNv.jpg',
      url: '/inquiry_water_electric/inquiry_water_electric'
    },
    {
      title: '广播点歌',
      img: 'https://cloud-minapp-13676.cloud.ifanrusercontent.com/1hGkWcWtytOeO9fl.jpg',
      url: '/choose_song/choose_song'
      },
      {
        title:'韶院消息',
        img: 'https://cloud-minapp-13676.cloud.ifanrusercontent.com/1hRIWrnpk573Fs8c.jpg',
        url: '/school_new/school_new'
      },
      {
        title: '个人中心',
        img: 'https://cloud-minapp-13676.cloud.ifanrusercontent.com/1hRIWkpU6Dnr1mkO.jpg',
        url: '/person/person'
      }
      ]
    
  },

  toChild(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages' + e.currentTarget.dataset.url
    })

  },
  map:function(){
    wx.navigateTo({
      url: '../navigator/navigator',
    })
    // let MyTableObject = new wx.BaaS.TableObject(44119)
    // let query = new wx.BaaS.Query()

   

    

    // // 与更新特定记录一致
    // // 设置更新内容 ...
    // let records = MyTableObject.limit(1000).offset(0).getWithoutData(query)
    // // 与更新特定记录一致
    // records.set('Collection_quantity', 0)
    // records.update({ enableTrigger: false }).then(res => { }, err => { })
    
  },

  home: function () {
    wx.switchTab({
      url: '../home/home'
    })
  },
  head_portrait:function(){
    wx.navigateTo({
      // url: '../head_portrait/head_portrait',
      url:'../school_i/school_i',

    })
  },
  All_function: function () {


    wx.navigateTo({
      url: '../Function/Function',

    })
    // wx.navigateTo({
    //   url: '../inquiry_water_electric/inquiry_water_electric',

    // })
  },

  
  School_Introduction:function(){
    wx.navigateTo({
      url: '../School_Introduction/School_Introduction',

    })

  },
  History:function(){
    wx.navigateTo({
      url: '../school_history/school_history',

    })
  },
  Personal:function(){

    wx.navigateTo({
      url: '../person/person?open='+'',

    })


  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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