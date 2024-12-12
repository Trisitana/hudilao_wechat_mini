// pages/login/login.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      account: "",
      password:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      wx.hideHomeButton({})//测试时关闭
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    accountHandler(e){
      this.setData({
        account: e.detail.value
      })
    },
    passwordHandler(e){
      this.setData({
        password: e.detail.value
      })
    },
    loginRequest(){
      wx.request({
        url: 'http://'+app.globalData.baseurl+':8082/api/waiter/login?number='+this.data.account+'&password='+this.data.password,
        method:"POST",
        success: (res) => {
          console.log(res)
          if(res.data.code==404)
          {
            wx.showToast({
              title: '密码错误',
              icon: 'error',
              duration: 2000
            })
          }
          if(res.data.code==200){
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000,
            })
            setTimeout(function(){
              wx.switchTab({
                url: '/pages/orders/orders',
              })
            },2000)
            
          }
        },
      })
        
    }
})