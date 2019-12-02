module.exports = {
  BAAS_CLIENT_ID: 'fe3f67339f0572cab52d', // 通过知晓云管理面板获取 ClientID

  TABLE_ID: [{      // 通过知晓云管理面板获取数据表 ID 
    MERCHANTS: 35572, // 校本部表
    NAME:"韶院校本部"
  },{     
    MERCHANTS: 38549,  //分校区
    NAME: "黄田坝分校区"
  },{
      MERCHANTS: 43472,  //分校区
      NAME: "韶医分校区"
  },  
  ],

  SCHOOL_INTRODUCTION_ID:{       //学校简介
    MERCHANTS: 39289,
    RECORDID : '5b1639dc8e452952ac3a99c2'
  },
  SCHOOL_HISTORY_ID:{    //韶院历史图片
    MERCHANTS: 55609,
    RECORDID: '5bd34e74b4f61a1eed656645'
  },
  SCHOOL_HISTORY_LIST_ID: {    //时间轴
    MERCHANTS: 55610,    
  },
  HEAD_PROTRAIT_ID: {   //相框
    MERCHANTS: 55613,    
  },
 
  IMAGE_ID:{             //图片墙
    MERCHANTS: 44119,
    EVERYDAY:100,        //每天审核图片数量上限
  },
  SCHOOL_NEWS: {         //韶大报告
    MERCHANTS: 45458,
  },
  MANAGERS:{             //后台管理者
    MERCHANTS: 47218,
  },
  SHOUCANG_IMAGE:{       //用户收藏图片表
    MERCHANTS: 57405,
  },
  CHOOSE_SONG: {     //点歌功能
    MERCHANTS: 67984,
  },
  LEAVING_MESSAGES:{     //点歌功能之用户留言表
    MERCHANTS: 68060
  },
  E_bool:{                 //电子杂志
    MERCHANTS: 68399
  },
  Focus_on_users:{         //关注表
    MERCHANTS: 69276
  },
  User:{                    //用户信息
    MERCHANTS: 49453
  },
  Reply:{                   //回复表
    MERCHANTS: 70021
  },

  Song_admin:[{
    MERCHANTS:67617218   //zy
  },{
    MERCHANTS: 64820174  //zgh
  },{
    MERCHANTS: 67859116
  },{
    MERCHANTS: 67617791
  }
  ],
  ImgAdmin:[{
    MERCHANTS: 64820174  //zgh
  }, {
    MERCHANTS: 67617218  //zy
  },{ 
    MERCHANTS: 67615472   //xcl
  }, {
      MERCHANTS: 68166100  //lds
    }, {
      MERCHANTS: 65393922  //cxm
    }],

  
  ROUTE: {
    NAVIGATOR: '/pages/navigator/navigator',
    PLACE: '/pages/place/place'
  },

  API: {
    CALCULATE_DISTANCE: 'https://apis.map.qq.com/ws/distance/v1/',
  },

  QQ_LBS: {
    WEB_API: 'JDZBZ-PEZKX-JBN47-T5CWB-RWFCJ-EQFN5', // 需自行申请一个腾讯地图的开发 key
  },

  // 高德地图 key
  AUTO_NAVI: {
    JS_SDK: 'da3adf89a36d6dff5e0d9f88c47cc745', // 需自行申请高德地图的开发 key
    WEB_API: 'da3adf89a36d6dff5e0d9f88c47cc745', // 需自行申请高德地图的开发 key
  }
 
 
}