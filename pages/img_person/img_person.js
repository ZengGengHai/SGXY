// pages/img_person/img_person.js


import config from '../../config/config'
import utils from '../../utils/utils'
import util from '../../utils/util'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id:'',
    user_name:'',
    user_image:'',
    focus_box:true,
    fllow_num:0,
    fans:0,





    down_num:0,
    image_number:0,




    images: [],
    scroll_H: 0,
    imgWidth: 0,
    oneimages: [],
    twoimages: [],
    threeimages:[],
    oImageIndex: [],
    index:0,
    tempindex:0,
    image_limit:8,
    image_offset:0,
    oneImageH: 0,
    twoImageH: 1,
    threeImageH:2,
    image_next: true,
    one: false,
    two: false,
    three:false,
    loading: true,
    next_word: '点击查看更多',
    mUrl: [], //图片缓存数组用到
    scroll_top: 0,
    category: ['韶院风景', '思维创意', '校园生活', '校园美食', '校园萌宠', '毕业剪影', '其它类别'],
   

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var user_id=options.user_id
    var user_name=options.user_name
    var user_image=options.user_image
    var that=this

    that.setData({
      user_id,
      user_name,
      user_image,
    })
  


    wx.getSystemInfo({//获取屏幕宽高
      success: function (res) {

        var _width = res.windowWidth;
        var imgWidth = _width * 0.28; //样式表里面设置的宽度
        var scroll_H = res.windowHeight * (750 / res.windowWidth);

        that.setData({
          scroll_H: scroll_H,
          imgWidth: imgWidth
        })
      }
    })


    this.requestData();  //图片墙
    this.person_info();  //作者信息
    let my_id = app.getUserId();
    console.log(my_id,user_id)
    // if (user_id=my_id){
    //  that.setData({
    //    focus_box:false
    //  })
    // }else{
    // this.focus();  //用户是否已经关注
    // }
    if (user_id != my_id){
      this.focus();  //用户是否已经关注
    }else{
      that.setData({
       focus_box:false
     })
    }
    this.fans(); //关注以及粉丝

  },
  //韶院图片墙部分
  requestData: function () {
    var next = this.data.image_next
    var that = this
    let tableID = config.IMAGE_ID.MERCHANTS
    var Product = new wx.BaaS.TableObject(tableID)
    var limit = this.data.image_limit
    var offset = this.data.image_offset
    var itemList = [];
    var mUrl = that.data.mUrl
    var category = this.data.category
    var Collection_quantity = 0
    var query1 = new wx.BaaS.Query()
    query1.in('category', category)
    let query2 = new wx.BaaS.Query()
    query2.compare('examine', '=', 'true')
    let query3 = new wx.BaaS.Query()
    query3.compare('created_by', '=', parseInt(this.data.user_id))
    let andQuery = wx.BaaS.Query.and(query1, query2, query3)
    var loading = this.data.loading
    if (loading) {   //没次加载完才触发
      if (next) {
        Product.setQuery(andQuery).orderBy('-created_at').limit(limit).offset(offset).expand('created_by').find().then(res => {
          console.log(res, 'jjkjkjkjkjkj')
          let timeoutId = utils.showLoadingToast('加载中...')
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
          let content_num
          let content
          for (var i = 0; i < res.data.objects.length; i++) {
            var longitude = res.data.objects[i].longitude||""
            var latitude = res.data.objects[i].latitude ||""



            if (longitude === "" || longitude === undefined || longitude === null) {     //判断图片是否有定位信息
              var imgshow = false
            } else {
              var imgshow = true
            }

  

            mUrl.push({ ImageUrl: res.data.objects[i].ImageUrl, category: res.data.objects[i].category, user_name: res.data.objects[i].created_by.nickname, user_image: res.data.objects[i].created_by.avatar, id: res.data.objects[i].id, created_at: util.js_date_time(res.data.objects[i].created_at), created_by: res.data.objects[i].created_by.created_by, watermark: res.data.objects[i].watermark, content_num: res.data.objects[i].content_num, Collection_quantity: res.data.objects[i].Collection_quantity, content: res.data.objects[i].content, longitude, latitude, imgshow})
            this.setData({
              mUrl: mUrl
            })
          }
          var MUrl = this.data.mUrl
          for (var i = 0; i < MUrl.length; i++) {
            itemList.push({ pic: MUrl[i].ImageUrl, height: 0, category: MUrl[i].category, user_name: MUrl[i].user_name, user_image: MUrl[i].user_image, user_id: MUrl[i].id, created_at: MUrl[i].created_at, created_by: MUrl[i].created_by, watermark: MUrl[i].watermark, img_width: 0, img_height: 0, content_num: MUrl[i].content_num, content: MUrl[i].content, Collection_quantity: MUrl[i].Collection_quantity, longitude: MUrl[i].longitude, latitude: MUrl[i].latitude, imgshow: MUrl[i].imgshow });
          }
          console.log(itemList)
          var offset = this.data.image_offset + 8
          that.setData({
            images: itemList,
            hidden: true,
            tempindex: mUrl.length,
            image_offset: offset,
            loading: false
          });
          this.aaa(that);
        }, err => {
        })
      }
      this.setData({
        tabClick_three: true
      })
    }
  },
  person_info:function(){
    let tableID = config.User.MERCHANTS
    var Product = new wx.BaaS.TableObject(tableID)

    let query = new wx.BaaS.Query()
    query.compare('user_id', '=', this.data.user_id)

    // 应用查询对象
    Product.setQuery(query).find().then(res => {
      var down_num = res.data.objects[0].down_num
      var image_number = res.data.objects[0].image_number

      console.log(res.data.objects[0].down_num)
      this.setData({
        down_num,
        image_number
      })


    }, err => {
      // err
    })

    

  },
  next:function(){
    this.requestData();
  },
  error: function (ev) {
    console.log(ev, 'lklklklklklk')

    var _that = this;
    util.errImgFun(ev, _that)

  },


  loadimg: function (e) {//图片加载完成执行
    var that=this

    var index = e.currentTarget.id;
    var oImageIndex = this.data.oImageIndex;
    var tempIndex = 0;
    for (var i = 0; i < oImageIndex.length; i++) {
      if (oImageIndex[i] == index) {
        tempIndex = i;
        break;
      }
    }
    console.log(e)
    var imgWidth = this.data.imgWidth;//图片设置的宽度
    var oImgW = e.detail.width;//图片原始宽度
    var scal = imgWidth/oImgW;   //比例计算
    
    var oImgH = e.detail.height;//图片原始高度
    var _imgHeight = oImgH * scal;//自适应高度
    var images = this.data.images;
    images[index].height = _imgHeight;
    let watermark = images[index].watermark  //水印
    if (watermark === 'yes') {
      var size = 11 / (scal * 10)
      var left = Math.round(5 / scal)
      var bottom = Math.round(3 / scal)
      console.log(left)
      // images[index].url = images[index].pic + "!/watermark/size/" + size + "/margin/" + left + "x" + bottom + "/align/southeast/text/5YWo5aqS5L2T5Lit5b+D"
      if (e.detail.width > 2000) {
        images[index].url = images[index].pic + "!/watermark/align/southeast/margin/" + '5' + "x" + '3' + '/percent/10' + '/url/MWZxWU5wV3Z5bFdaV3Z3Qi5wbmc=/fw/160'
      } else {
        images[index].url = images[index].pic + "!/watermark/align/southeast/margin/" + '5' + "x" + '3' + '/percent/10' + '/url/MWZxWU5wV3Z5bFdaV3Z3Qi5wbmc='
      }
    } else {
      images[index].url = images[index].pic
    }
    images[index].img_width = oImgW,
    images[index].img_height = oImgH
    oImageIndex.splice(tempIndex, 1);
    this.setData({
      oImageIndex: oImageIndex,
      images: images
    })

    var oneimages = this.data.oneimages;
    var twoimages = this.data.twoimages;
    var threeimages =this.data.threeimages;
    var oneImageH = this.data.oneImageH;
    var twoImageH = this.data.twoImageH;
    var threeImageH = this.data.threeImageH;
    if (oImageIndex.length == this.data.index) { //当加载完最后一张图片执行
      wx.getNetworkType({
        success(res) {
          const networkType = res.networkType
          console.log(networkType)
          if (networkType !== 'wifi') {
            // var timeOut = setTimeout(function () {
            //   console.log("延迟调用============")
            //   let hide = utils.hideLoadingToast()
            // }, 2000)
            let hide = utils.hideLoadingToast()
          } else {
            let hide = utils.hideLoadingToast()
          }
        }
      })
      for (var i = this.data.index; i < images.length; i++) {

    
          if (oneImageH > twoImageH && threeImageH > twoImageH) {
            twoImageH+=images[i].height;
            twoimages.push(images[i]);
            this.setData({
              twoimages: twoimages,
              twoImageH
            })

          } else if (oneImageH > threeImageH && twoImageH > threeImageH){
            threeImageH+=images[i].height;
            threeimages.push(images[i]);
            this.setData({
              threeimages:threeimages,
              threeImageH
            })
          }else {
            oneImageH+= images[i].height;
            oneimages.push(images[i]);
            this.setData({
              oneImageH,
              oneimages: oneimages
            })
          }
        }
     
      if (oneImageH > twoImageH && threeImageH > twoImageH ) {
        this.setData({
          one: false,
          two: true,
          three:false
        })
      } else if (oneImageH > threeImageH && twoImageH > threeImageH){
        this.setData({
          one: false,
          two: false,
          three: true
        })
      } else {
        this.setData({
          one: true,
          two: false,
          three:false
        })
      }
      this.data.index = this.data.tempindex
    }
    this.setData({
      oneImageH: oneImageH,
      twoImageH: twoImageH,
      threeImageH:threeImageH
    })
    var image_offset = this.data.image_offset

    if (oImageIndex.length < image_offset - 7) {

      this.setData({
        loading: true
      })
    }

  },
  error: function (ev) {
    console.log(ev, 'lklklklklklk')

    var _that = this;
    util.errImgFun(ev, _that)

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
  image_lower: function () {

    this.requestData()
  },
  focus:function(){  //查询是否关注
    var that=this
    let tableID = config.Focus_on_users.MERCHANTS

    let query1 = new wx.BaaS.Query()

    query1.compare('focus_id', '=', this.data.user_id)

    let query2 = new wx.BaaS.Query()
    let user_id = app.getUserId();
    query2.compare('created_by', '=', parseInt(user_id))
    let andQuery = wx.BaaS.Query.and(query1, query2)

    let Product = new wx.BaaS.TableObject(tableID)
    Product.setQuery(andQuery).find().then(res => {
      console.log(res)
      if(res.data.meta.total_count===0){
        that.setData({
          focus_box:true
        })
      }else{
        that.setData({
          focus_box: false
        })
      }
    }, err => {
      // err
    })
    
  },
  focus_user:function(){   //关注作者
    var that = this
    var fans = this.data.fans
    let tableID = config.Focus_on_users.MERCHANTS
    let Product = new wx.BaaS.TableObject(tableID)
    let product = Product.create()
    // 设置方式一
    let apple = {
      focus_id: this.data.user_id
    }
    product.set(apple).save().then(res => {
      console.log(res)
      
      that.setData({
        focus_box:false,
        fans: fans-1+2
      })
    }, err => {
      //err 为 HError 对象
    })
  },
  fans:function(){    
    var that = this
    let tableID = config.Focus_on_users.MERCHANTS

    let query1 = new wx.BaaS.Query()

    query1.compare('focus_id', '=', this.data.user_id)

   
    // let andQuery = wx.BaaS.Query.and(query1, query2)

    let Product = new wx.BaaS.TableObject(tableID)
    Product.setQuery(query1).find().then(res => {
        that.setData({
          fans: res.data.meta.total_count
        })
     
    }, err => {
      // err
    })

    let query2 = new wx.BaaS.Query()
    // let user_id = app.getUserId();
    query2.compare('created_by', '=', parseInt(this.data.user_id))
    let Product2 = new wx.BaaS.TableObject(tableID)
    Product2.setQuery(query2).find().then(res => {
      that.setData({
        fllow_num: res.data.meta.total_count
      })

    }, err => {
      // err
    })



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
  onShareAppMessage: function () {
    var user_id = this.data.user_id
    var user_name = this.data.user_name
    var user_image = this.data.user_image

    var title = user_name +'专属图片墙'
    // var title = '这里的标题开发者可以随意改动，包括下面的图片，默认就是当前页面截图'
    var path = '/pages/img_person/img_person?' + 'user_id=' + user_id + '&user_name=' + user_name + '&user_image=' + user_image + '&user_image=' + user_image 
    return {
      title: title,
      path: path
    }

  }
})