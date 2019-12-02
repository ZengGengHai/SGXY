// pages/Picture_details/Picture_details.js

import config from '../../config/config'
import constant from '../../config/constant'
import utils from '../../utils/utils'
import util from '../../utils/util'

const app = getApp();



Page({
  /**
   * 页面的初始数据
   */
  data: {
    image:[],
    ccc:0,
    saveImgBtnHidden: false,
    imgList:[],
    user_image:'',
    img_height:'',
    img_width:'',
    content:'',
    content_num:'',
    shoucang:'未收藏',
    Collection_state:false,
    category:[],
    user_word_list:[],
    limit: 8,
    offset: 0,
    inputValue:'',
    id:'',
    userInfo:[] ,
    total_count:0,
    Load_complete:false,
    Tips: '点击加载用户评论',
    is_qmt:false,
    Collection_quantity:0,
    created_by:'',

    options:[],



    is_share:false,   //验证是否来自分享
    button_style:true,


    map:false,
    bottom_box:false,



    isMapShow: true,
    temporary_id:'',
    temporary_num: 0,
    temporary_replay_limit: 0,
    temporary_replay_offset: 0,
    temporary_replay_list: [],

    background:true,

    second_replay:false,
    second_author_id:'',
    second_author_name:''

   
    


    



  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    try {
      var Student_ID = wx.getStorageSync('Student_ID')
      var identity = wx.getStorageSync('identity')
      var userInfo = wx.getStorageSync('userInfo')
      console.log(userInfo, 'ghjgjhg')
      if (userInfo) {
        console.log(userInfo)
        that.setData({
          userInfo: userInfo
        })
      }
    } catch (e) {
    }
    console.log(options)

    var content = options.content
    var content_num = options.content_num
    var imgList = that.data.imgList
    var image = options.imageUrl
    var img_height = options.img_height
    var img_width = options.img_width
    var category = options.category
    var id=options.id
    var created_by=options.created_by
    var Collection_quantity = options.Collection_quantity
    var is_share = options.is_share||""
    var latitude =options.latitude||""
    var longitude = options.longitude||""

    if (latitude != "" && longitude!=""){
      that.setData({
        map:true
      })
    }
   


    if(options.content===' '||options.content===null||options.content===undefined){
    var content='哎！！！作者没有留下什么内容就发布了'
    }
    if (options.content_num ===''|| options.content_num === null || options.content_num === undefined) {
    var content_num=0
    }


    wx.getSystemInfo({
     
      success: function (res) {
        console.log(res) // 获取可使用窗口高度
        let windowWidth=res.windowWidth
        let windowHeight=res.windowHeight

        let now_img_height_rpx = img_height * windowWidth / img_width * (750 / res.windowWidth)
        let windowHeight_rpx = (res.windowHeight * (750 / res.windowWidth)); 
        //将高度乘以换算后的该设备的rpx与px的比例
        console.log(now_img_height_rpx, windowHeight_rpx * 0.28, windowHeight_rpx * 0.35)

        // console.log(windowHeight) //最后获得转化后得rpx单位的窗口高度

        if (now_img_height_rpx > windowHeight_rpx*0.34){
          that.setData({
            button_style:true,
          })
        }else{
          that.setData({
            button_style: false,
          })
        }
      }
    })

    imgList.push(image)
    console.log(imgList)
    if(options.user_name==='全媒体中心'){//头像用logo
      var user_image= "https://cloud-minapp-13676.cloud.ifanrusercontent.com/1fnj61GhuZCVSpDa.jpg"
      this.setData({
        user_image:"https://cloud-minapp-13676.cloud.ifanrusercontent.com/1fnj61GhuZCVSpDa.jpg",
        is_qmt:true
      })
    }else{     //头像具体到个人
      var user_image=options.user_image  
    }
    this.setData({
      user_image: user_image,
      img_height,
      img_width,
      content,
      content_num,
      category,
      id,
      created_by,
      Collection_quantity,
      is_share:is_share,
      options:options,
      longitude,
      latitude,
    })


  
    this.setData({
      image:[options],
      imgList,

    }) 

    this.findCollection(options.id);   //查找用户是否收藏过图片
    this.user_content(options.id);      //加载品论
    this.find_content_num(options.id);
  },

  findCollection:function(id){
    let tableID = config.SHOUCANG_IMAGE.MERCHANTS      //显示用户是否收藏过
    let user_id = wx.BaaS.storage.get('uid')
    let image_id =id
    let query1 = new wx.BaaS.Query()
    query1.compare('created_by', '=', parseInt(user_id))
    let query2 = new wx.BaaS.Query()
    query2.compare('image_id', '=', image_id)
    let andQuery = wx.BaaS.Query.and(query1, query2)
    var Product = new wx.BaaS.TableObject(tableID)
    let timeoutId = utils.showLoadingToast('加载中...')
    Product.setQuery(andQuery).find().then(res => {
      console.log(res.data.meta.total_count)
      let hide = utils.hideLoadingToast()
      if (res.data.meta.total_count < 1) {     //当前用户没有收藏这张图片
        console.log('没有收藏过')
        this.setData({
          shoucang: '未收藏',
          Collection_state: false,
        })
      }
      else {                                   //当前用户收藏过了这张图片 
        this.setData({
          shoucang: '已收藏',
          Collection_state: true,
        })
      }
    })
  },
  find_content_num:function(id){
    var that = this
    var limit = this.data.limit
    var offset = this.data.offset

    let tableId = config.LEAVING_MESSAGES.MERCHANTS

    let query = new wx.BaaS.Query()
    query.compare('come_id', '=', id)
   
    let query2 = new wx.BaaS.Query()
    query2.compare('type', '=', 'img')

    let andQuery = wx.BaaS.Query.and(query, query2)

    var Product = new wx.BaaS.TableObject(tableId)
    Product.setQuery(andQuery).limit(limit).offset(offset).expand('created_by').orderBy('-created_at').find().then(res => {
      // success
      console.log(res)
      var total_count=res.data.meta.total_count
      that.setData({
        total_count,
      })

   


    }, err => {
      // err
    })

  },


  bindKeyInput(e) {          //价盘输入
    this.setData({
      inputValue: e.detail.value
    })
    console.log(e.detail.value)
  },
  input: function (e) {    //先判断输入是否为空
    var inputValue = this.data.inputValue
    if (inputValue === "") {
      wx.showToast({
        title: '输入内容为空',
        icon: 'loading',
        duration: 2000
      })
    } else {
      // var pages = getCurrentPages();
      // var currPage = pages[pages.length];   //后页面
      // var prevPage = pages[pages.length - 2];   //上一个页面

      this.identity(e);//身份验证  
    }
  },

  identity: function (e) {           //进行身份验证函数
    // var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1];   //当前页面
    // var prevPage = pages[pages.length - 2];   //上一个页面

    var that = this
    try {
      var Student_ID = wx.getStorageSync('Student_ID')
      var identity = wx.getStorageSync('identity')
      var userInfo = wx.getStorageSync('userInfo')


      // if (Student_ID && identity === '解除绑定' && userInfo) {
      if (userInfo) {
        // Do something with return value
        console.log('解除绑定', Student_ID)
        var user_image = this.data.userInfo.avatar
        var user_name = this.data.userInfo.nickname


        this.input_content(e);  //验证成功就可以留言
        // console.log('dfjfjdfkjdfkjdfkjk')
      } else {

        wx.showModal({
          title: '你未授权信息或者身份验证',
          content: '如需跳转到个人主页进行验证，请点击确认进行跳转。',
          success: function (res) {
            if (res.cancel) {
              console.log('用户点击取消')

            } else if (res.confirm) {
              wx.navigateTo({

                url: '../person/person?open=' + 'image_fllow' + '&type=one',
              })

            }
          }
        })
      }
    } catch (e) {

    }

  },

  input_content: function (e) {        //数据插入操作
   var that=this
    let timeoutId = utils.showLoadingToast('加载中...')
    util.buttonClicked(this);
    var inputValue = this.data.inputValue
    var total_count = this.data.total_count
    let tableId = config.LEAVING_MESSAGES.MERCHANTS
    let Product = new wx.BaaS.TableObject(tableId)
    let product = Product.create()
    let input = {
      content: inputValue,
      come_id:this.data.id,
      type:'img'
    }
    product.set(input).save().then(res => {
      wx.showToast({
        title: '留言成功',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        bottom_box:false,
        background:true,
        inputValue:'',
        isMapShow:true
        

      })
     

      try {
        var Student_ID = wx.getStorageSync('Student_ID')
        var identity = wx.getStorageSync('identity')
        var userInfo = wx.getStorageSync('userInfo')
        console.log(userInfo, 'ghjgjhg')
        if (userInfo) {
          console.log(userInfo)
          this.setData({
            userInfo: userInfo
          })
        }
      } catch (e) {
      }


      let hide = utils.hideLoadingToast()
      this.pianyi(1);  //增加数据偏移量加一
      this.setData({
        inputValue: ''
      })
      console.log(res)
      let content_time
      let user_name
      let content_id
      let user_img
      let content
      let created_by
      var user_word_list = this.data.user_word_list
   
      try {
        var userInfo = wx.getStorageSync('userInfo')
      } catch (e) {

      }
      user_word_list.unshift({
        content: res.data.content,
        content_id: res.data.id,
        content_time: util.diaplayTime(res.data.created_at),
        user_name: userInfo.nickname,
        user_img: userInfo.avatar,
        created_by: res.data.created_by,
        is_me: true,
        num:0

      })
      this.setData({
        user_word_list,
        total_count: total_count+1
       
      })

    }, err => {
      //err 为 HError 对象
    })
  },

 
  pianyi: function (e) {            //offset偏移量
    if (e === 1) {
      var offset = this.data.offset -1+2

    } else if (e === 0) {
      var offset = this.data.offset - 1
    }
    this.setData({
      offset,
    })

  },
  totalCount:function(e){
    if (e === 1) {
      var total_count = this.data.total_count - 1 + 2

    } else if (e === 0) {
      var total_count = this.data.total_count - 1
    }
    this.setData({
      total_count,
    })
  },


  delete_content(e) {
    util.buttonClicked(this);  //删除数据防止按钮点击两次
    this.delete(e);
    this.pianyi(0);     //删除数据后偏移量减一
  },
  delete:function (e) {       //删除数据

    console.log(e)
    var num=e.currentTarget.dataset.num||0
    let timeoutId = utils.showLoadingToast('加载中...')

    let index = e.currentTarget.dataset.index
    var total_count = this.data.total_count
    const user_word_list = this.data.user_word_list

    let tableId = config.LEAVING_MESSAGES.MERCHANTS
    let recordID = e.currentTarget.dataset.id

    let Product = new wx.BaaS.TableObject(tableId)
    Product.delete(recordID).then(res => {
      // success
      wx.showToast({
        title: '删除成功',
        icon: 'none',
        duration: 2000
      })
      let hide = utils.hideLoadingToast()
      user_word_list.splice(index, 1)  //删除某一项
      this.setData({
        user_word_list,
        total_count: total_count - 1 - num
      })




    }, err => {
      // err
    })
  },




  Tip:function(){
    var ccc = this.data.ccc
    wx.showToast({
      title: '正在下载图片' + ccc+'%',
      icon: 'none',
      duration: 10000
    })
  },
  Down_Image:function(){
    var that=this
    
    wx.getSetting({
      success(res) {
        console.log(res)
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(res) {
              console.log(res)
              that.setData({
                saveImgBtnHidden: false,
              })
              that.DownLoad();
            },
            fail(res) {
              console.log('用户拒绝授权保存到相册')
              that.setData({
                saveImgBtnHidden: true,
              })
              wx.showToast({
                title: '请滑动到最底部重新授权',
                icon: 'none',
                duration: 3000
              })

            }

          })
        }else{
          that.DownLoad();
        }
      }
    })
  },
  // saveImgBtn:function(res){

  //   var that = this;
    
 

  // },
  shoucang:function(e){
    var that=this

    let id=this.data.id

    let tableID = config.SHOUCANG_IMAGE.MERCHANTS
    var Collection_quantity = this.data.Collection_quantity
    let user_id=wx.BaaS.storage.get('uid')
    let image_id = this.data.image[0].id
    let query1= new wx.BaaS.Query()
    query1.compare('created_by', '=', parseInt(user_id))
    let query2 = new wx.BaaS.Query()
    query2.compare('image_id', '=', image_id)
    let andQuery = wx.BaaS.Query.and(query1, query2)
    var Product = new wx.BaaS.TableObject(tableID)
    let timeoutId = utils.showLoadingToast('加载中...')
    Product.setQuery(andQuery).find().then(res => {
      console.log(res.data.meta.total_count)
      if (res.data.meta.total_count < 1) {     //当前用户没有收藏这张图片
        console.log('没有收藏过')
        let timeoutId = utils.showLoadingToast('加载中...')
        var Product = new wx.BaaS.TableObject(tableID)    //收藏此图片
        let product = Product.create()
        var image_id = this.data.image[0].id
        console.log(image_id)
        product.set('image_id', image_id)
        product.set('image_ID', image_id)
        product.set('focus_id', that.data.created_by)
        // product.set('image_ID',res)
        product.save().then(res => {   //收藏成功
        // success
          console.log(res)
          this.setData({
            shoucang: '已收藏',
            Collection_state: true,
            Collection_quantity: Collection_quantity-1+2
          })
          wx.showToast({
            title: '收藏成功',
            icon: 'none',
            duration: 3000
          })

          var pages = getCurrentPages();   //上个页面数据保持同步
          var currPage = pages[pages.length - 1];   //当前页面
          var prevPage = pages[pages.length - 2];   //上一个页面


          var oneimages = prevPage.data.oneimages
          var twoimages =prevPage.data.twoimages
          console.log(id)

          oneimages.forEach((elem, idx) => {
            if (elem.user_id === id) {
              elem.Collection_quantity =Collection_quantity-1+2         
            } 
          }) 
          twoimages.forEach((elem, idx) => {
            if (elem.user_id === id) {
              elem.Collection_quantity =Collection_quantity-1+2
            }
          })  
          prevPage.setData({
            oneimages,
            twoimages,
          })



         }, err => {
       // HError 对象
         })



      }
      else {                                   //当前用户收藏过了这张图片
      console.log(res)
        let timeoutId = utils.showLoadingToast('加载中...')
        let recordID =res.data.objects[0]._id       //用户进行取消收藏操作
        let Product = new wx.BaaS.TableObject(tableID)
        Product.delete(recordID).then(res => {
          // success                                 //取消收藏成功

          this.setData({
            shoucang: '未收藏',
            Collection_state: false,
            Collection_quantity: Collection_quantity-1
          })
          wx.showToast({
            title: '取消成功',
            icon: 'none',
            duration: 3000
          })
          
          var pages = getCurrentPages();                 //上个页面数据保持同步
          var currPage = pages[pages.length - 1];   //当前页面
          var prevPage = pages[pages.length - 2];   //上一个页面


          var oneimages = prevPage.data.oneimages
          var twoimages = prevPage.data.twoimages
          console.log(id)

          oneimages.forEach((elem, idx) => {
            if (elem.user_id === id) {
              elem.Collection_quantity = Collection_quantity - 1
            }
          })
          twoimages.forEach((elem, idx) => {
            if (elem.user_id === id) {
              elem.Collection_quantity = Collection_quantity - 1
            }
          })
          prevPage.setData({
            oneimages,
            twoimages,
          })
        }, err => {
          // err
        })


      
        console.log('收藏过了')
     
      }
    })




    // console.log('djfkdfjdkj')
   





  },
  // Collection_quantity_up:function(){           //收藏数量加一
    
  //   let tableID = config.IMAGE_ID.MERCHANTS
  //   let recordID = this.data.image[0].id // 数据行 id

  //   let Product = new wx.BaaS.TableObject(tableID)
  //   let product = Product.getWithoutData(recordID)

  //   product.set('Collection_quantity', Collection_quantity+1)
  //   product.update().then(res => {
  //     // success
  //   }, err => {
  //     // err
  //   })

  // },
  Collection_quantity_down: function () {      //收藏数量减一

  },


  previewImage: function (e) {    //预览图片
  console.log(e)
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgList // 需要预览的图片http链接列表  
    })
  }, 

  DownLoad:function(){   //下载图片
   var that=this
    this.Tip()
    var image_url = this.data.image[0].imageUrl
    const downloadTask = wx.downloadFile({
      url: image_url,
      success: function (res) {
        console.log(res)
        
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success:function(result) {
            console.log(result)
          }
        })
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function (res) {
            console.log(res.savedFilePath)
          }
      
        })

      }
    })

     downloadTask.onProgressUpdate((res) => {
     
      console.log('下载进度', res.progress)
      this.setData({
        ccc: res.progress
      })
      if (res.progress%5===0){
        this.Tip();
      }
      
      if (res.progress===100){
        let hide = utils.hideLoadingToast()
        that.user_download_num_up();

   

      }
      console.log('已经下载的数据长度', res.totalBytesWritten)
      console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
    })
  },
  user_download_num_up:function(){
    var created_by = this.data.created_by
    var tableID = config.User.MERCHANTS
    let query = new wx.BaaS.Query()

    query.compare('user_id', '=', created_by)

    // 应用查询对象
    let Product = new wx.BaaS.TableObject(tableID)
    Product.setQuery(query).find().then(res => {

      if (res.data.objects!= null && res.data.objects != '' && res.data.objects!=undefined){
        console.log(res.data.objects[0].id, res.data.objects[0].down_num)
        let recordID = res.data.objects[0].id // 数据行 id

        let Product = new wx.BaaS.TableObject(tableID)
        let product = Product.getWithoutData(recordID)

        product.set('down_num', res.data.objects[0].down_num -1+2 )
        product.update().then(res => {
          console.log(res)
          var pages = getCurrentPages();
          var currPage = pages[pages.length];   //后页面
          var prevPage = pages[pages.length - 2];   //上一个页面

          
          if (prevPage.route === "pages/img_person/img_person"){
            var down_num = prevPage.data.down_num-1+2
            
            prevPage.setData({
              down_num,
            })

          }




        }, err => {
          // err
        })
      }
    
      
    }, err => {
      // err
  
    })

  },
  
  navigateTo_index: function () {
    
    let timeoutId = utils.showLoadingToast('加载中...')
    wx.reLaunch({
      url: '../index/index'
    })

  },

  closePopup: function (e) {
    this.setData({
      bottom_box:false,
      background:true,
      inputValue: '',
      isMapShow:true,
      temporary_id: '',
      temporary_num: 0,
      temporary_replay_limit: 0,
      temporary_replay_offset: 0,
      temporary_replay_list: []
    })
  },

  person_info:function(e){


    console.log(e)
    var user_id=e.currentTarget.dataset.user_id
    var user_name=e.currentTarget.dataset.user_name
    var user_image=e.currentTarget.dataset.user_image

    var is_share=this.data.is_share


    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];   //上一个页面

    console.log(prevPage)

   if(!is_share){
    
    
     console.log(prevPage)
     if (prevPage.route === 'pages/School_Introduction/School_Introduction') {
       wx.navigateTo({
         url: '../img_person/img_person?user_id=' + user_id + '&user_name=' + user_name + '&user_image=' + user_image,
       })
     } else {
       wx.navigateBack({
         delta: 1  // 返回上一级页面。
       })
     }
   }else{
     
  
       wx.navigateTo({
         url: '../img_person/img_person?user_id=' + user_id + '&user_name=' + user_name + '&user_image=' + user_image,
       })


   }
  

  },


  follow_word:function(){
    // wx.navigateTo({
    //   url: '../write/write',
    // })
    this.setData({
      bottom_box:true,
      isMapShow:true,
      background:false,
    })

  },
  map:function(){
    // let timeoutId = utils.showLoadingToast('加载中')
    // var that=this
    // wx.getLocation({
    //   type: 'gcj02',
    //   success: function (res) {
    //     console.log(res)
    //     if (res.errMsg ==='getLocation:ok'){ 
    //       var latitude = res.latitude
    //       var longitude = res.longitude   
    //       var img_longitude = that.data.longitude
    //       var img_latitude = that.data.latitude
    //       var destination = img_longitude + ',' + img_latitude
    //       var origin = longitude + ',' + latitude
    //       wx.navigateTo({
    //         url: '../goToMap/goToMap?destination=' + destination + '&origin=' + origin + '&num=1' +'&come_from_img='+true,
    //       })
    //     }

    //   }
    // })




    let timeoutId = utils.showLoadingToast('加载中...')
    var that = this

   




    var img_longitude = that.data.longitude
    var img_latitude = that.data.latitude


    let api, start, end

    end = this.assembleLocation(1, img_longitude, img_latitude)

    var destination = utils.assembleLocation(0, img_longitude, img_latitude)

 
  

    // 获取用户当前位置，调用腾讯计算位置api获取距离信息
    wx.getLocation({
      type: 'gcj02',
      complete: (res) => {
        if (res.errMsg === 'getLocation:ok') {
          var start = utils.assembleLocation(1, res.longitude, res.latitude)
          var origin = utils.assembleLocation(0, res.longitude, res.latitude)
 

          api = `${config.API.CALCULATE_DISTANCE}?mode=walking&from=${start}&to=${end}&key=${config.QQ_LBS.WEB_API}`

          wx.request({
            url: api,
            complete: (res) => {
              let hide = utils.hideLoadingToast()
              console.log(res, "腾讯地图api")
              if (res.statusCode == constant.STATUS_CODE.SUCCESS) {
                //距离api还可以识别的时候
                if (res.data.message === "query ok") {
                 var distance = res.data.result.elements[0].distance
               //判断距离
                  if (distance <= constant.MIN_DISTANCE.Distance && res.data.message != "起终点距离超长") {             //自定义可以访问的最小距离，如果太远就导航不了
                    // console.log(distance, '测试距离')
                    wx.navigateTo({
                      url: `../goToMap/goToMap?origin=${origin}&destination=${destination}&num=1&come_from_img=true`
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
      success: function (res) {

        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          let hide = utils.hideLoadingToast()
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
            success: function (res) {
              if (res.cancel) {
                console.info("授权失败返回数据");

              } else if (res.confirm) {
             
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
                            var start = utils.assembleLocation(1, res.longitude, res.latitude)
                            var origin = utils.assembleLocation(0, res.longitude, res.latitude)


                            api = `${config.API.CALCULATE_DISTANCE}?mode=walking&from=${start}&to=${end}&key=${config.QQ_LBS.WEB_API}`

                            wx.request({
                              url: api,
                              complete: (res) => {
                                let hide = utils.hideLoadingToast()
                                console.log(res, "腾讯地图api")
                                if (res.statusCode == constant.STATUS_CODE.SUCCESS) {
                                  //距离api还可以识别的时候
                                  if (res.data.message === "query ok") {
                                    var distance = res.data.result.elements[0].distance
                                    //判断距离
                                    if (distance <= constant.MIN_DISTANCE.Distance && res.data.message != "起终点距离超长") {             //自定义可以访问的最小距离，如果太远就导航不了
                                      // console.log(distance, '测试距离')
                                      wx.navigateTo({
                                        url: `../goToMap/goToMap?origin=${origin}&destination=${destination}&num=1&come_from_img=true`
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
      fail: function (res) { },
      complete: function (res) { },
    })









  },





  assembleLocation(type, longitude, latitude) {
    if (type == 0) return longitude + ',' + latitude
    return latitude + ',' + longitude
  },



  user_content: function (come_id) {                  //加载用户评论
    var that = this
    var limit = this.data.limit
    var offset = this.data.offset
  
    let tableId = config.LEAVING_MESSAGES.MERCHANTS
   
    
    let query = new wx.BaaS.Query()
    console.log(come_id)
    query.compare('come_id', '=', come_id)
    let query1 = new wx.BaaS.Query()
    var a = false
    query1.compare('replay', '=', a)
    let query2 = new wx.BaaS.Query()
    
    query2.compare('type', '=', 'img')

    let andQuery = wx.BaaS.Query.and(query1, query, query2)

    var Product = new wx.BaaS.TableObject(tableId)
    Product.setQuery(andQuery).limit(limit).offset(offset).expand('created_by').orderBy('-created_at').find().then(res => {
      // success
      console.log(res)
     
      if (!res.data.meta.next) {
        console.log('fdf')
        this.setData({
          Tips: '没有更多评论了',
          Load_complete: true

        })
      }
      var user_word_list = this.data.user_word_list
      let content_time
      let user_name
      let content_id
      let user_img
      let content
      let created_by
      let user_id = app.getUserId();
      console.log(user_id)

      for (let i = 0; i < res.data.objects.length; i++) {

        // var Replay_list = []

        if (user_id === res.data.objects[i].created_by.id) {
          var is_me = true
        }
        else {
          var is_me = false
        }

        user_word_list.push({
          content: res.data.objects[i].content,
          content_id: res.data.objects[i].id,
          content_time: util.diaplayTime(res.data.objects[i].created_at),
          user_name: res.data.objects[i].created_by.nickname,
          user_img: res.data.objects[i].created_by.avatar,
          created_by: res.data.objects[i].created_by.id,
          is_me: is_me,
          Replay_list: [],
          num: 0,
          replay_next: false,
          show_box: false,
          replay_limit: 0,
          replay_offset: 0,
        })
        console.log(user_word_list)
      }
      console.log(user_word_list)
      this.setData({
        user_word_list,
        offset: offset + 8,
        
      })
      for (let i = 0; i < res.data.objects.length; i++) {
        console.log(user_word_list)
        var temporary_list = []
        this.Replay(res.data.objects[i].id, (e) => {
          temporary_list.push({
            Replay_list: e.replay,
            num: e.num,
            replay_next: e.replay_next,
            show_box: e.show_box,
            replay_limit: 3,
            replay_offset: 3,
          })
          console.log(e, temporary_list)
          var user_word_list = this.data.user_word_list
          console.log(user_word_list)
          user_word_list.forEach((elem, idx) => {
            if (elem.content_id === e.id) {
              elem.Replay_list = e.replay,
                elem.num = e.num,
                elem.replay_next = e.replay_next,
                elem.show_box = e.show_box,
                elem.replay_limit = 3,
                elem.replay_offset = 3
            }
          })
          that.setData({
            user_word_list,
          })
        })



      }


    }, err => {
      // err
    })
  },
  Replay: (e, cb) => {

    var replay = []
    let tableId = config.LEAVING_MESSAGES.MERCHANTS
    var Product = new wx.BaaS.TableObject(tableId)
    let query = new wx.BaaS.Query()
    query.compare('replay_id', '=', e)
    let query1 = new wx.BaaS.Query()
    var a = true
    query1.compare('replay', '=', a)
    let andQuery = wx.BaaS.Query.and(query1, query)
    Product.setQuery(andQuery).limit(3).offset(0).expand(['created_by','replay_second_id']).orderBy('-created_at').find().then(res => {
      // success
      var num = res.data.meta.total_count
      if (!res.data.meta.next && typeof (res.data.meta.next) != "undefined" && res.data.meta.next != "") {
        var replay_next = false
      } else {
        var replay_next = true
      }
      let content_time
      let user_name
      let content_id
      let user_img
      let content
      let created_by
      var show_box = false
      var replay_id
      let user_id = app.getUserId();
      for (let i = 0; i < res.data.objects.length; i++) {
        if (user_id === res.data.objects[i].created_by.id) {
          var is_me = true
        }
        else {
          var is_me = false
        }
        console.log(res.data.objects.length)
        if (res.data.objects.length >= 0) {
          show_box = true
        }
        // var show_second_box
        var replay_second_id = res.data.objects[i].replay_second_id||''
        if (replay_second_id != '' &&replay_second_id != undefined && replay_second_id !=null){
        console.log(replay_second_id)
          var show_second_box=true
          var name = replay_second_id.nickname
        }else{
         console.log('没有评论中的评论');
          var show_second_box = false
          var name=''
        }

        replay.push({
          content: res.data.objects[i].content,
          content_id: res.data.objects[i].id,
          content_time: util.diaplayTime(res.data.objects[i].created_at),
          user_name: res.data.objects[i].created_by.nickname,
          user_img: res.data.objects[i].created_by.avatar,
          created_by: res.data.objects[i].created_by.id,
          is_me: is_me,
          replay_id: res.data.objects[i].replay_id,
          show_second_box,
          name,
        })
      }
      var id
      var list
      var List = { "id": e, "replay_next": replay_next, "replay": replay, "num": num, "show_box": show_box }
      cb(List);

    }, err => {
    })
  },
  replay_more: function (e) {
    console.log(e)

    var replay_limit = e.target.dataset.replay_limit;
    var replay_offset = e.target.dataset.replay_offset;
    var replay_next = e.target.dataset.replay_next;
    var content_id = e.target.dataset.content_id;
    var Replay_list = e.target.dataset.replay_list;
    console.log(replay_limit, replay_next, content_id, replay_offset, Replay_list)


    this.Replay_more({ replay_limit, replay_next, content_id, replay_offset, Replay_list }, (e) => {

      console.log(e)
      var user_word_list = this.data.user_word_list
      console.log(user_word_list)
      user_word_list.forEach((elem, idx) => {
        if (elem.content_id === content_id) {
          elem.Replay_list = e.replay,
          elem.replay_next = e.replay_next,
            elem.replay_offset = replay_offset+3
        }
      })
      this.setData({
        user_word_list,
      })
      //  NewsArray.forEach((elem, idx) => {
      //    if (elem.new_id == id) {
      //      elem.new_open = open
      //      if (!elem.new_seen) {   //看过的新闻假数据加一，但不渲染出来，下次别人点击才真数据，所以后台数据还是要改动
      //        elem.new_counter = elem.new_counter + 1  //点击数假装加一

      //        let tableID = config.SCHOOL_NEWS.MERCHANTS  //点击数真实后台加一
      //        let recordID = elem.new_id
      //        let Product = new wx.BaaS.TableObject(tableID)
      //        let product = Product.getWithoutData(recordID)
      //        var newNumber = elem.new_counter
      //        product.set('counter', newNumber)
      //        product.update().then(res => {
      //          console.log("后台数据更新成功")
      //        }, err => {

      //        })

      //      }
      //      elem.new_seen = true

      //    }
      //  })

    })



  },

  Replay_more: (e, cb) => {
    console.log(e)
    var replay = e.Replay_list
    let tableId = config.LEAVING_MESSAGES.MERCHANTS
    var Product = new wx.BaaS.TableObject(tableId)
    let query = new wx.BaaS.Query()
    query.compare('replay_id', '=', e.content_id)
    let query1 = new wx.BaaS.Query()
    var a = true
    query1.compare('replay', '=', a)
    let query2 = new wx.BaaS.Query()

    query2.compare('type', '=', 'img')
    let andQuery = wx.BaaS.Query.and(query1, query,query2)
    Product.setQuery(andQuery).limit(e.replay_limit).offset(e.replay_offset).expand('created_by').orderBy('-created_at').find().then(res => {
      // success
      var num = res.data.meta.total_count
      if (!res.data.meta.next && typeof (res.data.meta.next) != "undefined" && res.data.meta.next != "") {
        var replay_next = false
      } else {
        var replay_next = true
      }
      let content_time
      let user_name
      let content_id
      let user_img
      let content
      let created_by
      var show_box = false
      var replay_id
      let user_id = app.getUserId();
      for (let i = 0; i < res.data.objects.length; i++) {
        if (user_id === res.data.objects[i].created_by.id) {
          var is_me = true
        }
        else {
          var is_me = false
        }
        console.log(res.data.objects.length)
        if (res.data.objects.length >= 0) {
          show_box = true
        }
        replay.push({
          content: res.data.objects[i].content,
          content_id: res.data.objects[i].id,
          content_time: util.diaplayTime(res.data.objects[i].created_at),
          user_name: res.data.objects[i].created_by.nickname,
          user_img: res.data.objects[i].created_by.avatar,
          created_by: res.data.objects[i].created_by.id,
          is_me: is_me,
          replay_id: res.data.objects[i].replay_id
        })
      }
      var List = { replay_next: replay_next, replay: replay, num: num, show_box: show_box }
      cb(List);
    }, err => {
      // err
    })
  },
  delete_replay: function (e) {
    util.buttonClicked(this);  //删除数据防止按钮点击两次
    this.delete_my_replay(e);
    // this.pianyi(0);     //删除数据后偏移量减一
  },
  delete_my_replay: function (e) {       //删除数据

    // let timeoutId = utils.showLoadingToast('加载中...')

    // let index = e.currentTarget.dataset.index
    // const user_word_list = this.data.user_word_list

    // let tableId = config.LEAVING_MESSAGES.MERCHANTS
    // let recordID = e.currentTarget.dataset.id

    // let Product = new wx.BaaS.TableObject(tableId)
    // Product.delete(recordID).then(res => {
    //   // success
    //   let hide = utils.hideLoadingToast()
    //   user_word_list.splice(index, 1)  //删除某一项
    //   this.setData({
    //     user_word_list
    //   })
    // }, err => {
    //   // err
    // })
    console.log(e, 'gg')
    var that = this
    var id = e.target.dataset.id  //留言id
    var replay_id = e.target.dataset.replay_id   //评论id
    let timeoutId = utils.showLoadingToast('加载中...')
    let index = e.currentTarget.dataset.index



    let tableId = config.LEAVING_MESSAGES.MERCHANTS
    let recordID = e.currentTarget.dataset.id

    let Product = new wx.BaaS.TableObject(tableId)
    Product.delete(id).then(res => {
      that.totalCount(0);   //评论数减去一
      // success
      let hide = utils.hideLoadingToast()
      // let user_id = app.getUserId();

      const user_word_list = this.data.user_word_list
      user_word_list.forEach((elem, idx) => {
        if (elem.content_id === replay_id) {
          console.log('此时')
          console.log(elem.Replay_list)
        
          elem.Replay_list.splice(index, 1)
          console.log(elem.Replay_list, index)
          if (elem.num - 1 === 0) {
            elem.show_box = false
          }
          elem.replay_offset = elem.replay_offset - 1;
          elem.num = elem.num - 1;
          // elem.replay_next = e.replay_next
        }
      })
      that.setData({
        user_word_list,
      })



    }, err => {
      // err
    })


  },

  getid: function (e) {
    console.log(e)
    var temporary_id = e.target.dataset.id
    var temporary_num = e.target.dataset.num
    var temporary_replay_limit = e.target.dataset.replay_limit
    var temporary_replay_offset = e.target.dataset.replay_offset
    var temporary_replay_list = e.target.dataset.replay_list

    let user_id = wx.BaaS.storage.get('uid')
    console.log(user_id, e.target.dataset.created_by)
    if (e.target.dataset.created_by == user_id) {
      console.log('本人')
      return;
    }


    this.setData({
      temporary_id,
      background:false,
      isMapShow: false,
      temporary_id,
      temporary_num,
      temporary_replay_limit,
      temporary_replay_offset,
      temporary_replay_list,
      bottom_box:true,
      second_replay:false
    })
  },
  input_Leaving_word: function (e) {    //先判断输入留言是否为空
    var inputValue = this.data.inputValue
    if (inputValue === "") {
      wx.showToast({
        title: '输入内容为空',
        icon: 'loading',
        duration: 2000
      })
    } else {
      this.identity_two(e);//身份验证  
    }
  },
  identity_two: function (e) {           //进行身份验证函数

    var that = this
    try {
      var Student_ID = wx.getStorageSync('Student_ID')
      var identity = wx.getStorageSync('identity')
      var userInfo = wx.getStorageSync('userInfo')


      if (userInfo) {
        // Do something with return value
        console.log('解除绑定', Student_ID)
        var user_image = userInfo.avatar
        var user_name = userInfo.nickname


        that.input_Leaving_word_content(e);  //验证成功就可以留言
      } else {

        wx.showModal({
          title: '你未授权信息或者身份验证',
          content: '如需跳转到个人主页进行验证，请点击确认进行跳转。',
          success: function (res) {
            if (res.cancel) {
              console.log('用户点击取消')

            } else if (res.confirm) {
              wx.navigateTo({

                url: '../person/person?open=' + 'image_fllow' + '&type=one',
              })

            }
          }
        })
      }
    } catch (e) {

    }

  },
  input_Leaving_word_content: function (e) {        //数据插入操作
    var that = this
    let timeoutId = utils.showLoadingToast('加载中...')
    util.buttonClicked(this);
    var inputValue = this.data.inputValue
    let tableId = config.LEAVING_MESSAGES.MERCHANTS
    let Product = new wx.BaaS.TableObject(tableId)
    let product = Product.create()
    let input = {
      content: inputValue,
      type: 'img',
      replay: true,
      replay_id: that.data.temporary_id,
      come_id:that.data.id,

    }
    product.set(input).save().then(res => {
      let hide = utils.hideLoadingToast()
      // this.pianyi(1);  //增加数据偏移量加一
      that.totalCount(1);   //评论数加一
      
      this.setData({
        inputValue: '',
        isMapShow: true,
      })
      console.log(res, '留言插入成功')



      let content_time
      let user_name
      let content_id
      let user_img
      let content
      let created_by
      try {
        var userInfo = wx.getStorageSync('userInfo')
      } catch (e) {

      }
      var replay_id
      var temporary_replay_list = this.data.temporary_replay_list
      console.log(temporary_replay_list)

      temporary_replay_list.unshift({
        content: res.data.content,
        content_id: res.data.id,
        content_time: util.diaplayTime(res.data.created_at),
        user_name: userInfo.nickname,
        user_img: userInfo.avatar,
        created_by: res.data.created_by,
        is_me: true,
        replay_id: res.data.replay_id,
        show_second_box:false

      })
      console.log(temporary_replay_list)
      var user_word_list = that.data.user_word_list
      var temporary_id = that.data.temporary_id
      var temporary_replay_offset = this.data.temporary_replay_offset - 1 + 2;
      var temporary_num = this.data.temporary_num - 1 + 2;

      user_word_list.forEach((elem, idx) => {
        if (elem.content_id === temporary_id) {
          elem.Replay_list = temporary_replay_list
          elem.replay_offset = temporary_replay_offset
          elem.num = temporary_num
          elem.show_box = true
          // elem.replay_next = e.replay_next
        }
      })
      that.setData({
        user_word_list,
        bottom_box:false,
        background:true
      })
      // this.setData({
      //   user_word_list
      // })

    }, err => {
      //err 为 HError 对象
    })
  },




  onTap: function (e) {

    console.log(e)
    var temporary_id = e.currentTarget.dataset.id
    var temporary_num = e.currentTarget.dataset.num
    var temporary_replay_limit = e.currentTarget.dataset.replay_limit
    var temporary_replay_offset = e.currentTarget.dataset.replay_offset
    var temporary_replay_list = e.currentTarget.dataset.replay_list


    this.setData({
      temporary_id,
      temporary_num,
      temporary_replay_limit,
      temporary_replay_offset,
      temporary_replay_list,
    })
 
  },
  replay_second:function(e){
    console.log(e,'fsdjfk')
    var created_by=e.target.dataset.created_by
    var user_name = e.target.dataset.user_name

    let user_id = wx.BaaS.storage.get('uid')
    console.log(user_id, e.target.dataset.created_by)
    if (created_by == user_id) {
      console.log('本人')
      return;
    }


    this.setData({
      isMapShow: false,
      background: false,
      bottom_box: true,
      second_replay:true,
      second_author_id:created_by,
      second_author_name: user_name,
      



      
    })

  },

  second_input_Leaving_word: function (e) {    //先判断输入留言是否为空
    var inputValue = this.data.inputValue
    if (inputValue === "") {
      wx.showToast({
        title: '输入内容为空',
        icon: 'loading',
        duration: 2000
      })
    } else {
      this.identity_three(e);//身份验证  
    }
  },
  

  identity_three: function (e) {           //进行身份验证函数

    var that = this
    try {
      var Student_ID = wx.getStorageSync('Student_ID')
      var identity = wx.getStorageSync('identity')
      var userInfo = wx.getStorageSync('userInfo')


      if (userInfo) {
        // Do something with return value
        console.log('解除绑定', Student_ID)
        var user_image = userInfo.avatar
        var user_name = userInfo.nickname


        that.input_Leaving_word_content_second(e);  //验证成功就可以留言
      } else {

        wx.showModal({
          title: '你未授权信息或者身份验证',
          content: '如需跳转到个人主页进行验证，请点击确认进行跳转。',
          success: function (res) {
            if (res.cancel) {
              console.log('用户点击取消')

            } else if (res.confirm) {
              wx.navigateTo({

                url: '../person/person?open=' + 'image_fllow'+'&type=one',
              })

            }
          }
        })
      }
    } catch (e) {

    }

  },

  input_Leaving_word_content_second: function (e) {        //数据插入操作
    
    var that = this
    let timeoutId = utils.showLoadingToast('加载中...')
    util.buttonClicked(this);
    var inputValue = this.data.inputValue

    
    let tableId = config.LEAVING_MESSAGES.MERCHANTS
    let user = new wx.BaaS.User().getWithoutData(this.data.second_author_id)
    let Product = new wx.BaaS.TableObject(tableId)
    let product = Product.create()
    let input = {
      content: inputValue,
      type: 'img',
      replay: true,
      replay_id: that.data.temporary_id,
      replay_second_id:user,
      come_id: that.data.id,
    }
    product.set(input).save().then(res => {
      let hide = utils.hideLoadingToast()
      // this.pianyi(1);  //增加数据偏移量加一
      that.totalCount(1);   //评论数加一

      console.log(res, '留言插入成功')


      let content_time
      let user_name
      let content_id
      let user_img
      let content
      let created_by
      try {
        var userInfo = wx.getStorageSync('userInfo')
      } catch (e) {
      }
      var replay_id
      var temporary_replay_list = this.data.temporary_replay_list
      var name = this.data.second_author_name
      var show_second_box=true
      console.log(temporary_replay_list)

      temporary_replay_list.unshift({
        content: res.data.content,
        content_id: res.data.id,
        content_time: util.diaplayTime(res.data.created_at),
        user_name: userInfo.nickname,
        user_img: userInfo.avatar,
        created_by: res.data.created_by,
        is_me: true,
        replay_id: res.data.replay_id,
        name,
        show_second_box,
      })
      console.log(temporary_replay_list)
      var user_word_list = that.data.user_word_list
      var temporary_id = that.data.temporary_id
      var temporary_replay_offset = this.data.temporary_replay_offset - 1 + 2;
      var temporary_num = this.data.temporary_num - 1 + 2;

      user_word_list.forEach((elem, idx) => {
        if (elem.content_id === temporary_id) {
          elem.Replay_list = temporary_replay_list
          elem.replay_offset = temporary_replay_offset
          elem.num = temporary_num
          elem.show_box = true
          // elem.replay_next = e.replay_next
        }
      })
      that.setData({
        user_word_list,
        bottom_box: false,
        background: true,
        inputValue: '',
        isMapShow:false,
      })
      // this.setData({
      //   user_word_list
      // })

    }, err => {
      //err 为 HError 对象
     
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
  onShareAppMessage: function (res) {
    console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
      var image=this.data.image
      var created_at=image[0].created_at
      var imageUrl = image[0].imageUrl
      var user_image = image[0].user_image
      var user_name=image[0].user_name
      var content = this.data.content
      var content_num = this.data.content_num
      var img_height = this.data.img_height
      var img_width =this.data.img_width 
      var id = this.data.id
      var created_by = this.data.created_by
      var category = this.data.category
      var Collection_quantity = this.data.Collection_quantity
      var longitude = this.data.longitude
      var latitude = this.data.latitude 


      // var title = '' + '发现一张来自' + ' “' + user_name+ ' ”' +'发布的精美图片'
      var title = this.data.content
      if(title===""||title===undefined||title===null){
        title = '' + '发现一张来自' + ' “' + user_name + ' ”' + '发布的精美图片'
      }
      // var title = '这里的标题开发者可以随意改动，包括下面的图片，默认就是当前页面截图'
      var path = '/pages/Picture_details/Picture_details?' + 'created_at=' + created_at + '&imageUrl=' + imageUrl + '&user_image=' + user_image + '&user_name=' + user_name + '&content=' + content +'&content_num='+content_num+'&img_height='+img_height+'&img_width='+img_width+'&id='+id+'&created_by='+created_by+'&is_share='+true+'&category='+category+'&Collection_quantity='+Collection_quantity+'&longitude='+longitude+'&latitude='+latitude
      return {
        title: title,
        path: path
      }
    } else {
      return {
        title: '我在图片墙发现了精美图片，赶快来看吧',
        path: '/pages/index/index'
      }
    }
  }
})