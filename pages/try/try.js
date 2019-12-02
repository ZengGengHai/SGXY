// pages/try/try.js
import config from '../../config/config'
import base64 from '../../utils/base64.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    axios:'',
    ImageArray :[],
    limit:10,
    offset:0,
    scrollTop:0,
    list:[],
    timestamp: new Date().getTime()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  },
  water:function(){
    // wx.request({
    //   method: 'GET',
    //   url: 'https://zenggenghai.cn/WaterEleCheck/WaterEleCheck.php',
    //   data: {
    //     roomId: '111',
    //     buildingId: '2047'
    //   },
    //   // header: {
    //   //   // "Content-Type": "application/x-www-form-urlencoded",
    
    //   //   'content-type': 'application/json',
    //   // },
    //   success: function (res) {
    //     console.log(res)
      
        
    //   }
    // })
    wx.request({
      url: 'https://zenggenghai.cn/WaterEleCheck/WaterEleDate.php',
      // url:'http://47.106.255.252/WaterEleCheck.php',
      data: {
        roomId: '212',
        buildingId: '6849'
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        // "Content-Type": "text/html",
      },
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {      
        // console.log(res)
      }
    })

  },
  delete:function(){
    var that=this
    wx.BaaS.invokeFunction('delete_false_image_data').then(res => {
      console.log(res)  // 'hello world'
      var next=res.data.next
      if(next!=null){
        that.delete();
      }else{
        console.log('空了')
      }
    })
  },
  cc:function(){
    wx.request({
      url: 'http://210.38.192.120:8080/sdms-select/webSelect/welcome2.jsp',
      // data: { strCallUserCode: 'test', strCallPassword: '123' },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      },// 设置请求的 header
      success: function (res) {
        if (res.statusCode == 200) {
          console.log(res)
          console.log(res.header["Set-Cookie"])
          var ee = res.header["Set-Cookie"]
          var bb = res.header["Set-Cookie"].substring(0, res.header["Set-Cookie"].length - 30) + "";
    var cc=bb.slice(11)
    console.log(cc)


          wx.request({
            url: 'http://210.38.192.120:8080/sdms-select/webSelect/roomFillLogView1.do?roomName=6320&buildingId=101',
            // data: { strCallUserCode: 'test', strCallPassword: '123' },
            method: 'Get', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
        'cookie': ee//读取cookie
            },// 设置请求的 header
            success: function (res) {
              if (res.statusCode == 200) {
console.log(res)
              } else {
                console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode);
              }
            },
            fail: function () {
              console.log("index.js wx.request CheckCallUser fail");
            },
            complete: function () {
              // complete
            }
          })


        } else {
          console.log("index.js wx.request CheckCallUser statusCode" + res.statusCode);
        }
      },
      fail: function () {
        console.log("index.js wx.request CheckCallUser fail");
      },
      complete: function () {
        // complete
      }
    })
  },
  
  // aa:function(e){
  //   if (e === undefined) {
  //     console.log('内')
  //   } else  {
  //     if (e.target.dataset.click === '内') {
  //       this.bb()
  //     }
  //   }    
  // },
  // bb:function(e){          
  //   if (e=== undefined) {
  //     console.log('中')          
  //   }else{
  //     if (e.target.dataset.click === '中' && e.target.dataset.click != '内'){
  //       this.aa()
  //     }
  //   }      
  // },
  // cc:function(e){
    
  //   if(e.target.dataset.click==='外'){
  //     this.bb()
  //     this.aa()
     
  //   }else{
  //     console.log('外')
  //   }
  // },






















































//   bb: function () {
//     var that=this
//     let tableID = 44119
//     var Product = new wx.BaaS.TableObject(tableID)
//     var limit = this.data.limit
//     var offset = this.data.offset
//     Product.orderBy('created_at').limit(limit).offset(offset).find().then(res => {
//       console.log(res)
   
//       var Array = that.data.ImageArray
//       console.log(res.data.objects.length)
//       for(var i=0;i<res.data.objects.length;i++){
//         Array.push(res.data.objects[i])
//       }
//       console.log(Array)
     
//       this.setData({
//         ImageArray: Array
//       })
//       var offset=this.data.offset+3
//       this.setData({
//         offset:offset
//       })

//     }, err => {
    
//     })
//   },
//   cc:function(){
//   var name='16115072037'
//   var pwd ='zghzzj1599224579'
 
  
  
 
//   var aa = base64.CusBASE64.encoder(name);
//   var bb = base64.CusBASE64.encoder(pwd);
//   var encoded=aa+'%%%'+bb
//   console.log(encoded)


//     //创建header 


// wx.request({
//   url: 'http://jwc.sgu.edu.cn/jsxsd/xk/',
//   header: {
//       'content-type': 'application/json',
//     'Accept-Language': 'zh-CN,zh;q=0.9',
//     },
//   method: 'GET', 

//   success: function (res) {
//     console.log(res)
//     var bb = res.header["Set-Cookie"].substring(0, res.header["Set-Cookie"].length - 8)+"";
//     var cc=bb.slice(11)
//     console.log(cc)
//   //  var  cc = res.header["Set-Cookie"]
//     wx.setStorageSync("sessionid", cc)
//     wx.request({
//       url: 'http://jwc.sgu.edu.cn/jsxsd/xk/LoginToXk/',
//       header: {


//         "Content-Type": "application/x-www-form-urlencoded",
//         'cookie': wx.getStorageSync("sessionid")//读取cookie
//       },
//       data: {
//         encoded: encoded
//       },
//       method: 'GET',
//       success: function (res) {
//         console.log(res)
        
        


//       }
//     })

//   }
// })





  // wx.request({
  //   url: 'http://jwc.sgu.edu.cn/jsxsd/',
  //   header: {
  //     'content-type': 'application/json',
  //   },
  //   method: 'GET',
  //   success: function (res) {
  //     console.log(res)
     
  //     console.log(res.header["Set-Cookie"])
  //    var  basic = res.header["Set-Cookie"].substring(0, res.header["Set-Cookie"].length - 8); 
  //    var bb = basic.slice(11)
  //     console.log(bb) 
  //     wx.setStorageSync("sessionid", bb)

  //    wx.request({
  //   url: 'http://jwc.sgu.edu.cn/jsxsd/xk/LoginToXk', 
  //   data: {
  //     encoded:encoded
  //   },
  //   method: 'POST',
  //   header: {
  //     'content-type': 'application/x-www-form-urlencoded',
  //     'cookie':wx.getStorageSync("sessionid")//读取cookie
   
  //   },
  //   success: function (res) {
  //     console.log(res,wx.getStorageSync("sessionid") )
  //     if(res.data==''){
  //       console.log('密码正确')
  //     }else{
  //       console.log('密码错误')
  //     }
  
  //   }
  // })
  //   }
  // })





  // },

  lower:function(){
    this.bb()

  },

  // aa:function(){

  //   wx.chooseImage({
  //     count: 1, // 默认9
  //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {
  //       let MyFile = new wx.BaaS.File()
  //       let fileParams = { filePath: res.tempFilePaths[0] }
  //       let metaData = { categoryName: '韶关学院图片' }

  //       MyFile.upload(fileParams, metaData).then(res => {
         

  //         let data = res.data  // res.data 为 Object 类型
  //         console.log(data.path)
  //         let tableID = 44119
  //         let Image = new wx.BaaS.TableObject(tableID)
  //         let image = Image.create()
            
  //         image.set('ImageUrl', data.path)

  //         image.save().then(res => { }, err => { })
  //       }, err => {

  //       })
  //     }
  //   })

   


   
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let item = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
    let interval = setInterval(function () {
      this.data.list.unshift(item.pop());
      this.setData(this.data);
      if (!item.length) {
        clearInterval(interval);
      }
    }.bind(this), 5000);
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  // var that=this
  // this.bb();
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
  
  }
})