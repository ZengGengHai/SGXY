
import config from '../../config/config'
import constant from '../../config/constant'
import utils from '../../utils/utils'
import util from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: [],
    ccc: 0,
    saveImgBtnHidden: false,
    imgList: [],
    Student_ID:'',
    cut_or_add:'未收录',
   


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options.id)
    console.log(options)
    var imgList = that.data.imgList
    var image = options.imageUrl
    imgList.push(image);
    var is_share = options.is_share   //判断是否装发引起的
    if (is_share==='yes'){
      let tableID = config.IMAGE_ID.MERCHANTS
      let recordID = options.id

      let Product = new wx.BaaS.TableObject(tableID)

      Product.get(recordID).then(res => {
        console.log(res.data.examine)
        var examine = res.data.examine
        if (examine==='true'){
          that.setData({
            cut_or_add:'已收录',     
          })
          console.log(res,'ef')
        }else{
          that.setData({
            cut_or_add: '未收录'  ,
    
          })
        }      
      }, err => {
        // err
      })
    }else{
       
      

    }
    this.setData({
      image: [options],
      imgList,

    })

    

   


  },
  Tip: function () {
    var ccc = this.data.ccc
    wx.showToast({
      title: '正在下载图片' + ccc + '%',
      icon: 'none',
      duration: 10000
    })
  },
  Add_Image: function () {
    var cut_or_add = this.data.cut_or_add
    if (cut_or_add==='未收录'){
      var id = this.data.image[0].id
      let tableID = config.IMAGE_ID.MERCHANTS
      let recordID = id
      let Product = new wx.BaaS.TableObject(tableID)
      let product = Product.getWithoutData(recordID)
      product.set('examine', 'true')
      product.update().then(res => {
        this.setData({
          cut_or_add:'已收录'
        })
        wx.showToast({
          title: '添加图片墙成功',
          icon: 'none',
          duration: 2000
        })
      }, err => {
        this.setData({
          cut_or_add: '未收录'
        })
        wx.showToast({
          title: '你的权限不足，添加图片墙失败',
          icon: 'none',
          duration: 2000
        })
      })
    }else{
      wx.showToast({
        title: '该作品已经收录',
        icon: 'none',
        duration: 2000
      })
    }


  },

  previewImage: function (e) {    //预览图片
    console.log(e)
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgList // 需要预览的图片http链接列表  
    })
  },


  Cut_Down_Image: function () {
    var cut_or_add_box = this.data.cut_or_add_box
    var cut_or_add = this.data.cut_or_add
    if (cut_or_add==='已收录'){
      var id = this.data.image[0].id
      let tableID = config.IMAGE_ID.MERCHANTS
      let recordID = id
      let Product = new wx.BaaS.TableObject(tableID)
      let product = Product.getWithoutData(recordID)
      product.set('examine', 'false')
      product.update().then(res => {
        this.setData({
          cut_or_add: '未收录'
        })
        wx.showToast({
          title: '抽离图片墙成功',
          icon: 'none',
          duration: 2000
        })


        wx.BaaS.invoke('user_information_down', {event:res }).then(res => {
          if (res.code === 0) {
            // success
            
            console.log(res.data)
          } else {
            // fail
            console.log(res.error.message)
          }
        }, err => {
          // HError 对象
          callback(err)
        })  


      }, err => {
        this.setData({
          cut_or_add: '已收录'
        })
        wx.showToast({
          title: '你的权限不足，抽离图片墙失败',
          icon: 'none',
          duration: 2000
        })
      })
    }else{
      wx.showToast({
        title: '该作品没有收录',
        icon: 'none',
        duration: 2000
      })
    }
 
  
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
      var image = this.data.image
      var created_at = image[0].created_at
      var imageUrl = image[0].imageUrl
      var user_image = image[0].user_image
      var user_name = image[0].user_name
      var Student_ID = image[0].Student_ID
      var id = image[0].id
      var is_share='yes'
      var title = '' + '是否收录来自' + ' “' + user_name + ' ”' + '发布的图片'
      // var title = '这里的标题开发者可以随意改动，包括下面的图片，默认就是当前页面截图'
      var path = '/pages/check_picture_details/check_picture_details?' + 'created_at=' + created_at + '&imageUrl=' + imageUrl + '&user_image=' + user_image + '&user_name=' + user_name+ '&Student_ID=' + Student_ID + '&is_share=' + is_share +'&id='+id

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