
import map_config from '/config/config'


var config = require('./config')



App({
    onLaunch: function () {
     
  
        wx.BaaS = requirePlugin('sdkPlugin')
        wx.BaaS.wxExtend(wx.login, wx.getUserInfo, wx.requestPayment) //让插件帮助完成登录、支付等功能      
        // wx.BaaS.init(map_config.BAAS_CLIENT_ID)
        wx.BaaS.init(map_config.BAAS_CLIENT_ID, { autoLogin: true })
        wx.getSystemInfo({
          success: e => {
            console.log(e)

            let windowWidth = e.windowWidth
            let windowHeight = e.windowHeight

           
            let windowHeight_rpx = e.windowHeight/20   //5vh
            console.log(windowHeight_rpx)
     

        // console.log(windowHeight) //最后获得转化后得rpx单位的窗口高度
            this.globalData.StatusBar = e.statusBarHeight;
            let custom = wx.getMenuButtonBoundingClientRect();
            this.globalData.Custom = custom;
            this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
            this.globalData.zghCustomBar = custom.bottom + custom.top - e.statusBarHeight + windowHeight_rpx
          }
        })

 

        
       
        const userId = this.getUserId()
        if (!userId) {
          wx.BaaS.auth.loginWithWechat()
            .then(res => {
              console.log('BaaS is logined...')
            }).catch(err => {
              console.log(err)
            })
        }

    },
    globalData: {
      ColorList: [{
        title: '嫣红',
        name: 'red',
        color: '#e54d42'
      },
      {
        title: '桔橙',
        name: 'orange',
        color: '#f37b1d'
      },
      {
        title: '明黄',
        name: 'yellow',
        color: '#fbbd08'
      },
      {
        title: '橄榄',
        name: 'olive',
        color: '#8dc63f'
      },
      {
        title: '森绿',
        name: 'green',
        color: '#39b54a'
      },
      {
        title: '天青',
        name: 'cyan',
        color: '#1cbbb4'
      },
      {
        title: '海蓝',
        name: 'blue',
        color: '#0081ff'
      },
      {
        title: '姹紫',
        name: 'purple',
        color: '#6739b6'
      },
      {
        title: '木槿',
        name: 'mauve',
        color: '#9c26b0'
      },
      {
        title: '桃粉',
        name: 'pink',
        color: '#e03997'
      },
      {
        title: '棕褐',
        name: 'brown',
        color: '#a5673f'
      },
      {
        title: '玄灰',
        name: 'grey',
        color: '#8799a3'
      },
      {
        title: '草灰',
        name: 'gray',
        color: '#aaaaaa'
      },
      {
        title: '墨黑',
        name: 'black',
        color: '#333333'
      },
      {
        title: '雅白',
        name: 'white',
        color: '#ffffff'
      },
      ]
    },
    getUserId() {
      if (this.userId) {
        return this.userId
        // console.log(this.userId)
      }
      const userId = wx.BaaS.storage.get('uid')
      this.userId = userId
      console.log(this.userId)
      return userId
    },



    // 页面回退堆栈
    navToHome() {
      const currentPages = getCurrentPages();
      const currentPagesLen = currentPages.length;
      console.log(currentPagesLen)
     
      if (currentPagesLen === 1) {
        wx.redirectTo({
          url: map_config.ROUTE.NAVIGATOR,
        });
      } else if (currentPagesLen === 4 ){
        wx.navigateBack({
          delta: 2
        });
      } else if (currentPagesLen === 3){
        wx.navigateBack({
          delta: 1
        });
      } else if(currentPagesLen===5){
        wx.navigateBack({
          delta: 3
        });
      }
      else{
        
      }
    },
 
})
