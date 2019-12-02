
import config from '../../config/config'
import constant from '../../config/constant'
import utils from '../../utils/utils'
import util from '../../utils/util'


const app = getApp()
var wxDraw = require("../../utils/wxdraw.min.js").wxDraw;
var Shape = require("../../utils/wxdraw.min.js").Shape;
var AnimationFrame = require("../../utils/wxdraw.min.js").AnimationFrame;





Page({

  /**
   * 页面的初始数据
   */
  data: {

    userInfo: {},
    image: false,
    bgPic_x: 0,
    bgPic_y: 0,
    user_Img_x: 0,
    user_Img_y: 0,
    user_image: '',
    canvasimgbg: "",
    data: '',
    image_list: [],
    choose: '',
    canvas_choose_image: '',
    login: false,
    draw: false,


  },



  userInfoHandler(data) {
    let timeoutId = utils.showLoadingToast('加载中...')
    var that = this
    let choose = this.data.choose
    wx.downloadFile({
      url: choose,
      success: function (res) {
        that.setData({
          canvas_choose_image: res.tempFilePath
        })

      }
    })



    wx.BaaS.handleUserInfo(data).then(res => {
      console.log(res)  //用户授权成功
      console.log(res.id)
      var that = this

      var avatarUrl = res.avatarUrl;
      var a = avatarUrl.replace(/132$/, '0');

      let MyUser = new wx.BaaS.User()
      let userID = res.id
      MyUser.get(userID).then(res => {
        console.log(res, '444')
        this.setData({
          user_image: a,
          image: true,
          login: true,
        })
        wx.downloadFile({
          url: a,
          success: function (res) {

            that.setData({
              canvasimgbg: res.tempFilePath
            })
            console.log(res.tempFilePath)
            let hide = utils.hideLoadingToast()
          }
        })

        wx.showModal({
          title: '微信头像细节',
          content: '如果微信刚刚更改头像，需要等待两个小时后，小程序才可以获取得到新的头像',
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


      }, err => {
        // err
      })





      wx.setStorage({//存储到本地
        key: "userInfo",
        data: res
      })

    }, res => {

    })

  },
  Make: function () {

    let timeoutId = utils.showLoadingToast('加载中...')
    var that = this
    let login = this.data.login;
    if (!login) {   //如果没有授权头像

      wx.showToast({
        title: '请先授权头像',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({
        draw: true
      })

      let bgPic_x = this.data.bgPic_x;
      let bgPic_y = this.data.bgPic_y;
      let user_Img_x = this.data.user_Img_x;
      let user_Img_y = this.data.user_Img_y;
      let user_image = this.data.canvasimgbg;
      let canvas_choose_image = this.data.canvas_choose_image



      const pc = wx.createCanvasContext('myCanvas');
      pc.clearRect(bgPic_x, bgPic_y, 260, 260);      //画版位置
      pc.drawImage(user_image, user_Img_x, 35, 190, 190);
      pc.drawImage(canvas_choose_image, bgPic_x, 0, 260, 260);
      pc.draw();
      // let hide = utils.hideLoadingToast();


      wx.showToast({
        title: '绘制成功，下滑查看',
        icon: 'none',
        duration: 3000,
      })

    }







  },
  choose_image: function (e) {
    let timeoutId = utils.showLoadingToast('加载中...')
    console.log(e)
    let id = e.target.dataset.id
    console.log(id)
    var that = this
    let image_list = that.data.image_list
    that.setData({
      choose: image_list[id].src
    })
    wx.downloadFile({
      url: image_list[id].src,
      success: function (res) {
        let hide = utils.hideLoadingToast()
        that.setData({
          canvas_choose_image: res.tempFilePath
        })

      }
    })


  },
  savePic: function () {

    let draw = this.data.draw;
    if (!draw) {
      wx.showToast({
        title: '请先绘制头像',
        icon: 'none',
        duration: 2000
      })
    } else {
      let timeoutId = utils.showLoadingToast('加载中...')
      const windowWidth = wx.getSystemInfoSync().windowWidth;
      wx.canvasToTempFilePath({
        x: windowWidth / 2 - 130,
        y: 0,
        height: 260,
        width: 260,
        canvasId: 'myCanvas',
        success: (res) => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: (res) => {
              let hide = utils.hideLoadingToast()
              console.log("success:" + res);
            }, fail(e) {
              console.log("err:" + e);
            }
          })
        }
      });
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    let timeoutId = utils.showLoadingToast('加载中...')
    let image_list = this.data.image_list



    let tableID = config.HEAD_PROTRAIT_ID.MERCHANTS
    var Product = new wx.BaaS.TableObject(tableID)  //查询数据项
    Product.limit(200).offset(0).orderBy('created_at').find().then(res => {
      // success
      console.log(res)

      for (var i = 0; i < res.data.meta.total_count; i++) {
        image_list.push({ src: res.data.objects[i].src, name: res.data.objects[i].name, id: i })

      }
      that.setData({
        image_list: image_list,
        choose: image_list[0].src

      })
      console.log(image_list)
    }, err => {
      // err
    })

    let hide = utils.hideLoadingToast()














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
      text7.animate({ y: "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ y: "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 0);


    setTimeout(function () {

      text8.animate({ y: "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ y: "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 50);


    setTimeout(function () {
      text9.animate({ y: "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ y: "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 100);

    setTimeout(function () {
      text10.animate({ y: "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ y: "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 150);

    setTimeout(function () {
      text11.animate({ y: "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ y: "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 200);


    setTimeout(function () {
      text.animate({ y: "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ y: "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 250);


    setTimeout(function () {

      text2.animate({ y: "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ y: "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 300);


    setTimeout(function () {
      text3.animate({ y: "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ y: "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 350);

    setTimeout(function () {
      text4.animate({ y: "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ y: "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 400);

    setTimeout(function () {
      text5.animate({ y: "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ y: "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 450);

    setTimeout(function () {
      text6.animate({ y: "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ y: "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 500);




  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    console.log(windowWidth)
    var that = this
    that.setData({
      bgPic_x: windowWidth / 2 - 130,   //边框左边横轴
      bgPic_y: 30,   //边框左边点纵轴
      user_Img_x: windowWidth / 2 - 95, //头像左边位子横轴
      user_Img_y: 65,  //头像左边位子纵轴

    })
    // let choose=this.data.choose

    // wx.downloadFile({
    //   url: choose,
    //   success: function (res) {
    //     that.setData({
    //       canvas_choose_image: res.tempFilePath
    //     })

    //   }
    // })
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
      title: '韶院60周年头像纪念框',
      path: '/pages/head_portrait/head_portrait',
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