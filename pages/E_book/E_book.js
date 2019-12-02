// pages/E_book/E_book.js
import utils from '../../utils/utils'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book_url:'',
    cover_img:'',
    book_title:'',
    chapter:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    console.log(options)
    let book_url=options.book_url
    let cover_img=options.cover_img
    let book_title=options.book_title
    let chapter = options.chapter.split(","); //字符分割 

    console.log(chapter) 
    that.setData({
      book_url,
      cover_img,
      book_title,
      chapter
    })
    
  },
  star_read:function(){
    
 
    
 
  },

  DownLoad: function () {   //下载图片
    
    var image_url = this.data.cover_img
    const downloadTask = wx.downloadFile({
      url: image_url,
      success: function (res) {
        console.log(res)

        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (result) {
            console.log(result)
          }
        })
        // wx.saveFile({
        //   tempFilePath: res.tempFilePath,
        //   success: function (res) {
        //     console.log(res.savedFilePath)
        //   }

        // })

      }
    })

    downloadTask.onProgressUpdate((res) => {

        console.log('下载进度', res.progress)
        this.setData({
          ccc: res.progress
        })
        if (res.progress % 5 === 0) {
        
        }

        if (res.progress === 100) {
          let hide = utils.hideLoadingToast()
        }
        console.log('已经下载的数据长度', res.totalBytesWritten)
        console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
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

  }
})