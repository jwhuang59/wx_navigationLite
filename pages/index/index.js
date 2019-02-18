// pages/maps.js

const amapFile = require('../../utils/amap-wx.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tips:{},
    mapMsg: "",
    weatherMsg: "",
    iconPath:"../../image/location.png",

  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
 
    var that = this;
    var myAmapFun = new amapFile.AMapWX({ key: 'eeef012afe4c956d0d38fd3a132fb267' });
    myAmapFun.getRegeo({
      success: function (data) {
        //console.log(data[0])
        getApp().globalData.mapInfo = data[0]
        that.setData({
          mapMsg: data[0]
        });
      },
      fail: function (info) {
        
        console.log(info)
      }
    });
    myAmapFun.getWeather({
      success: function (data) {
        that.setData({
          weatherMsg: data.liveData
        });
      },
      fail: function (info) {
        
        console.log(info)
      }
    })

   },

  bindInput: function (e) {
    var that = this;
    var keywords = e.detail.value;
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: 'eeef012afe4c956d0d38fd3a132fb267' });
    myAmapFun.getInputtips({
      keywords: keywords,
      location: '',
      success: function (data) {
        if (data && data.tips) {
          that.setData({
            tips: data.tips
          });
        }

      }
    })
  },
  bindSearch: function (e) {

    wx.navigateTo({
      url: '../search/search'
    })

  },
  toAdmin:function(){
    wx.navigateTo({
      url: '../admin/admin'
    })

  },
  toLocation:function(){
    this.mapCtx.moveToLocation()


  },
  toLoadline:function(){
    wx.navigateTo({
      url: '../navigation/navigation?startPoint=' + this.data.mapMsg.longitude + ',' + this.data.mapMsg.latitude +'&startName=我的位置'
    })

  },


  onReady: function () {
    
    this.mapCtx = wx.createMapContext('myMap')
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
    return {
      title: '导航lite，地图导航、路线导航、公交地铁换乘方案',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 1000
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享取消',
          icon: 'success',
          duration: 1000
        })
      }
    }
  }
})