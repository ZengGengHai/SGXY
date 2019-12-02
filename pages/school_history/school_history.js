// pages/school_history/school_history.js
const app = getApp()
var wxDraw = require("../../utils/wxdraw.min.js").wxDraw;
var Shape = require("../../utils/wxdraw.min.js").Shape;
var AnimationFrame = require("../../utils/wxdraw.min.js").AnimationFrame;


import config from '../../config/config'
import constant from '../../config/constant'
import utils from '../../utils/utils'
import util from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    school_history: [],
 
    history_list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    let history_list = that.data.history_list
    let timeoutId = utils.showLoadingToast('加载中...')
    let tableId = config.SCHOOL_HISTORY_ID.MERCHANTS
    let MyTableObject = new wx.BaaS.TableObject(tableId)
    let RECORDID = config.SCHOOL_HISTORY_ID.RECORDID
    let imageurl=[]
    console.log(RECORDID)
    MyTableObject.get(RECORDID).then(res => {
      for(var i=0;i<res.data.image.length;i++){
        imageurl.push({url:res.data.image[i]})
      }
    that.setData({
      school_history:imageurl
    })
    console.log(imageurl)
      let tableID = config.SCHOOL_HISTORY_LIST_ID.MERCHANTS
    var Product = new wx.BaaS.TableObject(tableID)  //查询数据项

   

      Product.limit(200).offset(0).orderBy('created_at').find().then(res => {
        // success
        console.log(res)
        
        for(var i=0;i<res.data.meta.total_count;i++){
          history_list.push({year:res.data.objects[i].year,title:res.data.objects[i].title,content:res.data.objects[i].content})
         
        }
        that.setData({
          history_list: history_list
        })
        console.log(history_list)
      }, err => {
        // err
      })
         
  
 
      let hide = utils.hideLoadingToast()
    }, err => {

    })











    var context = wx.createCanvasContext('textA')
    this.wxCanvas = new wxDraw(context, 0, 0, 140, 100);

    /**
     * 由于 小程序没有Dom 操作，所以没法获取canvas高度以及绘图的起点
     * 所以 wxDraw初始化的时候 需要设置 以便点击检测的时候使用
    */

    let text7 = new Shape('text', { text: "全", x: 16, y: 100, fontSize: 10, fillStyle: "#4285f4" }, 'fill', false)
    let text8 = new Shape('text', { text: "媒", x: 32, y: 100, fontSize: 10, fillStyle: "#ea4335" }, 'fill', false)
    let text9 = new Shape('text', { text: "体", x: 48, y: 100, fontSize: 10, fillStyle: "#fbbc05" }, 'fill', false)
    let text10 = new Shape('text', { text: "中", x: 64, y: 100, fontSize: 10, fillStyle: "#4285f4" }, 'fill', false)
    let text11 = new Shape('text', { text: "心", x: 80, y: 100, fontSize: 10, fillStyle: "#34a853" }, 'fill', false)
    // let text6 = new Shape('text', { text: "室", x: 96, y: 100, fontSize: 10, fillStyle: "#ea4335" }, 'fill', false)

    let text = new Shape('text', { text: "&", x: 96, y: 100, fontSize: 10, fillStyle: "#4285f4" }, 'fill', false)
    let text2 = new Shape('text', { text: "环", x: 112, y: 100, fontSize: 10, fillStyle: "#ea4335" }, 'fill', false)
    let text3 = new Shape('text', { text: "创", x: 128, y: 100, fontSize: 10, fillStyle: "#fbbc05" }, 'fill', false)
    let text4 = new Shape('text', { text: "工", x: 144, y: 100, fontSize: 10, fillStyle: "#4285f4" }, 'fill', false)
    let text5 = new Shape('text', { text: "作", x: 160, y: 100, fontSize: 10, fillStyle: "#34a853" }, 'fill', false)
    let text6 = new Shape('text', { text: "室", x: 175, y: 100, fontSize: 10, fillStyle: "#ea4335" }, 'fill', false)




    this.wxCanvas.add(text);
    this.wxCanvas.add(text2);
    this.wxCanvas.add(text3);
    this.wxCanvas.add(text4);
    this.wxCanvas.add(text5);
    this.wxCanvas.add(text6);

    this.wxCanvas.add(text7);
    this.wxCanvas.add(text8);
    this.wxCanvas.add(text9);
    this.wxCanvas.add(text10);
    this.wxCanvas.add(text11);

    // this.wxCanvas.add(text6);




    setTimeout(function () {
      text7.animate({ "y": "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 0);


    setTimeout(function () {

      text8.animate({ "y": "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 50);


    setTimeout(function () {
      text9.animate({ "y": "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 100);

    setTimeout(function () {
      text10.animate({ "y": "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 150);

    setTimeout(function () {
      text11.animate({ "y": "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 200);


    setTimeout(function () {
      text.animate({ "y": "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 250);


    setTimeout(function () {

      text2.animate({ "y": "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 300);


    setTimeout(function () {
      text3.animate({ "y": "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 350);

    setTimeout(function () {
      text4.animate({ "y": "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 400);

    setTimeout(function () {
      text5.animate({ "y": "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 450);

    setTimeout(function () {
      text6.animate({ "y": "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 500);



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