// pages/choose_song/choose_song.js
import config from '../../config/config'
import constant from '../../config/constant'
import utils from '../../utils/utils'
import util from '../../utils/util'
const app = getApp();


let BaaS=wx.BaaS
let ProductTableID = config.LEAVING_MESSAGES.MERCHANTS
let Product= new BaaS.TableObject(ProductTableID)


Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo_left:'',
    song_List:[],
    user_word_list:[],
    inputValue: '',
    buttonClicked:false,
    userInfo:[],
    limit:8,
    offset:0,
    Tips:'点击加载用户评论',
    Load_complete:false,





    replay_limit:3,
    replay_offset:3,


    isMapShow:true,
  

    temporary_id:'',
    temporary_num:0,
    temporary_replay_limit : 0,
    temporary_replay_offset :0,
    temporary_replay_list :[],


    temporary_list:[],

    second_replay: false,
    second_author_id: '',
    second_author_name: '',
    bottom_box:false,
    background:true,


    song_admin:false, //是否点歌管理员



    select_list:[],




    songBackground:true       //点歌需知遮罩





    
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.song_list();
    this.user_content();
    var that=this

    try {
      var Student_ID = wx.getStorageSync('Student_ID')
      var identity = wx.getStorageSync('identity')
      var userInfo = wx.getStorageSync('userInfo')
      console.log(userInfo, 'ghjgjhg')
      // if (!userInfo) {
      //   that.setData({
      //     name_open: true
      //   })
      //   console.log('meiyou hsouquan')
      // }
      // if (identity != '解除绑定') {
        // that.setData({
        //   nvalidation_open: true
        // })
      // }

      if (userInfo) {  
        console.log(userInfo)
        that.setData({
          userInfo: userInfo
        })

      }
    } catch (e) {

    }

    //验证是否点歌管理员
    let  user_id = wx.BaaS.storage.get('uid')
    let admin_Id = config.Song_admin
    for(let i=0;i<admin_Id.length;i++){
      console.log(user_id)
       if(user_id===admin_Id[i].MERCHANTS){
         this.setData({
           song_admin:true
         })
         console.log('是管理员')
       }
    }
    console.log(admin_Id)





    this.findToday();   //查找今日精选名单


   






   



  },
  findToday:function(){
    var that=this
    let tableId = config.LEAVING_MESSAGES.MERCHANTS
    var Product = new wx.BaaS.TableObject(tableId)
    let query = new wx.BaaS.Query()
    query.compare('type', '=', 'song')

    let query1 = new wx.BaaS.Query()
    var a = true
    query1.compare('Selected', '=', a)

    let query2= new wx.BaaS.Query()
    var a = true
    query2.compare('time', '=','today')

    let andQuery = wx.BaaS.Query.and(query, query1,query2)

    Product.setQuery(andQuery).limit(1000).offset(0).expand('created_by').orderBy('-created_at').find().then(res => {
      // success
      console.log(res)
      console.log(res,'点歌精选用户')
      var select_list = that.data.select_list
      for(let i=0;i<res.data.objects.length;i++){
        select_list.push({
          content_id:res.data.objects[i].id,
          user_img:res.data.objects[i].created_by.avatar,
          select_show_box:true
        })

        
      console.log(select_list)
      }
      that.setData({
        select_list,
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
  song_more:function(){
    wx.navigateTo({
      url: '../song_name_more/song_name_more',
    })
  },
  input:function(e){    //先判断输入是否为空
    var inputValue = this.data.inputValue
    if (inputValue===""){
      wx.showToast({
        title: '输入内容为空',
        icon: 'loading',
        duration: 2000
      })

    }else{
      this.identity(e);//身份验证  
    }
  },
  input_content:function(e){        //数据插入操作
    let timeoutId = utils.showLoadingToast('加载中...')
    util.buttonClicked(this);
 
    var inputValue = this.data.inputValue
    let tableId = config.LEAVING_MESSAGES.MERCHANTS
    let Product = new wx.BaaS.TableObject(tableId)
    let product = Product.create()
    let input = {
      content: inputValue,
      type:'song'
    }
    product.set(input).save().then(res => {
      let hide = utils.hideLoadingToast()
      this.pianyi(1);  //增加数据偏移量加一
      this.setData({
        inputValue:'',
        background: true,
        bottom_box: false,
      })
      console.log(res)
      
      let content_time
      let user_name
      let content_id
      let user_img
      let content
      let created_by
      var user_word_list = this.data.user_word_list
      // var userInfo = this.data.userInfo

     
      try {
        var userInfo = wx.getStorageSync('userInfo')    
      } catch (e) {

      }
     
     
    

      user_word_list.unshift({
        content: res.data.content,
        content_id: res.data.id,
        content_time: util.diaplayTime(res.data.created_at),
        user_name: userInfo.nickname ,
        user_img: userInfo.avatar,
        created_by: res.data.created_by,
        is_me:true,
        num:0

      })
      this.setData({
        user_word_list
      })
      
    }, err => {
      //err 为 HError 对象
    })



   


  },
  pianyi:function(e){            //offset偏移量
    if(e===1){
      var offset = this.data.offset +1

    }else if(e===0){
      var offset = this.data.offset-1
    }
    this.setData({
      offset,
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
  input_Leaving_word_content:function (e) {        //数据插入操作
    var that=this
    let timeoutId = utils.showLoadingToast('加载中...')
    util.buttonClicked(this);
    var inputValue = this.data.inputValue
    let tableId = config.LEAVING_MESSAGES.MERCHANTS
    let Product = new wx.BaaS.TableObject(tableId)
    let product = Product.create()
    let input = {
      content: inputValue,
      type: 'song',
      replay:true,
      replay_id: that.data.temporary_id
    }
    product.set(input).save().then(res => {
      let hide = utils.hideLoadingToast()
      // this.pianyi(1);  //增加数据偏移量加一
      this.setData({
        inputValue: '',
        isMapShow:true,
        bottom_box: false,
        background: true


        
      })
      console.log(res,'留言插入成功')


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
        replay_id:res.data.replay_id,
        

      })
      console.log(temporary_replay_list)
      var user_word_list=that.data.user_word_list
      var temporary_id = that.data.temporary_id
      var temporary_replay_offset = this.data.temporary_replay_offset-1+2;
      var temporary_num = this.data.temporary_num-1+2;

      user_word_list.forEach((elem, idx) => {
        if (elem.content_id === temporary_id) {
          elem.Replay_list = temporary_replay_list
          elem.replay_offset = temporary_replay_offset
          elem.num = temporary_num   
          elem.show_box=true      
          // elem.replay_next = e.replay_next
        }
      })
      that.setData({
        user_word_list,
      })
      // this.setData({
      //   user_word_list
      // })

    }, err => {
      //err 为 HError 对象
    })






  },
  getid:function(e){
   console.log(e)
    var temporary_id=e.target.dataset.id
    var temporary_num = e.target.dataset.num
    var temporary_replay_limit = e.target.dataset.replay_limit
    var temporary_replay_offset = e.target.dataset.replay_offset
    var temporary_replay_list = e.target.dataset.replay_list

    let user_id = wx.BaaS.storage.get('uid')
    console.log(user_id,e.target.dataset.created_by)
    if (e.target.dataset.created_by == user_id ){
     console.log('本人')
     return 
    }
  
    
    this.setData({
      temporary_id,
      isMapShow:false,
      temporary_id,
      temporary_num,
      temporary_replay_limit,
      temporary_replay_offset,
      temporary_replay_list,
      bottom_box: true,
      background: false,


    })
  },
  closePopup:function(e){
    this.setData({
      inputValue:'',
      isMapShow: true,
      second_replay:false,
      background:true,
      bottom_box:false,
      temporary_id: '',
      temporary_num: 0,
      temporary_replay_limit: 0,
      temporary_replay_offset: 0,
      temporary_replay_list: [],
      second_replay: false
    })
  },







  song_list:function(){
    var that = this

    let tableId = config.CHOOSE_SONG.MERCHANTS
    var Product = new wx.BaaS.TableObject(tableId)

    Product.limit(3).offset(0).orderBy('-created_at').find().then(res => {
      // success
      console.log(res.data.objects)
      var song_List = []
      var song_time = ""
      var song_name = []
      var song_id = ""
      var open = ""

      for (let i = 0; i < res.data.objects.length; i++) {
        song_List.push({
          song_id: res.data.objects[i].id,
          song_time: util.js_date_time(res.data.objects[i].created_at),
          song_name: res.data.objects[i].song_name,
          open: false
        })
      }
      console.log(song_List)
      that.setData({
        song_List: song_List
      })
    }, err => {
      // err
    })
  },


  user_content: function () {                  //加载用户评论
    var that=this 
    var limit = this.data.limit
    var offset = this.data.offset

    let tableId = config.LEAVING_MESSAGES.MERCHANTS
    var Product = new wx.BaaS.TableObject(tableId)
    let query = new wx.BaaS.Query()
    query.compare('type', '=', 'song')

    let query1 = new wx.BaaS.Query()
    var a = false
    query1.compare('replay', '=', a)

    let andQuery = wx.BaaS.Query.and(query1, query)

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
      let Selected
      let time
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
            Replay_list:[],
            num: 0,
            replay_next:false,
            show_box:false,
            replay_limit: 0,
            replay_offset: 0,
            Selected: res.data.objects[i].Selected,

          })
          console.log(user_word_list)
        
       


      }
      console.log(user_word_list)
      this.setData({
        user_word_list,
        offset: offset + 8
      })
      for (let i = 0; i < res.data.objects.length; i++) {
        console.log(user_word_list)
        var temporary_list =[]
        this.Replay(res.data.objects[i].id, (e) => {
          temporary_list.push({      
            Replay_list:e.replay,
            num:e.num,
            replay_next: e.replay_next,
            show_box:e.show_box,
            replay_limit: 3,
            replay_offset: 3,
          })
          console.log(e, temporary_list)
          var user_word_list = this.data.user_word_list
          console.log(user_word_list)
          user_word_list.forEach((elem, idx) => {
            if (elem.content_id === e.id) {
              elem.Replay_list=e.replay,
              elem.num=e.num,
              elem.replay_next=e.replay_next,
              elem.show_box=e.show_box,
              elem.replay_limit=3,
              elem.replay_offset=3
              
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
  compare:function(){
    
    var temporary_list = this.data.temporary_list
    console.log(temporary_list.length)


    
    

      // .forEach((elem, idx) => {
      //   if (elem.content_id === content_id) {
      //     elem.Replay_list = e.replay
      //     elem.replay_next = e.replay_next
      //   }
      // })





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
    Product.setQuery(andQuery).limit(3).offset(0).expand(['created_by', 'replay_second_id']).orderBy('-created_at').find().then(res => {
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
        var replay_second_id = res.data.objects[i].replay_second_id || ''
        if (replay_second_id != '' && replay_second_id != undefined && replay_second_id != null) {
          console.log(replay_second_id)
          var show_second_box = true
          var name = replay_second_id.nickname
        } else {
          console.log('没有评论中的评论');
          var show_second_box = false
          var name = ''
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
          replay_id: res.data.objects[i].replay_id,
          show_second_box,
          name,
        })
      }
      var id 
      var list
      var List = {"id":e ,"replay_next":replay_next,"replay": replay,"num": num,"show_box":show_box }
      cb(List);

      //  console.log(user_word_list)
      //  this.setData({
      //    user_word_list,
      //    offset: offset 
      //  })


    }, err => {
      // err
    })


  },




//  Replay:(e,cb)=>{ 
   
//   var replay = []     
//   let tableId = config.LEAVING_MESSAGES.MERCHANTS
//   var Product = new wx.BaaS.TableObject(tableId)
//   let query = new wx.BaaS.Query()
//   query.compare('replay_id', '=', e)
//     let query1 = new wx.BaaS.Query()
//     var a = true
//     query1.compare('replay', '=', a)
//     let andQuery = wx.BaaS.Query.and(query1, query)
//     Product.setQuery(andQuery).limit(3).offset(0).expand('created_by').orderBy('-created_at').find().then(res => {
//     // success
//     var num = res.data.meta.total_count
//     if (!res.data.meta.next && typeof (res.data.meta.next) != "undefined" && res.data.meta.next != "") {
//       var replay_next = false
//     } else {
//       var replay_next = true
//     }
//     let content_time
//     let user_name
//     let content_id
//     let user_img
//     let content
//     let created_by
//     var show_box=false
//     var replay_id
//     let user_id = app.getUserId();
//     for (let i = 0; i < res.data.objects.length; i++) {
//       if (user_id === res.data.objects[i].created_by.id) {
//         var is_me = true
//       }
//       else {
//         var is_me = false
//       }
//       console.log(res.data.objects.length)
//       if (res.data.objects.length>=0){
//         show_box=true
//       }
//       replay.push({
//         content: res.data.objects[i].content,
//         content_id: res.data.objects[i].id,
//         content_time: util.diaplayTime(res.data.objects[i].created_at),
//         user_name: res.data.objects[i].created_by.nickname,
//         user_img: res.data.objects[i].created_by.avatar,
//         created_by: res.data.objects[i].created_by.id,
//         is_me: is_me,
//         replay_id:res.data.objects[i].replay_id
//       })
//     }
//       var List = { replay_next: replay_next, replay: replay, num: num, show_box:show_box }
//       cb(List);

//     //  console.log(user_word_list)
//     //  this.setData({
//     //    user_word_list,
//     //    offset: offset 
//     //  })


//   }, err => {
//     // err
//   })


//  },


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
    let andQuery = wx.BaaS.Query.and(query1, query)
    Product.setQuery(andQuery).limit(e.replay_limit).offset(e.replay_offset).expand(['created_by', 'replay_second_id']).orderBy('-created_at').find().then(res => {
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
        var replay_second_id = res.data.objects[i].replay_second_id || ''
        if (replay_second_id != '' && replay_second_id != undefined && replay_second_id != null) {
          console.log(replay_second_id)
          var show_second_box = true
          var name = replay_second_id.nickname
        } else {
          console.log('没有评论中的评论');
          var show_second_box = false
          var name = ''
        }
        console.log(replay_next)

        replay.push({
          content: res.data.objects[i].content,
          content_id: res.data.objects[i].id,
          content_time: util.diaplayTime(res.data.objects[i].created_at),
          user_name: res.data.objects[i].created_by.nickname,
          user_img: res.data.objects[i].created_by.avatar,
          created_by: res.data.objects[i].created_by.id,
          is_me: is_me,
          replay_id:res.data.objects[i].replay_id,
          show_second_box,
          name,
          replay_next,
        })
      }
      var List = { replay_next:replay_next, replay: replay, num: num, show_box: show_box }
      cb(List);

      


    }, err => {
      // err
    })


  },

 replay_more:function(e){
   console.log(e)
 
   var replay_limit = e.target.dataset.replay_limit;
   var replay_offset = e.target.dataset.replay_offset ;
   var replay_next=e.target.dataset.replay_next;
   var content_id=e.target.dataset.content_id;
   var Replay_list = e.target.dataset.replay_list;
   console.log(replay_limit, replay_next, content_id, replay_offset, Replay_list)


   this.Replay_more({ replay_limit, replay_next, content_id, replay_offset, Replay_list}, (e) => { 

     console.log(e)
     var user_word_list = this.data.user_word_list
     console.log(user_word_list)
     user_word_list.forEach((elem,idx)=>{
       if (elem.content_id ===content_id){
         elem.Replay_list=e.replay
         elem.replay_next = e.replay_next
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
 delete_content:function(e){   
   util.buttonClicked(this);  //删除数据防止按钮点击两次
   this.delete(e);
   this.pianyi(0);     //删除数据后偏移量减一
 },
  delete:function(e){       //删除数据

    let timeoutId = utils.showLoadingToast('加载中...')

    let index = e.currentTarget.dataset.index
    const user_word_list = this.data.user_word_list
   
    let tableId = config.LEAVING_MESSAGES.MERCHANTS
    let recordID = e.currentTarget.dataset.id

    let Product = new wx.BaaS.TableObject(tableId)
    Product.delete(recordID).then(res => {
      // success
      let hide = utils.hideLoadingToast()
      user_word_list.splice(index, 1)  //删除某一项
      this.setData({
        user_word_list
      })
    }, err => {
      // err
    })
  },


  identity: function (e) {           //进行身份验证函数

    var that = this
    try {
      var Student_ID = wx.getStorageSync('Student_ID')
      var identity = wx.getStorageSync('identity')
      var userInfo = wx.getStorageSync('userInfo')


      if (Student_ID && identity === '解除绑定' && userInfo) {
        // Do something with return value
        console.log('解除绑定', Student_ID)
        var user_image = userInfo.avatar
        var user_name = userInfo.nickname
       
       
        that.input_content(e);  //验证成功就可以留言
      } else {

        wx.showModal({
          title: '你未授权信息或者身份验证',
          content: '如需跳转到个人主页进行验证，请点击确认进行跳转。',
          success: function (res) {
            if (res.cancel) {
              console.log('用户点击取消')

            } else if (res.confirm) {
              wx.navigateTo({

                url: '../person/person?open=' + 'choose_song',
              })

            }
          }
        })
      }
    } catch (e) {

    }

  },
  identity_two: function (e) {           //进行身份验证函数

    var that = this
    try {
      var Student_ID = wx.getStorageSync('Student_ID')
      var identity = wx.getStorageSync('identity')
      var userInfo = wx.getStorageSync('userInfo')


      if (Student_ID && identity === '解除绑定' && userInfo) {
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

                url: '../person/person?open=' + 'choose_song',
              })

            }
          }
        })
      }
    } catch (e) {

    }

  },



  // aa:function(){
  //   wx.request({
  //     url: 'http://api.heclouds.com/devices/503127381',
  //     data:{
  //       title: "test_device"
        
  //     },
  //     header: {
  //       "content-type": "application/x-www-form-urlencoded",
  //       'api-key':'cAW=aK7Y7DlslEgkoYXykUxGlfw= Master-APIkey',
  //       'POST':'http://api.heclouds.com/devices HTTP/1.1',
  //       // 'Host': 'api.heclouds.com'
       
  //     },

  //     method: 'POST',
  //     success: function (res) {
  //       console.log(res.data)
  //     },
  //     fail:function(res){
  //       console.log(res.data)
  //     }
     

  //   })
    
  // },
  see:function(e){     //歌曲展示详情
    console.log(e)
    var id = e.currentTarget.dataset.id
    const song_List = this.data.song_List
    for (let i = 0, len = song_List.length; i < len; ++i) {
      if(song_List[i].song_id === id) {
        song_List[i].open = !song_List[i].open
      } else {
        song_List[i].open = false
      }
    }
    console.log(song_List)
    this.setData({
      song_List
    })
  },
  preventTouchMove: function () {    //遮罩防止滑动
  },
  Leaving_word:function(){
    console.log('留言')
  },


  delete_replay: function (e) {
    util.buttonClicked(this);  //删除数据防止按钮点击两次
    this.delete_my_replay(e);
    // this.pianyi(0);     //删除数据后偏移量减一
  },
  delete_my_replay:function (e) {       //删除数据

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
    console.log(e,'gg')
    var that=this
    var id=e.target.dataset.id  //留言id
    var replay_id=e.target.dataset.replay_id   //评论id

    let timeoutId = utils.showLoadingToast('加载中...')
    let index = e.currentTarget.dataset.index

 


    let tableId = config.LEAVING_MESSAGES.MERCHANTS
    let recordID = e.currentTarget.dataset.id

    let Product = new wx.BaaS.TableObject(tableId)
    Product.delete(id).then(res => {
      // success
      let hide = utils.hideLoadingToast()
      // let user_id = app.getUserId();

      const user_word_list = this.data.user_word_list
      user_word_list.forEach((elem, idx) => {
        if (elem.content_id === replay_id) {
          console.log('此时')
          console.log(elem.Replay_list)
          // var Replay_list=[]
          // for (var i = 0; i < elem.Replay_list.length;i++){
          //   Replay_list.push({
          //     content: elem.Replay_list[i].content,
          //     content_id: elem.Replay_list[i].id,
          //     content_time:elem.Replay_list[i].created_at,
          //     user_name: elem.Replay_list[i].user_name,
          //     user_img: elem.Replay_list[i].user_img,
          //     created_by: elem.Replay_list[i].created_by,
          //     is_me: elem.Replay_list[i].is_me,
          //     replay_id: elem.Replay_list[i].replay_id
          //   })          
          // }
          elem.Replay_list.splice(index, 1)
          console.log(elem.Replay_list,index)
          if (elem.num-1===0){
            elem.show_box=false
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
  replay_second: function (e) {
    console.log(e, 'fsdjfk')
    var created_by = e.target.dataset.created_by
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
      second_replay: true,
      second_author_id: created_by,
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


      if (Student_ID && identity === '解除绑定' && userInfo) {
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

                url: '../person/person?open=' + 'image_fllow',
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
      type: 'song',
      replay: true,
      replay_id: that.data.temporary_id,
      replay_second_id: user,
    }
    product.set(input).save().then(res => {
      let hide = utils.hideLoadingToast()
      // this.pianyi(1);  //增加数据偏移量加一

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
      var show_second_box = true
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
        isMapShow: true,
      })
      // this.setData({
      //   user_word_list
      // })

    }, err => {
      //err 为 HError 对象

    })
  },



  shoucang:function(e){   //精选留言
    var that=this
    util.buttonClicked(this);

    var Selected = e.currentTarget.dataset.selected 
    let timeoutId = utils.showLoadingToast('加载中...')
    let index = e.currentTarget.dataset.index

    let user_img = e.currentTarget.dataset.user_img
    let recordID = e.currentTarget.dataset.id

    const user_word_list = this.data.user_word_list
    let tableId = config.LEAVING_MESSAGES.MERCHANTS
    let Product = new wx.BaaS.TableObject(tableId)
    let product = Product.getWithoutData(recordID)


    var select_list = this.data.select_list

    if (Selected){
      product.set('Selected', false)
      product.set('time', 'notoday')
      console.log('取消精选')
    }else{
      product.set('Selected', true)
      product.set('time','today')
      console.log('精选留言')
      
    }

    product.update().then(res => {
      if (Selected) {
        console.log('取消精选')
        console.log(recordID)
      
        select_list.forEach((elem, idx) => {
          if (elem.content_id === recordID) {
            elem.select_show_box=false     
          }
        })
        console.log(select_list)
      } else {
        console.log('精选留言')
        select_list.push({
          content_id:recordID,
           user_img,
           select_show_box:true
        })
      }

      console.log(res)
      let hide = utils.hideLoadingToast()

      var user_word_list = this.data.user_word_list

      user_word_list.forEach((elem, idx) => {
        if (elem.content_id === recordID) {
          elem.Selected= !Selected
      
        }
      })
      that.setData({
        user_word_list,
        select_list
      })

     
     
      
     
     
    }, err => {
      // err
    })

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
    
  },




  prompt:function(e){  //消息模板推送
      console.log(e)
      wx.BaaS.wxReportTicket(e.detail.formId)
 
  },

  show_box:function(e){
    this.setData({
      bottom_box:true,
      background:false
    })

  },
  closeSongPopup: function () {
    this.setData({
      songBackground: true
    })


    try {
      wx.setStorageSync('first_time', false)
    } catch (e) {
    }
  },
  showSongBox:function(){
    this.setData({
      songBackground: false
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
    var that=this
    try {
      var first_time = wx.getStorageSync('first_time')
      console.log(first_time)
    

      if (first_time==='') {
        this.setData({
          songBackground: false
        })
       
      } else {
        this.setData({
          songBackground: true
        })

      }
    } catch (e) {

    }

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
    try {
      wx.setStorageSync('first_time', false)
    } catch (e) {
    }

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