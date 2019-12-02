// pages/check_image/check_image.js
import config from '../../config/config'
import constant from '../../config/constant'
import utils from '../../utils/utils'
import util from '../../utils/util'



Page({

  /**
   * 页面的初始数据
   */
  data: {


    images: [],
    scroll_H: 0,
    imgWidth: 0,
    oneimages: [],
    twoimages: [],
    oImageIndex: [],
    index: 0,
    tempindex: 0,
    image_limit: 8,
    image_offset: 0,
    number_offset:0,
    image_next: true,
    one: false,
    two: false,
    loading: true,
    next_word: '滑动或者点击这里查看更多',
    mUrl: [], //图片缓存数组用到
    scroll_top: 0,
    category: ['韶院风景', '思维创意', '校园生活', '校园美食', '校园萌宠', '毕业剪影', '其它类别'],
  },


  requestData: function () {

    var that = this
    var next = this.data.image_next
    let tableID = config.IMAGE_ID.MERCHANTS
    var Product = new wx.BaaS.TableObject(tableID)
    var limit = this.data.image_limit
    var offset = this.data.image_offset
    var itemList = [];
    var mUrl = that.data.mUrl
    var category = this.data.category
    var query1 = new wx.BaaS.Query()
    query1.in('category', category)
    let query2 = new wx.BaaS.Query()
    query2.compare('examine', '=', 'no')
    var query3 = new wx.BaaS.Query()
    // query3.compare('Time', '=', 'today')
    let andQuery = wx.BaaS.Query.and(query1, query2)
    var loading = this.data.loading
    let MyTableObject = new wx.BaaS.TableObject(tableID)    //批量修改数据


    if (loading) {   //没次加载完才触发
      if (next) {
 
        Product.setQuery(andQuery).orderBy('-created_at').limit(limit).offset(offset).find().then(res => {
          console.log(res)
          let timeoutId = utils.showLoadingToast('加载中...')
          console.log(res)
          if (res.data.meta.next == null) {
            let hide = utils.hideLoadingToast()
            this.setData({
              image_next: false,
              next_word: '- End -',
              one: true,
              two: false

            })
            console.log('空了')

          }
          console.log(res.data.objects.length)
          for (var i = 0; i < res.data.objects.length; i++) {
            mUrl.push({ ImageUrl: res.data.objects[i].ImageUrl, category: res.data.objects[i].category, user_name: res.data.objects[i].user_name, user_image: res.data.objects[i].user_image, id: res.data.objects[i].id, created_at: util.js_date_time(res.data.objects[i].created_at), watermark: res.data.objects[i].watermark, Student_ID: res.data.objects[i].Student_ID})
            this.setData({
              mUrl: mUrl
            })
          }
          var MUrl = this.data.mUrl
          for (var i = 0; i < MUrl.length; i++) {
            itemList.push({ pic: MUrl[i].ImageUrl, height: 0, category: MUrl[i].category, user_name: MUrl[i].user_name, user_image: MUrl[i].user_image, user_id: MUrl[i].id, created_at: MUrl[i].created_at, watermark: MUrl[i].watermark, Student_ID: MUrl[i].Student_ID });
          }
          console.log(itemList)
          var number_offset = this.data.number_offset + 8
          that.setData({
            images: itemList,
            hidden: true,
            tempindex: mUrl.length,
            number_offset: number_offset,
            loading: false
          });
          this.aaa(that);

        }, err => {

        })


        let records = MyTableObject.limit(limit).offset(offset).getWithoutData(andQuery)  //批量数据更新
        records.set('examine', 'false')
        records.update().then(res => {
          console.log(res, '数据更新')
        }, err => { })


      }
      this.setData({
        tabClick_three: true
      })

    }


  },
  loadimg: function (e) {//图片加载完成执行
  console.log(e,'dfefdf')


    var index = e.currentTarget.id;
    console.log(index)
    var oImageIndex = this.data.oImageIndex;

    var tempIndex = 0;
    for (var i = 0; i < oImageIndex.length; i++) {
      if (oImageIndex[i] == index) {
        tempIndex = i;
        break;
      }
    }
    console.log(oImageIndex);
    var imgWidth = this.data.imgWidth;//图片设置的宽度
    var oImgW = e.detail.width;//图片原始宽度
    var scal = imgWidth / oImgW;//比例计算
    var oImgH = e.detail.height;//图片原始高度
    var _imgHeight = oImgH * scal;//自适应高度
    var images = this.data.images;
    images[index].height = _imgHeight;

    var watermark = images[index].watermark  //水印

   
      if (watermark === 'yes') {

      } else {
      images[index].url = images[index].pic
      }

    oImageIndex.splice(tempIndex, 1);
    this.setData({
      oImageIndex: oImageIndex,
      images: images
    })

    var oneimages = this.data.oneimages;
    var twoimages = this.data.twoimages;
    if (oImageIndex.length == this.data.index) { //当加载完最后一张图片执行
      var oneImageH = 0;
      var twoImageH = 0;
      for (var i = this.data.index; i < images.length; i++) {
        if (i > 0) { //第一张除外
          if (oneImageH > twoImageH) {
            twoImageH += images[i].height;
            twoimages.push(images[i]);

          } else {
            oneImageH += images[i].height;
            oneimages.push(images[i]);

          }
        } else {
          oneImageH += images[i].height;
          oneimages.push(images[i])

        }
      }
      if (oneImageH > twoImageH) {
        this.setData({
          one: false,
          two: true
        })
      } else {
        this.setData({
          one: true,
          two: false
        })

      }
      this.data.index = this.data.tempindex
      console.log(this.data.index);
    }

    this.setData({
      oneimages: oneimages,
      twoimages: twoimages
    })
    var number_offset = this.data.number_offset
    console.log(oImageIndex.length, number_offset - 7, 'oImageIndex.length<1')
    if (oImageIndex.length < number_offset - 7) {
      let hide = utils.hideLoadingToast()
      this.setData({
        loading: true
      })
    }

  },
  aaa: function (that) {
    var images = that.data.images;
    console.log(images);
    var oImageIndex = [];//把数组下标存入临时对象中
    for (var i = 0; i < images.length; i++) {
      oImageIndex.push(i);

    }

    that.setData({
      oImageIndex: oImageIndex
    })



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //图片部分
    var that=this
    wx.getSystemInfo({//获取屏幕宽高
      success: function (res) {

        var _width = res.windowWidth;
        var imgWidth = _width * 0.48; //样式表里面设置的宽度
        var scroll_H = res.windowHeight * (750 / res.windowWidth);

        that.setData({
          scroll_H: scroll_H,
          imgWidth: imgWidth
        })
      }
    })
    this.requestData()
    
  },
  next: function () {
    this.requestData()

  },
  image_lower: function () {
    this.requestData()
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