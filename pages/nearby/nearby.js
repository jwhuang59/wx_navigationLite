// pages/near/near.js

const appData = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tips: [],
    keywords:"",
    page:0,
    point:"",
    siteName:'我的位置',
    toBottom:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    wx.setNavigationBarTitle({
      title: options.keywords
    })

    var that = this;

    this.setData({
      point: appData.mapInfo.longitude + "," + appData.mapInfo.latitude,
      keywords: options.keywords

    })

    this.getDataFunc();


  },

  onReachBottom: function (e) {

    this.getDataFunc();

  },


  getDataFunc: function(){
    wx.showLoading({
      title: '加载中',
    })

    var that = this
    var loadData = this.data.tips
    wx.request({
      url: appData.mapApi + 'place/around',
      data: {
        key: 'e96f52f2aaa72ccfcddae396c0293794',
        location: that.data.point,
        keywords: that.data.keywords,
        page: that.data.page + 1

      },
      success: function (res) {
        
        wx.hideLoading()

        if(res.data.count != 0){

          for (var i = 0; i < res.data.pois.length; i++) {
            loadData.push(res.data.pois[i])

          }

          that.setData({
            tips: loadData,
            page: that.data.page + 1

          })
          console.log(loadData)
        }else{
          that.setData({
            toBottom:true

          })

        }
      }

    })

  },

  updatePoint: function(){
    var that =this
    wx.chooseLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success(res) {
        //console.log(res)

        that.setData({
          siteName:res.name,
          point: res.longitude + ',' + res.latitude

        })

        wx.request({
          url: appData.mapApi + 'place/around',
          data: {
            key: 'e96f52f2aaa72ccfcddae396c0293794',
            location: that.data.point,
            keywords: that.data.keywords,
            page: 1

          },
          success: function (res) {

            that.setData({
              tips: res.data.pois,
              page: 1

            })

          }

        })
        
      }
    })

  },
  writeHistory:function(res){
    var _num = res.currentTarget.dataset.num
    var writeData = (this.data.tips)[_num]
    var endImg = writeData.photos == "" ? "" : writeData.photos[0].url
    if (appData.history != '') {
      var part = [];

      for (let i = 0; i < appData.history.length; i++) {

        part.push(appData.history[i].endPoint)
        
      }
      if (part.indexOf(writeData.location) === -1) {
        
        appData.history.unshift({
          name: writeData.name,
          img: endImg,
          address: writeData.cityname + writeData.adname + writeData.address,
          startPoint: this.data.point,
          endPoint: writeData.location
        })

      }

    } else {
      appData.history.unshift({
        name: writeData.name,
        img: endImg,
        address: writeData.cityname + writeData.adname + writeData.address,
        startPoint: this.data.point,
        endPoint: writeData.location
      })

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
  // onReachBottom: function () {
  
  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
