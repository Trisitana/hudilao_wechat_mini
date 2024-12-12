// pages/mine/mine.js
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
      icon:"",
      nickname:"",
      birthday:"",
      phonenumber: "",
      ranks: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      wx.setNavigationBarTitle({
        title: '个人中心',
      })
      //请求基础的个人信息
      wx.request({
        url: 'http://'+app.globalData.baseurl+':8082/api/customer/personal',
        method:"GET",
        data:{
          phonenumber:app.globalData.phonenumber
        },
        success:(res)=>{
          console.log(res.data)
          this.setData({
            phonenumber:res.data.phonenumber,
            icon:res.data.data.icon,
            nickname:res.data.data.nickname,
            ranks:res.data.data.ranks
          })
          //更新全局数据，便于其他页面调用
          app.globalData.tableid=res.data.data.tableid
          app.globalData.nickname=res.data.data.nickname
          app.globalData.icon=res.data.data.icon
          app.globalData.ranks=res.data.data.ranks
        },
        complete:()=>{
          
        }
      })
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
    //获取个人信息接口
    askMyMessage(){
      wx.request({
        url: 'http://'+app.globalData.baseurl+':8082/api/custom/personal',
        method:"GET",
        data:{
          phonenumber:app.globalData.phonenumber
        },
        success:(res)=>{
          console.log(res.data)
          this.setData({
            phonenumber:res.data.phonenumber,
            icon:res.data.data.icon,
            nickname:res.data.data.nickname,
            ranks:res.data.data.ranks
          })
          app.globalData.tableid=res.data.data.tableid
          app.globalData.nickname=res.data.data.nickname
          app.globalData.icon=res.data.data.icon
          app.globalData.ranks=res.data.data.ranks
        },
        complete:()=>{
          
        }
      })
    },
    //跳转到关于我们
    toAbout(){
      wx.navigateTo({
          url: '/pages/about/about',
        })
  },
    //跳转到个人资料
    toPersonal(){
        wx.navigateTo({
            url: '/pages/personal/personal',
          })
    },
    //跳转到心愿单
    toWishList(){
        wx.navigateTo({
          url: '/pages/wish/wish',
        })
    },
    //跳转到我的订单
    toOrder(){
        wx.navigateTo({
          url: '/pages/orders/orders',
        })
    },
    //跳转到会员中心
    toVip(){
      wx.navigateTo({
        url: '/pages/vip/vip',
      })
  }
})