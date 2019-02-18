// pages/search/search.js

const appData = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tips:"",
    keywords:"",
    hasInput:true,
    hasHistory:true,
    historyData:'',
    menu: [
      { nameEn: "food", nameCn: "美食" },
      { nameEn: "hotel", nameCn: "酒店" }, 
      { nameEn: "spot", nameCn: "景点" }, 
      { nameEn: "bank", nameCn: "银行" },
      { nameEn: "movie", nameCn: "电影院" }, 
      { nameEn: "metro", nameCn: "地铁" }, 
      { nameEn: "transit", nameCn: "公交" },
      { nameEn: "supermarket", nameCn: "超市" },
      { nameEn: "bathing", nameCn: "洗浴" },
      { nameEn: "more", nameCn: "更多" }
    ],
    location:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  bindInput: function (e) {
    var that = this;
    var keywords = e.detail.value;
    
    if (keywords != ""){
      
        wx.request({
          url: appData.mapApi + "place/around?key=e96f52f2aaa72ccfcddae396c0293794&keywords=" + keywords + "&location=" + appData.mapInfo.latitude + "," + appData.mapInfo.longitude,
          success: function (data) {
            
            var points=[];
            
            for (var i = 0; i < data.data.pois.length;i++){
              points.push({
                longitude: data.data.pois[i].location.split(",")[0],
                latitude: data.data.pois[i].location.split(",")[1]

              })
              data.data.pois[i].location = points[i]
            }

            that.setData({
              tips: data.data.pois,
              keywords: keywords,
              hasInput: false,

            })

          }
        })

    }else{
      
      setTimeout(function () {
        that.setData({
          keywords:"",
          tips: "",
          hasInput:true,

        })
      }, 500);
    }

  },
  bindSubmit: function () {
    if (this.data.keywords != ''){
      wx.navigateTo({
        url: '../nearby/nearby?keywords=' + this.data.keywords,

      })
      if (appData.history.indexOf(this.data.keywords) === -1 ){
        appData.history.unshift(this.data.keywords)

      }
      

    }else{
      wx.showToast({
        title: '搜索字段不能为空',
        icon: 'none',
        duration: 1500
      })

    }

  },
  emptyHistory: function(){
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否清空历史纪录',
      success(res) {
        if (res.confirm) {
          that.setData({
            historyData:'',
            hasHistory:false
          })
          appData.history = [];
        } else if (res.cancel) {
          
        }
      }
    })

    

  },
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    if (appData.history != '') {
      this.setData({
        hasHistory: true,

      })

    } else {
      this.setData({
        hasHistory: false,

      })

    }
    this.setData({
      location: appData.mapInfo.longitude + "," + appData.mapInfo.latitude,
      historyData: appData.history
    })
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