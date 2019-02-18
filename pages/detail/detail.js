// pages/detail/detail.js

const amapFile = require('../../utils/amap-wx.js');
const appData = getApp().globalData;

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


Page({

  /**
   * 页面的初始数据
   */
  data: {
    getDetail:'',
    showBus:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var num = options.num
    if (options.showbus == 'true') {
      
      wx.request({
        url: 'https://restapi.amap.com/v3/direction/' + options.post,
        data: {
          key: 'e96f52f2aaa72ccfcddae396c0293794',
          origin: options.origin,
          destination: options.destination,
          city: appData.mapInfo.regeocodeData.addressComponent.province,

        },
        success: function (res) {
          wx.hideLoading()
          var segments = res.data.route.transits[num].segments

          for (var i = 0; i < segments.length; i++) {
            if (segments[i].entrance.name) {
              segments[i].entrance.name = segments[i].entrance.name + '进站'


            }
            if (segments[i].exit.name) {

              segments[i].exit.name = segments[i].exit.name + '出站'

            }
            if (segments[i].walking != '') {

              if (segments[i].bus.buslines != '') {
                segments[i].walkingDistance = '步行' + segments[i].walking.distance + '米到达' + segments[i].bus.buslines[0].departure_stop.name + '，约' + parseInt(segments[i].walking.duration / 60) + '分钟'

              } else {
                segments[i].walkingDistance0 = '步行' + segments[i].walking.distance + '米' + '，约' + parseInt(segments[i].walking.duration / 60) + '分钟'

              }


            }

            if (segments[i].bus.buslines != '') {

              segments[i].distance = parseInt(segments[i].bus.buslines[0].distance / 1000).toFixed(1) + '公里'
              segments[i].duration = parseInt(segments[i].bus.buslines[0].duration / 60).toFixed(0) + '分钟'

            }


          }

          res.data.route.transits[num].duration = timeStamp(parseInt(res.data.route.transits[num].duration / 60))

          if (res.data.route.transits[num].distance < 1000) {
            res.data.route.transits[num].distance = res.data.route.transits[num].distance + "米"

          } else {
            res.data.route.transits[num].distance = (res.data.route.transits[num].distance / 1000).toFixed(1) + "公里"

          }

          var busData = [];
          busData.push(res.data.route.transits[num])
          busData.push({
            taxi_cost: '花费' + parseInt(res.data.route.transits[num].cost) + '元',
            sitename: options.sitename,
            startName: options.startName,
          })
          //console.log(busData)
          that.setData({
            getDetail: busData,
            showBus: options.showbus

          })

        }
      })


    }else{
      
      if (options.post == 'bicycling') {

        wx.request({
          url: 'https://restapi.amap.com/v4/direction/' + options.post,
          data: {
            key: 'e96f52f2aaa72ccfcddae396c0293794',
            origin: options.origin,
            destination: options.destination

          },
          success: function (res) {
            wx.hideLoading()
            res.data.data.paths[0].duration = timeStamp(parseInt(res.data.data.paths[0].duration / 60))

            if (res.data.data.paths[0].distance < 1000) {
              res.data.data.paths[0].distance = res.data.data.paths[0].distance + "米"

            } else {
              res.data.data.paths[0].distance = (res.data.data.paths[0].distance / 1000).toFixed(1) + "公里"

            }


            res.data.data.paths.push({

              sitename: options.sitename,
              taxi_cost: '',
              startName: options.startName,

            })

            that.setData({
              getDetail: res.data.data.paths,
              hasBus: options.post,

            })


          },
          fail: function (res) {
            console.log(res)

          },

        })

      } else {


        wx.request({
          url: 'https://restapi.amap.com/v3/direction/' + options.post,
          data: {
            key: 'e96f52f2aaa72ccfcddae396c0293794',
            origin: options.origin,
            destination: options.destination

          },
          success: function (res) {
            wx.hideLoading()

            res.data.route.paths[0].duration = timeStamp(parseInt(res.data.route.paths[0].duration / 60))



            if (res.data.route.paths[0].distance < 1000) {
              res.data.route.paths[0].distance = res.data.route.paths[0].distance + "米"

            } else {
              res.data.route.paths[0].distance = (res.data.route.paths[0].distance / 1000).toFixed(1) + "公里"

            }

            var total = 0;
            if (options.post == 'driving') {
              for (var i = 0; i < res.data.route.paths[0].steps.length; i++) {
                total += parseInt(res.data.route.paths[0].steps[i].tolls)

              }

              total = '过路费' + total + '元'
            } else {

              total = ''


            }

            res.data.route.paths.push({
              sitename: options.sitename,
              taxi_cost: total,
              startName: options.startName,

            })

            that.setData({
              getDetail: res.data.route.paths

            })
            console.log(res.data.route.paths)

          },
          fail: function (res) {
            console.log(res)

          },

        })

      }
      
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
  onShareAppMessage: function () {

  }
})