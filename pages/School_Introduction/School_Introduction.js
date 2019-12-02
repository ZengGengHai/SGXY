// pages/School_Introduction/School_Introduction.js

import config from '../../config/config'
import constant from '../../config/constant'
import utils from '../../utils/utils'
import util from '../../utils/util'
const app = getApp();



var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置



Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    zghCustomBar: app.globalData.zghCustomBar,




    tabClick_one:true,
    tabClick_two: false, //记录是否点击第二次韶院报告
    tabClick_three:false,

    School_introduction:[],
    tabs: ['韶院视野', '原创壁纸', '投稿排行'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    news_limit: 6,
    news_offset: 0,
    NewsArray:[] ,//韶大报告
    next:true,
    scrollTop: 0,
    prompt:"滑动或者点击加载更多",
  



    images: [],
    scroll_H: 0,
    imgWidth: 0,
    oneimages: [],
    twoimages: [],
    oImageIndex: [],
    index: 0,
    tempindex: 0,
    image_limit: 7,
    image_offset: 0,
    twoImageH: 3,
    oneImageH: 0,
    image_next: true,
    one: false,
    two: false,
    loading:true,
    next_word: '滑动或者点击这里查看更多',
    mUrl: [], //图片缓存数组用到
    scroll_top:0,
    category: [ '韶院风景', '思维创意', '校园生活','校园美食','校园萌宠','毕业剪影','其它类别'],
    image_classify_list:[{
      name:"韶院风景",
      seen:'no',
      hover:false
    },{
        name:"思维创意",
      seen: 'no',
      hover: false
    },{
        name:'校园生活',
      seen: 'no',
      hover: false
    },{
        name:'校园美食',
      seen: 'no',
      hover: false
    },{
        name:'校园萌宠',
      seen: 'no',
      hover: false
     },{
        name: '毕业剪影',
      seen: 'no',
      hover: false
    },{
        name: '其它类别',
      seen: 'no',
      hover: false
    }],
    image_classify_open:false,






    S_images: [],
    S_scroll_H: 0,
    S_imgWidth: 0,
    S_oneimages: [],
    S_twoimages: [],
    S_oImageIndex: [],
    S_index: 0,
    S_tempindex: 0,
    S_image_limit: 5,
    S_image_offset: 0,
    S_twoImageH: 1,
    S_oneImageH: 0,
    S_image_next: true,
    S_one: false,
    S_two: false,
    S_loading: true,
    S_next_word: '滑动或者点击这里查看更多',
    S_mUrl: [], //图片缓存数组用到
    S_scroll_top: 0,
    S_category: ['原创壁纸'],
    S_image_classify_open: false,







    userList:[],  //图片墙作者排名
    user_limit:20,
    user_offset:0,
    user_next:'点击加载更多',


    imgloadnext:true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.BaaS.sendSmsCode({ phone: '15992245796' }).then(res => {
    //   // success
    //   console.log(res) // { "status": "ok" }
    // }).catch(e => {
    //   // err
    //   console.log(e.code) // 错误状态码
    // })

    var that = this;
      //导航栏部分
    wx.getSystemInfo({
      success: function (res) {
        console.log((res.windowWidth / that.data.tabs.length - sliderWidth) / 2, res.windowWidth / that.data.tabs.length * that.data.activeIndex)
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    this.requestData();
    
    this.S_requestData();
 

    //图片部分
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
   
    
  },



//导航栏点击事件
  tabClick: function (e) {
    console.log(e)
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      currentTab: e.currentTarget.id
    });
    var title = this.data.tabs[e.currentTarget.id]
    var tabClick_one = this.data.tabClick_one
    var tabClick_two = this.data.tabClick_two
    var tabClick_three = this.data.tabClick_three
    console.log(tabClick_one, tabClick_two, tabClick_three )

    wx.setNavigationBarTitle({
      title: title
    })
    if (e.currentTarget.id==0){
      if (!tabClick_one) {
         this.requestData();
        this.setData({
          tabClick_one: true
        })
         }
    } 
    if (e.currentTarget.id==1){
      if (!tabClick_two) {
        this.S_requestData();
        this.setData({
          tabClick_two: true
        })

         }     //点击一次就执行
    } 
    if (e.currentTarget.id == 2){
      if (!tabClick_three) { 
        this. focus_user_list();
        this.setData({
          tabClick_three:true
        })

      } 
    }
  },

  //底部滑动事件
  currentTab: function (e) {
    var that = this
    this.setData({
      activeIndex: e.detail.current,
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    console.log(e.detail.current)
    var title = this.data.tabs[e.detail.current]
    var tabClick_one=this.data.tabClick_one
    var tabClick_two = this.data.tabClick_two
    var tabClick_three = this.data.tabClick_three
    wx.setNavigationBarTitle({
      title: title
    })
    if (e.detail.current == 0) {
      if (!tabClick_one) { this.requestData();  }
    } 
     if (e.detail.current == 1) {
      if (!tabClick_two) {  }     //点击一次就执行
    } 
     if (e.detail.current == 2) {
      if (!tabClick_three) { this.focus_user_list(); } 
    }
  },

  focus_user_list: function () {   //作者排名
    var that = this

    var user_next=this.data.user_next
    if (user_next === "没有更多了"){
      return
    }
    // let user_id = wx.BaaS.storage.get('uid')
    var user_limit=this.data.user_limit
    var user_offset = this.data.user_offset
    let tableID = config.User.MERCHANTS
    var query = new wx.BaaS.Query()
    query.compare('image_number', '>', 0)
    let Product = new wx.BaaS.TableObject(tableID)
    Product.setQuery(query).limit(user_limit).offset(user_offset).expand('user_id').orderBy('-image_number').find().then(res => {
      // success
      let hide = utils.hideLoadingToast();
      console.log(res)
      var userList=that.data.userList
      var created_at
      var nickname
      var image_url
      var user_id
      var image_number
    
      for(var i=0;i<res.data.objects.length;i++){
        userList.push({
          created_at:res.data.objects[i].created_at,
          image_url:res.data.objects[i].user_id.avatar,
          nickname: res.data.objects[i].user_id.nickname,
          user_id:res.data.objects[i].user_id.id,
          image_number:res.data.objects[i].image_number
        })       
      }
      that.setData({
        userList,
        user_offset: user_offset + user_limit
      })

      if (res.data.meta.next === '' || res.data.meta.next ===null){
        var user_next="没有更多了"
        that.setData({
          user_next,
        })
      }
      

    }, err => {
      // err
    })


  },
  person_info: function (e) {

    console.log(e)
    var user_id = e.currentTarget.dataset.user_id
    var user_name = e.currentTarget.dataset.user_name
    var user_image = e.currentTarget.dataset.user_image

    var is_share = false


    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];   //上一个页面

    console.log(prevPage)

    if (!is_share) {


      console.log(prevPage)
      if (prevPage.route === 'pages/School_Introduction/School_Introduction' || prevPage.route === 'pages/my_release/my_release' || prevPage.route ==="pages/index/index") {
        wx.navigateTo({
          url: '../img_person/img_person?user_id=' + user_id + '&user_name=' + user_name + '&user_image=' + user_image,
        })
      } else {
        wx.navigateBack({
          delta: 1  // 返回上一级页面。
        })
      }
    } else {


      wx.navigateTo({
        url: '../img_person/img_person?user_id=' + user_id + '&user_name=' + user_name + '&user_image=' + user_image,
      })


    }


  },
  user_lower:function(e){
    this.focus_user_list();
  },




 


  //韶院图片墙部分
  requestData: function () {
    
   
    if (loading === false) {
      return
    }

    var loading=this.data.loading
    var next = this.data.image_next
    var that = this
    that.setData({
      loading:false
    })
   


    let tableID = config.IMAGE_ID.MERCHANTS
    var Product = new wx.BaaS.TableObject(tableID)
    var limit = this.data.image_limit
    var offset = this.data.image_offset
    var itemList = [];
    var mUrl = that.data.mUrl
    var category=this.data.category
    var Collection_quantity=0
    


    var query1 = new wx.BaaS.Query()
    query1.in('category', category)
    let query2 = new wx.BaaS.Query()
    query2.compare('examine', '=', 'true')
    let andQuery = wx.BaaS.Query.and(query1, query2)
    var loading=this.data.loading
    
   
      if (next) {

        Product.setQuery(andQuery).orderBy('-created_at').limit(limit).offset(offset).expand('created_by').find().then(res => {
          console.log(res,'jjkjkjkjkjkj')
          let timeoutId = utils.showLoadingToast('请耐心等待加载')
          if (res.data.meta.next == null) {
            // let hide = utils.hideLoadingToast()
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
          let longitude
          let latitude
          for (var i = 0; i < res.data.objects.length; i++) {
            longitude=res.data.objects[i].longitude||''
            latitude=res.data.objects[i].latitude||''
            console.log(longitude)
            console.log()
            if (res.data.objects[i].user_name==='全媒体中心'){
              var user_name=res.data.objects[i].user_name
              var user_image="https://cloud-minapp-13676.cloud.ifanrusercontent.com/1fnj61GhuZCVSpDa.jpg"
            }else{
              var user_name=res.data.objects[i].created_by.nickname
              var user_image=res.data.objects[i].created_by.avatar
            }
            if (res.data.objects[i].content===null){     
              content=""
            }else{
               content = res.data.objects[i].content
            }


            if (longitude === "" || longitude === undefined || longitude===null){     //判断图片是否有定位信息
              var imgshow = false
            }else{
              var imgshow = true
            }

            


            mUrl.push({
              ImageUrl: res.data.objects[i].ImageUrl, category: res.data.objects[i].category, user_name,user_image, id: res.data.objects[i].id, created_at: util.js_date_time(res.data.objects[i].created_at), created_by: res.data.objects[i].created_by.created_by, watermark: res.data.objects[i].watermark, content_num: res.data.objects[i].content_num, Collection_quantity: res.data.objects[i].Collection_quantity,content,longitude,latitude,imgshow})
            this.setData({
              mUrl: mUrl
            })
          }
          var MUrl = this.data.mUrl
          for (var i = 0; i < MUrl.length; i++) {
            itemList.push({ pic: MUrl[i].ImageUrl, height: 0, category: MUrl[i].category, user_name: MUrl[i].user_name, user_image: MUrl[i].user_image, user_id: MUrl[i].id, created_at: MUrl[i].created_at, created_by: MUrl[i].created_by, watermark: MUrl[i].watermark, img_width: 0, img_height: 0, content_num: MUrl[i].content_num, content: MUrl[i].content, Collection_quantity: MUrl[i].Collection_quantity, longitude: MUrl[i].longitude, latitude: MUrl[i].latitude, imgshow:MUrl[i].imgshow});
          }
          console.log(itemList)
          var offset = this.data.image_offset + this.data.image_limit
          that.setData({
            images: itemList,
            hidden: true,
            tempindex: mUrl.length,
            image_offset: offset
            
            
          });
          this.aaa(that);
        }, err => {
        })


      }
     

    


  },

  loadimg: function (e) {//图片加载完成执行


    var index = e.currentTarget.id;
    var oImageIndex = this.data.oImageIndex;
    var tempIndex = 0;
    // for (var i = 0; i < oImageIndex.length; i++) {
    //   if (oImageIndex[i] == index) {
    //     tempIndex = i;
    //     break;
    //   }
    // }
    console.log(e)
    var imgWidth = this.data.imgWidth;//图片设置的宽度
    var oImgW = e.detail.width;//图片原始宽度
    var scal = imgWidth / oImgW;//比例计算
    var oImgH = e.detail.height;//图片原始高度
    var _imgHeight = oImgH * scal;//自适应高度
    var images = this.data.images;
    images[index].height = _imgHeight;
    let watermark = images[index].watermark  //水印
    if (watermark ==='yes'){
       var size = 11/ (scal * 10)
      var left = Math.round(5 / scal)
      var bottom = Math.round(3 / scal)
      console.log(left)
      // images[index].url = images[index].pic + "!/watermark/size/" + size + "/margin/" + left + "x" + bottom + "/align/southeast/text/5YWo5aqS5L2T5Lit5b+D"
     if(e.detail.width>2000){

      images[index].url = images[index].pic + "!/watermark/align/southeast/margin/" + '5' + "x" + '3'+ '/percent/10' +'/url/MWZxWU5wV3Z5bFdaV3Z3Qi5wbmc=/fw/140'
     }else{
      images[index].url = images[index].pic + "!/watermark/align/southeast/margin/" + '5' + "x" + '3' + '/percent/10' + '/url/MWZxWU5wV3Z5bFdaV3Z3Qi5wbmc='
     }


      
    }else{
      // images[index].url = images[index].pic 
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
    var oneImageH = this.data.oneImageH;
    var twoImageH = this.data.twoImageH;
    if (oImageIndex.length == this.data.index) { //当加载完最后一张图片执行
      wx.getNetworkType({
        success(res) {
          const networkType = res.networkType
          console.log(networkType)
          // if (networkType !== 'wifi') {
          //   // var timeOut = setTimeout(function () {
          //   //   console.log("延迟调用============")
          //   //   let hide = utils.hideLoadingToast()
          //   // }, 2000)
          //   let hide = utils.hideLoadingToast()
          // } else {
          //   let hide = utils.hideLoadingToast()
          // }
          let hide = utils.hideLoadingToast()
        }
      })
      for (var i = this.data.index; i < images.length; i++) {
     
          if (oneImageH > twoImageH) {
            twoImageH += images[i].height;
            twoimages.push(images[i]);
            this.setData({
              twoimages: twoimages
            })

          } else {
            oneImageH += images[i].height;
            oneimages.push(images[i]);
            this.setData({
              oneimages: oneimages
            })
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
    }
    this.setData({
      oneImageH: oneImageH,
      twoImageH: twoImageH   
    })
    var image_offset = this.data.image_offset
    var image_limit = this.data.image_limit

    if (oImageIndex.length < image_offset - (image_limit-1)){
  
    this.setData({
      image_limit:3,
      loading:true
    })
    }

  },
  pp:function(res){
    console.log(res)

  },
  //点击图片刷新下一列
  next: function () {
   
    var loading = this.data.loading
    if (loading) {
      this.requestData()
    }

  },
  error:function(ev){
    console.log(ev,'lklklklklklk')
  
    var _that=this;
    util.errImgFun(ev, _that)

  },

  upload_image: function () { 
    wx.navigateTo({
      url: '../upload_image/upload_image',
    })  
  },
  Image_Classify:function(res){
    console.log(res)
    var category=res.currentTarget.dataset.category
    var seen = res.currentTarget.dataset.seen
    var hover=res.currentTarget.dataset.hover
    var image_classify_list = this.data.image_classify_list

    image_classify_list.forEach((elem, idx) => {

      if (elem.name === category){
        elem.hover=true
        this.image_classify(category)
      }else{
        elem.hover=false
      }

      
    })
    this.setData({
      image_classify_list:image_classify_list
    })
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
  image_lower:function(){
    var loading = this.data.loading
    if(loading){
     this.requestData()
    }
  },

  //分类事件
  image_classify: function (category){
    
    var category = category
    var that = this
    var Data_category = this.data.category

 
    if (Data_category !=category){
     
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

      this.setData({
        oneimages: [],
        twoimages: [],
        prompt: "滑动或者点击加载更多",
        category: [category],
        image_next: true,
        one: false,
        two: false,
        image_limit: 7,
        image_offset: 0,
        scroll_top: 0,
        index: 0,
        loading:true,
        images: [],
        // tempindex: 0,
        next_word: '滑动或者点击这里查看更多',
        mUrl: [], //图片缓存数组用到


      })
      this.requestData()

    }
   



  },
  image_classify_open:function(){
    var aa = this.data.image_classify_open
    var image_classify_open =!aa
    this.setData({
      image_classify_open,
    })
    console.log("fjd")

  },
  pp:function(res){
    console.log(res)
    
  },
  zghzgh:function(){
    // var oneimages = [];
    // var twoimages = [];
    // this.setData({
    //   oneimages: oneimages,
    //   twoimages: twoimages,
    //   prompt: "滑动或者点击加载更多",
    //   category: '韶院建筑',
    //   image_next: true,
    //   one: false,
    //   two: false,
    //   image_limit: 8,
    //   image_offset: 0,
    //   scroll_top: 0,

    // })
    // this.requestData()
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


    this.setData({
      oneimages: [],
      twoimages: [],
      prompt: "滑动或者点击加载更多",
      
      image_next: true,
      one: false,
      two: false,
      image_limit: 5,
      image_offset: 0,
      scroll_top: 0,
      index: 0,
      tempindex: 0,
      next_word: '滑动或者点击这里查看更多',
      mUrl: [], //图片缓存数组用到
      twoImageH: 2,
      oneImageH:0,


    })
    this.requestData()

  },


  //韶院壁纸部分
  S_requestData: function () {

    var next = this.data.S_image_next
    var that = this
    let tableID = config.IMAGE_ID.MERCHANTS
    var Product = new wx.BaaS.TableObject(tableID)
    var limit = this.data.S_image_limit
    var offset = this.data.S_image_offset
    var itemList = [];
    var mUrl = that.data.S_mUrl
    var category = this.data.S_category
    var Collection_quantity = 0



    var query1 = new wx.BaaS.Query()
    query1.in('category', category)
    let query2 = new wx.BaaS.Query()
    query2.compare('examine', '=', 'true')
    let andQuery = wx.BaaS.Query.and(query1, query2)
    var loading = this.data.S_loading

    if (loading) {   //没次加载完才触发
      if (next) {

        Product.setQuery(andQuery).orderBy('-created_at').limit(limit).offset(offset).expand('created_by').find().then(res => {
          console.log(res, 'fgfgffffffffffffffffffffffffffffffffff')
          let timeoutId = utils.showLoadingToast('请耐心等待加载')
          if (res.data.meta.next == null) {
            // let hide = utils.hideLoadingToast()
            this.setData({
              S_image_next: false,
              S_next_word: '- End -',
              S_one: true,
              S_two: false

            })
            console.log('空了')
          }
          let content_num
          let content
          let longitude
          let latitude
          for (var i = 0; i < res.data.objects.length; i++) {
            longitude = res.data.objects[i].longitude || ''
            latitude = res.data.objects[i].latitude || ''
           
           
            if (res.data.objects[i].user_name === '全媒体中心') {
              var user_name = res.data.objects[i].user_name
              var user_image = "https://cloud-minapp-13676.cloud.ifanrusercontent.com/1fnj61GhuZCVSpDa.jpg"
            } else {
              var user_name = res.data.objects[i].created_by.nickname
              var user_image = res.data.objects[i].created_by.avatar
            }

            mUrl.push({
              ImageUrl: res.data.objects[i].ImageUrl, category: res.data.objects[i].category, user_name, user_image, id: res.data.objects[i].id, created_at: util.js_date_time(res.data.objects[i].created_at), created_by: res.data.objects[i].created_by.created_by, watermark: res.data.objects[i].watermark, content_num: res.data.objects[i].content_num, Collection_quantity: res.data.objects[i].Collection_quantity, content: res.data.objects[i].content, longitude, latitude
            })
            this.setData({
               S_mUrl: mUrl
            })
          }
          var MUrl = this.data. S_mUrl
          for (var i = 0; i < MUrl.length; i++) {
            itemList.push({ pic: MUrl[i].ImageUrl, height: 0, category: MUrl[i].category, user_name: MUrl[i].user_name, user_image: MUrl[i].user_image, user_id: MUrl[i].id, created_at: MUrl[i].created_at, created_by: MUrl[i].created_by, watermark: MUrl[i].watermark, img_width: 0, img_height: 0, content_num: MUrl[i].content_num, content: MUrl[i].content, Collection_quantity: MUrl[i].Collection_quantity, longitude: MUrl[i].longitude, latitude: MUrl[i].latitude });
          }
          console.log(itemList)
          var offset = this.data. S_image_offset + 5
          that.setData({
             S_images: itemList,
             S_hidden: true,
             S_tempindex: mUrl.length,
             S_image_offset: offset,
             S_loading: false
          });
          this.S_aaa(that);
        }, err => {
        })


      }


    }


  },
  S_aaa: function (that) {
    var images = that.data.S_images;
    console.log(images);
    var oImageIndex = [];//把数组下标存入临时对象中
    for (var i = 0; i < images.length; i++) {
      oImageIndex.push(i);

    }

    that.setData({
      S_oImageIndex: oImageIndex
    })



  },
  S_loadimg: function (e) {//图片加载完成执行


    var index = e.currentTarget.id;
    var oImageIndex = this.data.S_oImageIndex;
    var tempIndex = 0;
    // for (var i = 0; i < oImageIndex.length; i++) {
    //   if (oImageIndex[i] == index) {
    //     tempIndex = i;
    //     break;
    //   }
    // }
    console.log(e)
    var imgWidth = this.data.imgWidth;//图片设置的宽度
    var oImgW = e.detail.width;//图片原始宽度
    var scal = imgWidth / oImgW;//比例计算
    var oImgH = e.detail.height;//图片原始高度
    var _imgHeight = oImgH * scal;//自适应高度
    var images = this.data.S_images;
    images[index].height = _imgHeight;
    let watermark = images[index].watermark  //水印
    if (watermark === 'yes') {
      var size = 11 / (scal * 10)
      var left = Math.round(5 / scal)
      var bottom = Math.round(3 / scal)
      console.log(left)
      // images[index].url = images[index].pic + "!/watermark/size/" + size + "/margin/" + left + "x" + bottom + "/align/southeast/text/5YWo5aqS5L2T5Lit5b+D"
      if (e.detail.width > 2000) {

        images[index].url = images[index].pic + "!/watermark/align/southeast/margin/" + '5' + "x" + '3' + '/percent/10' + '/url/MWZxWU5wV3Z5bFdaV3Z3Qi5wbmc=/fw/140'
      } else {
        images[index].url = images[index].pic + "!/watermark/align/southeast/margin/" + '5' + "x" + '3' + '/percent/10' + '/url/MWZxWU5wV3Z5bFdaV3Z3Qi5wbmc='
      }



    } else {
      // images[index].url = images[index].pic 
      images[index].url = images[index].pic
    }
    images[index].img_width = oImgW,
    images[index].img_height = oImgH


    oImageIndex.splice(tempIndex, 1);
    this.setData({
      S_oImageIndex: oImageIndex,
      S_images: images
    })

    var oneimages = this.data.S_oneimages;
    var twoimages = this.data.S_twoimages;
    var oneImageH = this.data.S_oneImageH;
    var twoImageH = this.data.S_twoImageH;
    if (oImageIndex.length == this.data.S_index) { //当加载完最后一张图片执行
      wx.getNetworkType({
        success(res) {
          const networkType = res.networkType
          console.log(networkType)
          // if (networkType !== 'wifi') {
          //   // var timeOut = setTimeout(function () {
          //   //   console.log("延迟调用============")
          //   //   let hide = utils.hideLoadingToast()
          //   // }, 2000)
          //   let hide = utils.hideLoadingToast()
          // } else {
          //   let hide = utils.hideLoadingToast()
          // }
        }
      })
      for (var i = this.data.S_index; i < images.length; i++) {

        if (oneImageH > twoImageH) {
          twoImageH += images[i].height;
          twoimages.push(images[i]);
          this.setData({
            S_twoimages: twoimages
          })

        } else {
          oneImageH += images[i].height;
          oneimages.push(images[i]);
          this.setData({
            S_oneimages: oneimages
          })
        }

      }
      if (oneImageH > twoImageH) {
        this.setData({
          S_one: false,
          S_two: true
        })
      } else {
        this.setData({
          S_one: true,
          S_two: false
        })

      }
      this.data.S_index = this.data.S_tempindex
    }
    this.setData({
      S_oneImageH: oneImageH,
      S_twoImageH: twoImageH
    })
    var image_offset = this.data.S_image_offset

    if (oImageIndex.length < image_offset - 4) {

      this.setData({
        S_loading: true
      })
    }

  },
  S_next:function(){
    
    this.S_requestData();

  },
  S_image_lower:function(){

    this.S_requestData();
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