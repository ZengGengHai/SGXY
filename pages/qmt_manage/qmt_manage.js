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
    examine: 'true',
    choose_id: "0",


    showModal: false,





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
    number_offset: 0,
    image_next: true,
    one: false,
    two: false,
    loading: true,
    next_word: '滑动或者点击这里查看更多',
    mUrl: [], //图片缓存数组用到
    scroll_top: 0,
    category: ['韶院风景', '思维创意', '校园生活', '校园美食', '校园萌宠', '毕业剪影', '其它类别'],


    oneImageH: 0,
    twoImageH: 0,


    image_category: [],
    image_id: '',
    image_imageurl: '',
    image_user_image: '',
    image_user_name: '',
    image_created_at: '',
    image_origin: '',
    image_height: '',
    image_item: ''
  },




  requestData: function () {

    var that = this
    // var user_created_by = wx.BaaS.storage.get('uid')  //用户id
    var examine = this.data.examine
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
    query2.compare('examine', '=', examine)
    // var query3 = new wx.BaaS.Query()
    // query3.compare('user_name', '=', '全媒体中心')
    // query3.compare('created_by', '=', 64820356)
    // let andQuery = wx.BaaS.Query.and(query1, query2, query3)
    let andQuery = wx.BaaS.Query.and(query1, query2)
    var loading = this.data.loading

    // let MyTableObject = new wx.BaaS.TableObject(tableID)    //批量修改数据


    if (loading) {   //没次加载完才触发
      if (next) {

        Product.setQuery(andQuery).orderBy('-created_at').limit(limit).offset(offset).expand('created_by').find().then(res => {
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
            mUrl.push({ ImageUrl: res.data.objects[i].ImageUrl, category: res.data.objects[i].category, user_name: res.data.objects[i].created_by.nickname, user_image: res.data.objects[i].created_by.avatar, id: res.data.objects[i].id, created_at: util.js_date_time(res.data.objects[i].created_at), watermark: res.data.objects[i].watermark, Student_ID: res.data.objects[i].Student_ID })
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
          var image_offset = this.data.image_offset + 8
          that.setData({
            image_offset,
            images: itemList,
            hidden: true,
            tempindex: mUrl.length,
            number_offset: number_offset,
            loading: false
          });
          this.aaa(that);
        }, err => {
        })
        // let records = MyTableObject.limit(limit).offset(offset).getWithoutData(andQuery)  //批量数据更新
        // records.set('examine', 'false')
        // records.update().then(res => {
        //   console.log(res, '数据更新')
        // }, err => { })
      }
      this.setData({
        tabClick_three: true
      })

    }


  },
  loadimg: function (e) {//图片加载完成执行
    console.log(e, 'dfefdf')
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
    var user_name = images[index].user_name


    if (user_name === '全媒体中心') {
      var left = Math.round(5 / scal)
      var bottom = Math.round(3 / scal)
      console.log(left)
      images[index].url = images[index].pic + "!/watermark/align/southeast/margin/" + left + "x" + bottom + '/percent/10' + '/url/MWZxWU5wV3Z5bFdaV3Z3Qi5wbmc='
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
    var oneImageH = this.data.oneImageH
    var twoImageH = this.data.twoImageH
    if (oImageIndex.length == this.data.index) { //当加载完最后一张图片执行
      // var oneImageH = 0;
      // var twoImageH = 0;
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
        loading: true,
        oneImageH,
        twoImageH,
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
  maopao: function () {
    //冒泡阻断
  },
  see: function () {
    var image_category = this.data.image_category
    var image_id = this.data.image_id
    var image_imageurl = this.data.image_imageurl
    var image_user_image = this.data.image_user_image
    var image_user_name = this.data.image_user_name
    var image_created_at = this.data.image_created_at

    wx.navigateTo({
      url: '../Picture_details/Picture_details?imageUrl=' + image_imageurl + '&category=' + image_category + '&user_name=' + image_user_name + '&created_at=' + image_created_at + '&user_image=' + image_user_image + '&id=' + image_id,
    })

  },
  image_details: function (e) {
    var that = this
    console.log(e)
    var image_category = e.target.dataset.category
    var image_id = e.target.dataset.id
    var image_imageurl = e.target.dataset.imageurl
    var image_user_image = e.target.dataset.user_image
    var image_user_name = e.target.dataset.user_name
    var image_created_at = e.target.dataset.created_at
    var image_origin = e.target.dataset.origin
    var image_height = e.target.dataset.height
    var image_item = e.target.dataset.item


    that.setData({
      showModal: true,
      image_category,
      image_id,
      image_imageurl,
      image_user_image,
      image_user_name,
      image_created_at,
      image_origin,
      image_height,
      image_item,
    })

  },
  give_up: function () {
    var that = this
    var image_id = this.data.image_id
    var image_origin = this.data.image_origin
    var oneimages = this.data.oneimages;
    var twoimages = this.data.twoimages;
    var image_height = this.data.image_height
    var image_item = this.data.image_item
    var image_offset = this.data.image_offset - 1
    wx.showModal({
      title: '删除后不可恢复数据',
      content: '如需删除此图片，请点击确认。',
      success: function (res) {
        if (res.cancel) {
          that.setData({
          })
        } else if (res.confirm) {
          let timeoutId = utils.showLoadingToast('加载中...')
          let tableID = config.IMAGE_ID.MERCHANTS
          let recordID = image_id
          let Product = new wx.BaaS.TableObject(tableID)
          Product.delete(recordID).then(res => {
            if (image_origin === 'left') {
              var oneImageH = that.data.oneImageH - image_height
              oneimages.splice(image_item, 1)
              that.setData({
                oneimages,
                oneImageH,
                showModal: false,
                image_offset,
              })
            } else {
              var twoImageH = that.data.twoImageH - image_height
              twoimages.splice(image_item, 1)
              that.setData({
                twoimages,
                twoImageH,
                showModal: false,
                image_offset,
              })
            }
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1000
            })
          }, err => {
            wx.showToast({
              title: 'sorry，你没有权限操作',
              icon: 'none',
              duration: 1000
            })
          })
        }
      }
    })
  },

  delete_left: function (e) {
    var that = this
    console.log(e)
    var id = e.target.dataset.id
    var item = e.target.dataset.item
    console.log(id)
    var oneimages = this.data.oneimages;
    var height = e.target.dataset.height
    var oneImageH = this.data.oneImageH - height
    // that.setData({
    //   showModal: true
    // })
    oneimages.splice(item, 1)

    this.setData({
      oneimages,
      oneImageH,
    })
  },

  close_modal: function () {
    var that = this
    that.setData({
      showModal: false
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //图片部分
    var that = this
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
  // 阻断事件向下传递，避免在弹窗后还可以点击或者滑动蒙层下的界面
  preventTouchMove: function () {
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