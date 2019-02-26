// pages/admin/admin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  clearStorage: function () {

    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否清除缓存',
      success(res) {
        if (res.confirm) {
          wx.clearStorage({

            success: function () {

              wx.showToast({
                title: '清除完成',
                icon: 'success',
                duration: 1000
              })
            }

          });
        } else if (res.cancel) {
          wx.hideToast()
        }
      }
    })

  },
  toCollect:function(){
    wx.navigateTo({
      url: '../collect/collect',
    })

  },
  previewImage: function(){
    wx.previewImage({
      current:'https://lg-rk9m0gnc-1252523178.cos.ap-shanghai.myqcloud.com/0.jpg', // 当前显示图片的http链接
      urls: ['https://lg-rk9m0gnc-1252523178.cos.ap-shanghai.myqcloud.com/0.jpg'] // 需要预览的图片http链接列表
    })

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
