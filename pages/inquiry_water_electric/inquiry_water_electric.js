import * as echarts from '../../utils/ec-canvas/echarts';
const app = getApp()
var wxDraw = require("../../utils/wxdraw.min.js").wxDraw;
var Shape = require("../../utils/wxdraw.min.js").Shape;
var AnimationFrame = require("../../utils/wxdraw.min.js").AnimationFrame;


var date = new Date(); //定义日期对象
var weekday = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]; // 定义数组对象，给每个数组项赋值
var mynum = date.getDay(); //返回值存储在变量mynum中
var week;
switch (mynum) {
  case 0:
    week = ["星期一", "星期二", "星期三", "星期四", "前天", "昨天", "今天"];
    break;
  case 1:
    week = ["星期二", "星期三", "星期四", "星期五", "前天", "昨天", "今天"];
    break;
  case 2:
    week = ["星期三", "星期四", "星期五", "星期六", "前天", "昨天", "今天"];
    break;
  case 3:
    week = ["星期四", "星期五", "星期六", "星期日", "前天", "昨天", "今天"];
    break;
  case 4:
    week = ["星期五", "星期六" , "星期日" , "星期一", "前天", "昨天", "今天"];
    break;
  case 5:
    week = ["星期六", "星期日", "星期一", "星期二", "前天", "昨天", "今天"];
    break;
  case 6:
    week = ["星期日", "星期一", "星期二", "星期三", "前天", "昨天", "今天"];
    break;
}  

console.log(week)


function chartOption(chart, datalist, dataStream) {
  const option = {
    color: ['#30bf6f'],
    grid: {
      x: 40,
      y: 35,
      width: 290,
      height: 160,
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      position: ['20%', '10%']
    },
    xAxis: {
      name: '时间',
      type: 'category',
      boundaryGap: false,
      borderColor:'#fff',
      data: week,
      axisTick: {
        inside: true,
        length: 3,
        axisPointer: {
          type: 'line',
        }
      },
      length: 3,
      axisPointer: {
        type: 'line',
      },
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      },
    },
    yAxis: {
      // name: company,
      type:'category',
      nameLocation: 'end',
      nameGap: 12,
      x: 'center',
      type: 'value',
      min: 0,
      max: 200,
      splitNumber: 10,
      splitLine: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: '#fff'
        }
      },
    },
    series: [{
      name: dataStream,
      type: 'line',
      smooth: true,
      data: [778,33,31],
      showSymbol: true,
      // symbol: 'circle',     //设定为实心点datalist
      // symbol: 'emptyCircle',
      itemStyle: {
        normal: {
          label: {
            show: true,
            color: '#fff',
            fontSize:15
          },
        }
      },
      showAllSymbol: true
    }]
  };
  chart.setOption(option)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '查询',
    // none: 'block',
    balanceNavbar: ["水费", "电费"],
    currentTab:0,
    ec_water: {
      // onInit: ec_water
      lazyLoad: true
    },
    ec_electric:{
      // onInit: ec_electric
      lazyLoad: true
    },
    exhibitData:false,
    animationData: {},
    animationDatabottom:{},
    water: '',
    Height: '',
    BHeight:'',
    electric: '',
    buildnum: '909',
    roomno: '101',
    buildnum_name: '',
    multiArray: [['北区', '南区', '西区', '黄田坝校区'], ['紫藤苑', '碧桃苑', '丹桂苑'], ['紫藤1栋']],
    roomNumArray: [['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], ['0', '1', '2', '3'], ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']],
    objectMultiArray: [
      [
        {
          id: 0,
          name: '北区'
        },
        {
          id: 1,
          name: '南区'
        },
        {
          id: 2,
          name: '西区'
        },
        {
          id: 3,
          name: '黄田坝校区'
        }
      ], [
        {
          id: 0,
          name: '紫藤苑'
        },
        {
          id: 1,
          name: '碧桃苑'
        },
        {
          id: 2,
          name: '丹桂苑'
        }

      ], [
        {
          id: 0,
          name: '紫藤1栋'
        }

      ]
    ],


    multiIndex: [0, 0, 0],
    roomnoIndex: [1, 0, 1],
    data: []


  },

  bindMultiPickerColumnChange: function (e) {
    var multiArray
    var multiIndex

    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };


    // console.log(data.multiArray[0][])

    // console.log(e.detail)

    this.data.multiIndex[e.detail.column] = e.detail.value;
    // var m_column = e.detail.column
    // var m_value = e.detail.value
    // var a = multiIndex[m_column]
 
     
    // this.setData({
    //  a:m_value
    // })
   
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['紫藤苑', '碧桃苑', '丹桂苑'];
            data.multiArray[2] = ['紫藤1栋'];
            break;
          case 1:
            data.multiArray[1] = ['丹枫苑', '丹竹苑', '紫竹苑', '碧桂苑', '红枫苑', '红棉苑', '紫荆苑', '紫薇苑', '银杏苑'];
            data.multiArray[2] = ['丹枫A栋', '丹枫B栋'];
            break;
          case 2:
            data.multiArray[1] = ['丁香苑', '海棠苑', '秋枫苑', '蔷薇苑', '芙蓉苑', '韶师宿舍',];
            data.multiArray[2] = ['丁香A栋', '丁香B栋', '丁香C栋', '丁香D栋', '丁香E栋', '丁香F栋', '丁香G栋'];
            break;
          case 3:
            data.multiArray[1] = ['黄田坝'];
            data.multiArray[2] = ['黄田坝6栋', '黄田坝9栋', '黄田坝10栋', '黄田坝12栋'];
            break;

        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['紫藤1栋'];
                break;
              case 1:
                data.multiArray[2] = ['碧桃20栋', '碧桃21栋', '碧桃24栋', '碧桃25栋', '碧桃27栋', '碧桃28栋', '碧桃29栋',];
                break;
              case 2:
                data.multiArray[2] = ['丹桂22栋', '丹桂23栋', '丹桂26栋'];
                break;
            }
            break;
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['丹枫A栋', '丹枫B栋'];
                break;
              case 1:
                data.multiArray[2] = ['丹竹A栋', '丹竹B栋', '丹竹C栋'];
                break;
              case 2:
                data.multiArray[2] = ['紫竹A栋', '紫竹B栋',];
                break;
              case 3:
                data.multiArray[2] = ['碧桂A栋', '碧桂B栋', '碧桂C栋'];
                break;
              case 4:
                data.multiArray[2] = ['红枫A栋', '红枫B栋'];
                break;
              case 5:
                data.multiArray[2] = ['红棉东栋', '红棉西栋'];
                break;
              case 6:
                data.multiArray[2] = ['紫荆A栋', '紫荆B栋', '紫荆C栋'];
                break;
              case 7:
                data.multiArray[2] = ['紫薇A栋', '紫薇B栋', '紫薇C栋'];
                break;
              case 8:
                data.multiArray[2] = ['银杏A栋', '银杏B栋'];
                break;
            }
            break;
          case 2:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['丁香A栋', '丁香B栋', '丁香C栋', '丁香D栋', '丁香E栋', '丁香F栋', '丁香G栋'];
                break;
              case 1:
                data.multiArray[2] = ['海棠A栋', '海棠B栋', '海棠C栋'];
                break;
              case 2:
                data.multiArray[2] = ['秋枫A栋', '秋枫B栋', '秋枫C栋', '秋枫D栋'];
                break;
              case 3:
                data.multiArray[2] = ['蔷薇A栋', '蔷薇B栋', '蔷薇C栋'];
                break;
              case 4:
                data.multiArray[2] = ['芙蓉A栋', '芙蓉B栋', '芙蓉C栋', '芙蓉D栋'];
                break;
              case 5:
                data.multiArray[2] = ['樱花苑栋', '梧桐苑栋']
            }
            break;
          case 3:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['黄田坝6栋', '黄田坝6栋', '丁黄田坝10栋', '黄田坝12栋'];
                break;

            }
            break;

        }
        data.multiIndex[2] = 0;
        console.log(data.multiIndex);
        break;
    }
    this.setData(data);
    this.setData({
      data: data
    });
    console.log(data, "这是区号")

    try {
      wx.setStorageSync('data', data)
    } catch (e) {
    }



  },

  bindMultiPickerChange: function (e) {

    console.log('picker发送选择改变，携带值为', e.detail.value)








    this.setData({
      multiIndex: e.detail.value
    })
    var bb = '' + e.detail.value[0] + e.detail.value[1] + e.detail.value[2]  //对应的数组下标转化成数字





    console.log(bb)


    var buildnum = this.data.data
    var buildnum_quhao = buildnum.multiArray[0][e.detail.value[0]] //区号
    var buildnum_loudong = buildnum.multiArray[2][e.detail.value[2]] //楼号
    console.log(buildnum_quhao, buildnum_loudong)




    //记录楼栋下标的位置



    switch (bb) {
      case '000':
        var buildnum = '909'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '010':
        var buildnum = '6378'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '011':
        var buildnum = '1177'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
      case '012':
        var buildnum = '1250'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '013':
        var buildnum = '1623'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '014':
        var buildnum = '1649'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '015':
        var buildnum = '1332'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '016':
        var buildnum = '1366'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '020':
        var buildnum = '1426'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '021':
        var buildnum = '1486'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '022':
        var buildnum = '6481'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '100':
        var buildnum = '6090'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '101':
        var buildnum = '6169'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '110':
        var buildnum = '1688'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '111':
        var buildnum = '1811'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '112':
        var buildnum = '1924'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '120':
        var buildnum = '6849'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '121':
        var buildnum = '6988'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;

      case '130':
        var buildnum = '2202'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;

      case '131':
        var buildnum = '2047'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;

      case '132':
        var buildnum = '2114'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;

      case '140':
        var buildnum = '2317'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;

      case '141':
        var buildnum = '6320'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;



      case '150':
        var buildnum = '6290'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;

      case '151':
        var buildnum = '6326'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;

      case '160':
        var buildnum = '2904'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;

      case '161':
        var buildnum = '3151'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;

      case '162':
        var buildnum = '3271'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;

      case '170':
        var buildnum = '3405'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;

      case '171':
        var buildnum = '3517'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;

      case '172':
        var buildnum = '3629'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;

      case '180':
        var buildnum = '5908'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;

      case '181':
        var buildnum = '6011'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;

      case '200':
        var buildnum = '3763'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '201':
        var buildnum = '3884'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '202':
        var buildnum = '4005'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '203':
        var buildnum = '4126'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '204':
        var buildnum = '4247'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '205':
        var buildnum = '4492'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '206':
        var buildnum = '4369'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '210':
        var buildnum = '2710'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '211':
        var buildnum = '2807'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '212':
        var buildnum = '4613'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '220':
        var buildnum = '4710'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '221':
        var buildnum = '4807'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '222':
        var buildnum = '4904'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '223':
        var buildnum = '5001'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '230':
        var buildnum = '5133'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '231':
        var buildnum = '5246'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '232':
        var buildnum = '5359'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '240':
        var buildnum = '5456'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '241':
        var buildnum = '5569'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '242':
        var buildnum = '5682'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '243':
        var buildnum = '5795'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '250':
        var buildnum = '7169'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '251':
        var buildnum = '7444'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '300':
        var buildnum = '6546'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '301':
        var buildnum = '6767'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '302':
        var buildnum = '6610'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      case '303':
        var buildnum = '6689'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
      default:
        var buildnum = '苑区选错'
        console.log(buildnum)
        this.setData({
          buildnum: buildnum,
        })
        break;
    }

    var buildnum = this.data.buildnum

    try {
      wx.setStorageSync('buildnum', buildnum)
    } catch (e) {
    }






  },

  roomnum_MultiPickerColumnChange: function (e) {
    // console.log(e)
    // this.setData({
    //   roomno:e.detail.value
    // })
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      roomNumArray: this.data.roomNumArray,
      roomnoIndex: this.data.roomnoIndex
    };
    data.roomnoIndex[e.detail.column] = e.detail.value;
    this.setData(data);


  },
  roomnum_MultiPickerChange: function (e) {
    this.setData({
      roomnoIndex: e.detail.value
    })
    var bb = '' + e.detail.value[0] + e.detail.value[1] + e.detail.value[2]  //对应的数组下标转化成数字
    console.log(bb)
    this.setData({
      roomno: bb,
    })

    try {
      wx.setStorageSync('roomno', bb)
    } catch (e) {
    }



  },


  identity: function () {           //进行身份验证函数

    var that = this
    try {
      var Student_ID = wx.getStorageSync('Student_ID')
      var identity = wx.getStorageSync('identity')
      var userInfo = wx.getStorageSync('userInfo')


      if (Student_ID && identity === '解除绑定' && userInfo) {
        // Do something with return value
        console.log('解除绑定', Student_ID)
        var user_image = userInfo.avatarUrl
        var user_name = userInfo.nickName
        // that.setData({
        //   Student_ID,
        //   user_image,
        //   user_name,

        // })
        that.submit()  //验证成功就查询
      } else {

        wx.showModal({
          title: '你未授权信息或者身份验证',
          content: '如需跳转到个人主页进行验证，请点击确认进行跳转。',
          success: function (res) {
            if (res.cancel) {
              console.log('用户点击取消')

            } else if (res.confirm) {
              wx.navigateTo({

                url: '../person/person?open=' + 'water',
              })

            }
          }
        })
      }
    } catch (e) {

    }

  },



  submit: function (e) {

    var buildnum = this.data.buildnum;
    var roomno = this.data.roomno;

    // console.log(buildnum)
    console.log(roomno)
    var page = this;





    this.setData({
      prompt: "查询中，请耐心等待！"
    })




    // 动画代码
    var option = {
      duration: 1000,
      timingFunction: "ease",
    }
    var tanimation = wx.createAnimation(option);
    var banimation = wx.createAnimation(option);
    // this.animation = tanimation;
    // this.animation = banimation;
    var Height = this.data.Height;
    var BHeight = -(this.data.BHeight);
    console.log(Height,BHeight)
    tanimation.translateY(Height).step({ duration: 500 });
    banimation.translateY(BHeight).step({ duration: 500 });
    console.log(buildnum)
    // wx.request({
    //   url: 'https://zenggenghai.cn/water_electric',
    //   data: {
    //     buildnum: buildnum,
    //     roomnum: roomno
    //   },
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/json',
    //   },
    //   success: function (res) {

    //     if(res.data[0]!=="<"){

    //       console.log(res)
    //       wx.showToast({
    //         title: '成功',
    //         icon: 'success',
    //         duration: 500
    //       })

    //       console.log(res.data);

    //       console.log(res.data[1])    //水
    //       console.log(res.data[0])    //电


    //       if (res.data[1] != "该房间号不存在！") {
    //         page.setData({
    //           water: res.data[1].toFixed(2),
    //           electric: res.data[0].toFixed(2),
    //           animationData: animation.export()
    //         })


    //       } else {

    //         wx.showToast({
    //           icon: 'none',
    //           title: '房间号不存在',
    //         })

    //         page.setData({
    //           prompt: "继续查询"
    //         })

    //       }

    //     }else{
    //       wx.showToast({
    //         title: '不在服务时间内',
    //         icon: 'none',
    //         duration: 2000
    //       })

    //       page.setData({
    //         prompt: "继续查询"
    //       })
    //     }


    //   },
    //   fail:function(res){

    //       wx.showToast({
    //         title: '系统繁忙',
    //         icon: 'none',
    //         duration: 3000
    //       })

    //     page.setData({
    //       prompt: "继续查询"
    //     })


    //   }
    // })


    wx.request({
      // url: 'https://zenggenghai.cn/WaterEleCheck/WaterEleDate.php',  buildnum roomno
      url:'https://hclab.zenggenghai.cn/getBase',
      data: '\r\n--XXX' +
        '\r\nContent-Disposition: form-data; name="roomName"' +
        '\r\n' +
        '\r\n' + roomno +
        '\r\n--XXX' +
        '\r\nContent-Disposition: form-data; name="buildingId"' +
        '\r\n' +
        '\r\n' + buildnum +
        '\r\n--XXX--',
      method: 'post',
      header: {
        'content-type': 'multipart/form-data; boundary=XXX',
      },
      success: function (res) {


        console.log(res, 'fsdfffsdjfksjdfkjsdfksjdfksjfksdjfkjkjkj')
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 500
        })

        // console.log(res.data.content.water[0][5])   //水
        // console.log(res.data.content.ele[0][5])    //电



        if (res.data.status == 200 ) {
          page.setData({
            water: res.data.content.water[0][5],
            electric: res.data.content.ele[0][5],
            animationData: tanimation.export(),
            animationDatabottom: banimation.export(),
            exhibitData:true
          })


        } else {
          if (res.data.content == '请填写房间号和建筑名'){
            wx.showToast({
              icon: 'none',
              title: '房间号不存在',
            })
          } else if (res.data.content == '爬虫错误，请联系管理员解决'){
            wx.showToast({
              icon: 'none',
              title: '查询错误，请联系管理员解决',
            })
          }
         
          page.setData({
            prompt: "继续查询"
          })

        }




      },
      fail: function (res) {
        console.log(res)

        wx.showToast({
          title: '系统繁忙',
          icon: 'none',
          duration: 3000
        })

        page.setData({
          prompt: "继续查询"
        })


      }
    })





  },


  return_logo: function () {

    var option = {
      duration: 1000,
      timingFunction: "ease",
    }
    var tanimation = wx.createAnimation(option);
    var banimation = wx.createAnimation(option);
    tanimation.translateY(0).step({ duration: 500 });
    banimation.translateY(0).step({ duration: 500 });
    this.setData({
      animationData: tanimation.export(),
      animationDatabottom: banimation.export(),
      exhibitData: false
    })
    this.setData({
      prompt: "继续查询"
    })

  },

  init_water: function (datalist, dataStream) { 
    this.waterComponnent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      chartOption(chart, datalist, dataStream)
      this.chart = chart;
      return chart;
    });
  },

  init_electric: function (datalist, dataStream) {
    this.electricComponnent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      chartOption(chart, datalist, dataStream)
      this.chart = chart;
      return chart;
    });
  },
  navbarTap: function (e) {
    console.log('点击到了')
    var that = this
    var id = e.currentTarget.dataset.idx
    this.setData({
      currentTab: id,
    })
    var list = [78, 68, 58, 48, 34, 78, 67]
    if(id===0){
      this.init_water(list, '水费');
      
    }else{
      this.init_electric(list, '电费')
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this

    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight)
        var Height = res.windowHeight * 49/ 100;
        var tmp = res.windowHeight * 11/ 100;
        
   
        var BHeight = res.windowHeight - Height-tmp;
        console.log(Height)
        that.setData({
          Height: Height,
          BHeight: BHeight
        })
      }
    });
    var that = this
    var context = wx.createCanvasContext('textA')

    this.waterComponnent = this.selectComponent('#mychart_water');
    this.electricComponnent = this.selectComponent('#mychart_electric');
    var list = [78, 68, 58, 48, 34, 78, 67]
    this.init_water(list, '水费');
    this.init_electric(list, '电费')

    wx.getStorage({
      key: 'roomno',
      success: function (res) {
        that.setData({
          roomno: res.data,
        })
        console.log(res.data)
      }
    })

    wx.getStorage({
      key: 'data',
      success: function (res) {
        that.setData({
          multiArray: res.data.multiArray,
          multiIndex: res.data.multiIndex
        })
        console.log(res.data)
      }
    })



    wx.getStorage({
      key: 'buildnum',
      success: function (res) {
        if (res.data === '4392') {       //丁香f栋被value纠正，同时清楚使用过的用户本地缓存
          that.setData({
            buildnum: '4492',
          })
        } else {
          that.setData({
            buildnum: res.data,
          })
        }

        console.log(res.data)
      }
    })





    // Fill with gradient


    this.wxCanvas = new wxDraw(context, 0, 0, 140, 100);

    /**
     * 由于 小程序没有Dom 操作，所以没法获取canvas高度以及绘图的起点
     * 所以 wxDraw初始化的时候 需要设置 以便点击检测的时候使用
    */

    let text7 = new Shape('text', { text: "全", x: 16, y: 100, fontSize: 10, fillStyle: "#4285f4" }, 'fill', false)
    let text8 = new Shape('text', { text: "媒", x: 32, y: 100, fontSize: 10, fillStyle: "#ea4335" }, 'fill', false)
    let text9 = new Shape('text', { text: "体", x: 48, y: 100, fontSize: 10, fillStyle: "#fbbc05" }, 'fill', false)
    let text10 = new Shape('text', { text: "中", x: 64, y: 100, fontSize: 10, fillStyle: "#4285f4" }, 'fill', false)
    let text11 = new Shape('text', { text: "心", x: 80, y: 100, fontSize: 10, fillStyle: "#34a853" }, 'fill', false)
    // let text6 = new Shape('text', { text: "室", x: 96, y: 100, fontSize: 10, fillStyle: "#ea4335" }, 'fill', false)

    let text = new Shape('text', { text: "&", x: 96, y: 100, fontSize: 10, fillStyle: "#4285f4" }, 'fill', false)
    let text2 = new Shape('text', { text: "环", x: 112, y: 100, fontSize: 10, fillStyle: "#ea4335" }, 'fill', false)
    let text3 = new Shape('text', { text: "创", x: 128, y: 100, fontSize: 10, fillStyle: "#fbbc05" }, 'fill', false)
    let text4 = new Shape('text', { text: "工", x: 144, y: 100, fontSize: 10, fillStyle: "#4285f4" }, 'fill', false)
    let text5 = new Shape('text', { text: "作", x: 160, y: 100, fontSize: 10, fillStyle: "#34a853" }, 'fill', false)
    let text6 = new Shape('text', { text: "室", x: 175, y: 100, fontSize: 10, fillStyle: "#ea4335" }, 'fill', false)




    this.wxCanvas.add(text);
    this.wxCanvas.add(text2);
    this.wxCanvas.add(text3);
    this.wxCanvas.add(text4);
    this.wxCanvas.add(text5);
    this.wxCanvas.add(text6);

    this.wxCanvas.add(text7);
    this.wxCanvas.add(text8);
    this.wxCanvas.add(text9);
    this.wxCanvas.add(text10);
    this.wxCanvas.add(text11);

    // this.wxCanvas.add(text6);




    setTimeout(function () {
      text7.animate({ y: "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 0);


    setTimeout(function () {

      text8.animate({ y: "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 50);


    setTimeout(function () {
      text9.animate({ y: "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 100);

    setTimeout(function () {
      text10.animate({ y: "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 150);

    setTimeout(function () {
      text11.animate({ y: "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 200);


    setTimeout(function () {
      text.animate({ y: "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 250);


    setTimeout(function () {

      text2.animate({ y: "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 300);


    setTimeout(function () {
      text3.animate({ y: "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 350);

    setTimeout(function () {
      text4.animate({ y: "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 400);

    setTimeout(function () {
      text5.animate({ y: "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 450);

    setTimeout(function () {
      text6.animate({ y: "-=10" }, { easing: "swingTo", duration: 1000 }).animate({ "y": "+=10" }, { easing: "swingFrom", duration: 1000 }).start(true);
    }, 500);







    // 页导航条标题

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
    this.wxCanvas.clear(); //推荐这个
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

  },

  bindtouchstart: function (e) {
    // 检测手指点击事件
    // console.log(e);
    this.wxCanvas.touchstartDetect(e);

  },
  bindtouchmove: function (e) {
    // 检测手指点击 之后的移动事件
    this.wxCanvas.touchmoveDetect(e);
  },
  bindtouchend: function () {
    //检测手指点击 移出事件
    this.wxCanvas.touchendDetect();
  },
  bindtap: function (e) {
    this.wxCanvas.tapDetect(e);
  },
  bindlongpress: function (e) {
    // console.log(e);
    this.wxCanvas.longpressDetect(e);
  }


})