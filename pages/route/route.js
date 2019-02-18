// pages/route/route.js

const amapFile = require('../../utils/amap-wx.js');
const myAmapFun = new amapFile.AMapWX({ key: 'eeef012afe4c956d0d38fd3a132fb267' });
const util = require('../../utils/util.js');
const appData = getApp().globalData;



const date = new Date();
const curYear = date.getFullYear()
const curMonth = date.getMonth()
const curDay = date.getDate()-1
const curHour = date.getHours() 
const curMinute = date.getMinutes() 

const years = [];
const months = [];
const days = [];
const hours = [];
const minutes = [];

//时间换算
function timeStamp(StatusMinute) {
  var day = parseInt(StatusMinute / 60 / 24);
  var hour = parseInt(StatusMinute / 60 % 24);
  var min = parseInt(StatusMinute % 60);
  StatusMinute = "";
  if (day > 0) {
    StatusMinute = day + "天";
  }
  if (hour > 0) {
    StatusMinute += hour + "小时";
  }
  if (min > 0) {
    StatusMinute += parseFloat(min) + "分钟";
  }
  return StatusMinute;

}


//获取年
for (let i = 2018; i <= date.getFullYear() + 5; i++) {
  years.push("" + i + "年");
}
//获取月份

for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  months.push("" + i + "月");
}
//获取日期
for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  days.push("" + i + "日");
}
//获取小时
for (let i = 0; i < 24; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  hours.push("" + i + "时");
}
//获取分钟
for (let i = 0; i < 60; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  minutes.push("" + i + "分");
}


Page({
  data: {
    sendData:'',
    toolData: [
      { tool: "驾车", way: "goToCar", post:"driving"}, 
      { tool: "公交", way: "goToBus", post: "transit/integrated"}, 
      { tool: "步行", way: "goToWalk", post: "walking" }, 
      { tool: "骑行", way: "goToRide", post: "bicycling" }
    ],
    _num:0,
    showbus:false,
    markers: '',
    threeRouteData:'',
    transits: [],
    polyline: [],
    style:'',
    hasBusRoute:true,
    time: '现在出发',
    recommend: "最快捷（推荐）",
    dateArray: [years, months, days, hours, minutes],
    dateIndex: [curYear, curMonth, curDay, curHour, curMinute],
    recommedArray:['最快捷（推荐）','最经济','少换乘','少步行','不做地铁'],
    recommedIndex:"0",
    timeFilter:'',
    strategyFilter:0,

  },
  onLoad: function (options) {
    //console.log(options)
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    this.setData({
      sendData: options,
      markers: [{
        iconPath: "../../image/startpoint.png",
        id: 0,
        latitude: options.startPoint.split(",")[1],
        longitude: options.startPoint.split(",")[0],
        width: 23,
        height: 33
      }, {
        iconPath: "../../image/endpoint.png",
        id: 0,
        latitude: options.endPoint.split(",")[1],
        longitude: options.endPoint.split(",")[0],
        width: 24,
        height: 34
      }],

    })

  //   获取wxml文本数据
  //   wx.setNavigationBarTitle({
  //     title: e._relatedInfo.anchorRelatedText+'-路线'  
  //   })

    switch (parseInt(options.ways)) {
      case 0:
        that.goToCar();
        break;
      case 1:
        that.goToBus();
        break;
      case 2:
        that.goToWalk();
        break;
      case 3:
        that.goToRide();

    }
    
  },

  goDetail: function (e) {

    var postTool = this.data.toolData[this.data._num].post;

      wx.navigateTo({
        url: '../detail/detail?post=' + postTool + '&origin=' + this.data.sendData.startPoint + '&destination=' + this.data.sendData.endPoint + '&startName=' + this.data.sendData.startName + '&sitename=' + this.data.sendData.endName + '&num=' + e.currentTarget.dataset.num + '&showbus=' + this.data.showbus
      })

  },


  goToCar: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      showbus: false,
      _num: 0,

    })
    wx.setNavigationBarTitle({
      title: '驾车-路线'
    })
    var that = this;
    myAmapFun.getDrivingRoute({
      origin: this.data.sendData.startPoint,
      destination: this.data.sendData.endPoint,
      success: function (data) {
        wx.hideLoading()
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }

        data.paths[0].duration = timeStamp(parseInt(data.paths[0].duration / 60))

        if (data.paths[0].distance < 1000) {
          data.paths[0].distance = data.paths[0].distance + "米"

        } else {
          data.paths[0].distance = (data.paths[0].distance / 1000).toFixed(1) + "公里"

        }

        data.paths[0].taxi_cost = parseInt(data.taxi_cost)

        that.setData({
          style: '',
          threeRouteData: data.paths[0],
          polyline: [{
            points: points,
            color: "#4fba39",
            width: 8,
            arrowLine: true,
          }]
        });

      },
      fail: function (info) {

      }
    })



  },
  busRouteData: function ( date, time, strategy ){
    wx.showLoading({
      title: '加载中',
    })
    
    var that = this
    myAmapFun.getTransitRoute({
      origin: this.data.sendData.startPoint,
      destination: this.data.sendData.endPoint,
      city: appData.mapInfo.regeocodeData.addressComponent.province,
      date: date,
      time: time,
      strategy: strategy,
      success: function (data) {
        wx.hideLoading()
        //console.log(data.transits)
        if (data.transits != '') {
          var transits = data.transits;
          for (var i = 0; i < transits.length; i++) {
            var segments = transits[i].segments;
            transits[i].transport = [];
            for (var j = 0; j < segments.length; j++) {
              if (segments[j].bus && segments[j].bus.buslines && segments[j].bus.buslines[0] && segments[j].bus.buslines[0].name) {
                var name = segments[j].bus.buslines[0].name
                if (j !== 0) {
                  name = '--' + name;
                }
                transits[i].transport.push(name);
              }
            }

            if (transits[i].walking_distance < 1000) {
              transits[i].walking_distance = transits[i].walking_distance + "米"

            } else {
              transits[i].walking_distance = (transits[i].walking_distance / 1000).toFixed(1) + "公里"

            }

            if (transits[i].distance < 1000) {
              transits[i].distance = transits[i].distance + "米"

            } else {
              transits[i].distance = (transits[i].distance / 1000).toFixed(1) + "公里"

            }

            transits[i].cost = parseInt(transits[i].cost)

            transits[i].duration = timeStamp(parseInt(transits[i].duration / 60))



            for (var j = 0; j < transits[i].transport.length; j++) {

              if (j > 0) {
                transits[i].transport[j] = transits[i].transport[j].split('(')[0].substring(2)


              } else {
                transits[i].transport[j] = transits[i].transport[j].split('(')[0]

              }

            }

          }
          
          that.setData({
            transits: transits,
            hasBusRoute: true
          });

        }else{
          that.setData({
            hasBusRoute:false

          })

        }

      },
      fail: function (info) {

      }
    })

  },

  goToBus: function (e) {

    this.setData({
      showbus: true,
      _num: 1,

    })
    wx.setNavigationBarTitle({
      title: '公交-路线'
    })
    this.busRouteData(this.data.timeFilter[0], this.data.timeFilter[1],this.data.strategyFilter);
    

  },

  goToWalk: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    wx.setNavigationBarTitle({
      title: '步行-路线'
    })
    this.setData({
      showbus: false,
      _num: 2,

    })
    var that = this;
    
    myAmapFun.getWalkingRoute({
      origin: this.data.sendData.startPoint,
      destination: this.data.sendData.endPoint,
      success: function (data) {
        wx.hideLoading()
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }

        data.paths[0].duration = timeStamp(parseInt(data.paths[0].duration / 60))

        if (data.paths[0].distance < 1000) {
          data.paths[0].distance = data.paths[0].distance + "米"

        } else {
          data.paths[0].distance = (data.paths[0].distance / 1000).toFixed(1) + "公里"

        }

        that.setData({
          style:'18px auto',
          threeRouteData: data.paths[0],
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 8,
            arrowLine: true,
          }]
        });

      },
      fail: function (info) {

      }
    })

  },

  goToRide: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    wx.setNavigationBarTitle({
      title: '骑行-路线'
    })
    this.setData({
      showbus: false,
      _num: 3,

    })
    var that = this;

    myAmapFun.getRidingRoute({
      origin: this.data.sendData.startPoint,
      destination: this.data.sendData.endPoint,
      success: function (data) {
        wx.hideLoading()
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        data.paths[0].duration = timeStamp(parseInt(data.paths[0].duration / 60))

        if (data.paths[0].distance < 1000) {
          data.paths[0].distance = data.paths[0].distance + "米"

        } else {
          data.paths[0].distance = (data.paths[0].distance / 1000).toFixed(1) + "公里"

        }


        that.setData({
          style: '18px auto',
          threeRouteData: data.paths[0],
          polyline: [{
            points: points,
            color: "#44adfc",
            width: 8,
            arrowLine: true,
          }]
        });

      },
      fail: function (info) {

      }
    })
  },

  //获取时间日期
  bindDateChange: function (e) {

    this.setData({
      dateIndex: e.detail.value
    })
    const index = this.data.dateIndex;
    const year = parseInt(this.data.dateArray[0][index[0]]);
    const month = parseInt(this.data.dateArray[1][index[1]]);
    const day = parseInt(this.data.dateArray[2][index[2]]);
    const hour = parseInt(this.data.dateArray[3][index[3]]);
    const minute = parseInt(this.data.dateArray[4][index[4]]);
    var Aminute = '';

    if (minute < 10) {
      Aminute = "0" + minute;
    }else{
      Aminute = minute;

    }

    this.setData({
      time: year + '/' + month + '/' + day + ' ' + hour + ':' + Aminute,
      timeFilter: [year + '-' + month + '-' + day, hour + ':' + Aminute]
    })
    
    this.busRouteData(this.data.timeFilter[0], this.data.timeFilter[1], this.data.strategyFilter);
  },
  
  //获取推荐路线
  bindRecommedChange:function(e){
    const index = e.detail.value
    const curRecommend = this.data.recommedArray
    if(index == 4){
      index == 5
      this.setData({
        recommendIndex: e.detail.value,
        recommend: curRecommend[index],
        strategyFilter: index
      })
    }else{
      this.setData({
        recommendIndex: e.detail.value,
        recommend: curRecommend[index],
        strategyFilter: index
      })

    }
    

    this.busRouteData(this.data.timeFilter[0], this.data.timeFilter[1], this.data.strategyFilter);
    
  },

  chooseStartPoint: function(){
    var that = this
    wx.chooseLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success(res) {

        if(res.name != ''){
          that.setData({
            sendData: {
              startName: res.name,
              startPoint: res.longitude + ',' + res.latitude,
              endName: that.data.sendData.endName,
              endPoint: that.data.sendData.endPoint
            },
            markers: [{
              iconPath: "../../image/startpoint.png",
              id: 0,
              latitude: res.latitude,
              longitude: res.longitude,
              width: 23,
              height: 33
            }, {
              iconPath: "../../image/endpoint.png",
              id: 0,
              latitude: that.data.sendData.endPoint.split(",")[1],
              longitude: that.data.sendData.endPoint.split(",")[0],
              width: 24,
              height: 34
            }],

          })

        }else{
          wx.showToast({
            title: '请选择正确的地址',
            icon: 'none',
            duration: 1500
          })

        }

        switch (that.data._num) {
          case 0:
            that.goToCar();
            break;
          case 1:
            that.goToBus();
            break;
          case 2:
            that.goToWalk();
            break;
          case 3:
            that.goToRide();

        }

      }
    })

  },
  chooseEndPoint: function(){
    var that = this
    wx.chooseLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success(res) {
        
        if (res.name != '') {
          that.setData({
            sendData: {
              startName: that.data.sendData.startName,
              startPoint: that.data.sendData.startPoint,
              endName: res.name,
              endPoint: res.longitude + ',' + res.latitude,
            },
            markers: [{
              iconPath: "../../image/startpoint.png",
              id: 0,
              latitude: that.data.sendData.startPoint.split(",")[1],
              longitude: that.data.sendData.startPoint.split(",")[0],
              width: 23,
              height: 33
            }, {
              iconPath: "../../image/endpoint.png",
              id: 0,
              latitude: res.latitude,
              longitude: res.longitude,
              width: 24,
              height: 34
            }],

          })

        }else{
          wx.showToast({
            title: '请选择正确的地址',
            icon: 'none',
            duration: 1500
          })

        }

        switch (that.data._num) {
          case 0:
            that.goToCar();
            break;
          case 1:
            that.goToBus();
            break;
          case 2:
            that.goToWalk();
            break;
          case 3:
            that.goToRide();

        }

      }
    })

  }


})