//index.js
//获取应用实例

/**
 * 定义几个数组用来存取item中的数据
 */
var mUrl = [];


const app = getApp()

Page({
  data: {
    images: [],
    scroll_H: 0,
    imgWidth: 0,
    oneimages: [],
    twoimages: [],
    oImageIndex: [],
    index: 0,
    tempindex: 0,
    limit:8,
    offset:0,
    next:true,
    one:false,
    two:false,
    next_word:'滑动或者点击这里查看更多'

  },
  onReachBottom: function () {
    console.log('onReachBottom')
    var that = this
    that.setData({
      hidden: false,
    });
    this.requestData();
  },
  onLoad: function () {
    console.log('onLoad')
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
    this.requestData();
    // this.loadimg();



  },
  loadimg: function (e) {//图片加载完成执行


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
      if(oneImageH>twoImageH){
        this.setData({
          one:false,
          two:true
        })
      }else{
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
  },
  next:function(){
    this.requestData()

  },
  requestData:function () {
    var next=this.data.next
    var that=this
    let tableID = 44119
    var Product = new wx.BaaS.TableObject(tableID)
    var limit = this.data.limit
    var offset = this.data.offset
    var itemList = [];
    if(next){

      Product.orderBy('-created_at').limit(limit).offset(offset).find().then(res => {
        console.log(res)
        if(res.data.meta.next==null){
          this.setData({
            next:false,
            next_word:'-----图片到尾了哦-----'

          })


          console.log('空了')
        }



        console.log(res.data.objects.length)
        for (var i = 0; i < res.data.objects.length; i++) {
          mUrl.push(res.data.objects[i].ImageUrl)
        }
        for (var i = 0; i < mUrl.length; i++) {
          itemList.push({ pic: mUrl[i], height: 0 });
        }
        console.log(mUrl)

        // this.setData({
        //   ImageArray: Array
        // })
        var offset = this.data.offset + 8
        that.setData({
          images: itemList,
          hidden: true,
          tempindex: mUrl.length,
          offset: offset
        });
        this.aaa(that);

      }, err => {

      })

    }
    
  },
  aa:function(){

    let Object = new wx.BaaS.TableObject('44119')

    let query = new wx.BaaS.Query()
    query.contains('examine', 'no')
    Object.setQuery(query).find().then(res => {
      console.log(res)
      var Array=[];
  
      for(var i=0;i<res.data.objects.length;i++){
        Array.push(res.data.objects[i]._id);
       }
       console.log(Array)

      let MyFile = new wx.BaaS.File()

      MyFile.delete().then()


    }, err => {
      // err
    })

   

  },
  bb: function () {

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        let MyFile = new wx.BaaS.File()
        let fileParams = { filePath: res.tempFilePaths[0] }
        let metaData = { categoryName: '韶关学院图片' }

        MyFile.upload(fileParams, metaData).then(res => {


          let data = res.data  // res.data 为 Object 类型
          console.log(data.path)
          let tableID = 44119
          let Image = new wx.BaaS.TableObject(tableID)
          let image = Image.create()

          image.set('ImageUrl', data.path)

          image.save().then(res => { }, err => { })
        }, err => {

        })
      }
    })





  },
  
/**
 * 
 * 绑定接口中返回的数据
 * @param itemData Gank.io返回的content;
 */

aaa: function(that) {
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
})





