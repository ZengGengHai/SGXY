const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


//时间戳转换成日期时间
function js_date_time(unixtime) {
  var dateTime = new Date(parseInt(unixtime) * 1000)
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  var minute = dateTime.getMinutes();
  if (minute < 10) { var minute = "0" + minute}
  var second = dateTime.getSeconds();
  var now = new Date();
  var now_new = Date.parse(now.toDateString());  //typescript转换写法
  var milliseconds = now_new - dateTime;
  var timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
  return timeSpanStr;
}





function diaplayTime(unixtime) {


   var dateTime = new Date(parseInt(unixtime) * 1000)
   var year = dateTime.getFullYear();
   var month = dateTime.getMonth() + 1;
   var day = dateTime.getDate();
   var hour = dateTime.getHours();
   var minute = dateTime.getMinutes();
   if (minute < 10) { var minute = "0" + minute }
   var second = dateTime.getSeconds();

    var timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;

   var now = new Date();                   //当前时间
   var now_year=now.getFullYear()
   var now_month = now.getMonth() + 1;
   var now_day = now.getDate();
   var now_hour = now.getHours();
   var now_minute = now.getMinutes();

   

  if (now_year === year){
    if (now_month - month>0){
      return timeSpanStr;
    } else if (now_day - day>0){
      console.log(now_day - day)
      if (now_day - day<7){
        return "" + parseInt(now_day - day) + "天前 ";
      } else if ((now_day - day )/7>0){
        return "" + parseInt((now_day - day) / 7) + "周前 ";
      }else{
        return timeSpanStr;
      }
    }else if (now_hour-hour>0){
      return "" + parseInt(now_hour - hour) + "小时前 ";
    } else if (now_minute-minute>0){
      return "" + parseInt(now_minute - minute) + "分钟前 ";
    }else {
      return '刚刚 '
    }
  

  }else{
    return timeSpanStr;
  }

  console.log(now_year,now_month,now_day,now_hour,now_minute)

 

 
 
  //  var now_new = Date.parse(now.toDateString());  //typescript转换写法
  //  var milliseconds = now_new - dateTime;
 
 
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

//防止在短工时间内时间被点击多次
function buttonClicked(self) {
  self.setData({
    buttonClicked: true
  })

  setTimeout(function () {
    self.setData({
      buttonClicked: false
    })
  }, 1500)

}

function errImgFun(e, that) {
  var _errImg = e.target.dataset.errImg;
  var _errObj = {};
  _errObj[_errImg] = 'https://cloud-minapp-13676.cloud.ifanrusercontent.com/1hAb7nMldY1pcQWV.png';
  console.log(e.detail.errMsg + "----" + "----" + _errImg);
  that.setData(_errObj);
}


module.exports = { formatTime, showBusy, showSuccess, showModel, js_date_time, buttonClicked, diaplayTime, errImgFun: errImgFun }

// 是否为空对象

