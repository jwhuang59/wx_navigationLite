// pages/site/site.js
const appData = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    siteData:"",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      siteData: options

    })

    wx.setNavigationBarTitle({
      title: options.endName
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  returnIndex:function(){
    wx.reLaunch({

      url: '../index/index',

    });

  },
  writeHistory: function(){
    //历史纪录
    if (appData.history != ''){
      var part = [];

      for (let i = 0; i < appData.history.length; i++) {
        
        part.push(appData.history[i].endPoint)

      }
      if (part.indexOf(this.data.siteData.endPoint) === -1) {

        appData.history.unshift({
          name: this.data.siteData.endName,
          img: this.data.siteData.siteimg,
          address: this.data.siteData.siteaddress,
          startPoint: this.data.siteData.startPoint,
          endPoint: this.data.siteData.endPoint
        })

      } 

    }else{
      appData.history.unshift({
        name: this.data.siteData.endName,
        img: this.data.siteData.siteimg,
        address: this.data.siteData.siteaddress,
        startPoint: this.data.siteData.startPoint,
        endPoint: this.data.siteData.endPoint

      })

    }

    
  },


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
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
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