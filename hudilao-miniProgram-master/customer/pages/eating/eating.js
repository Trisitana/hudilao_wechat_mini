// pages/eating/eating.js
const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      noworders:[],
      isNow:true,
      page: 1,
      pagesize: 5,
      total:0,
      tableid:0,
      totalprice:0,
      havePaid:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      wx.setNavigationBarTitle({
        title: '用餐愉快',
      })
      
      this.getCurrent()
      wx.showLoading({
        title: '订单加载中',
        duration:1000,
      })
      //判断订单是否已支付
      console.log(111)
      
      
      
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
    backHome(){
      wx.switchTab({
        url: '/pages/home/home',
      })
    },
    //获取当前订单
    getCurrent(){
      //获取当前订单
      wx.request({
        url: 'http://'+app.globalData.baseurl+':8082/api/customer/current/order',
        method:"GET",
        data:{
          phonenumber:app.globalData.phonenumber,
        },
        success:(res)=>{
          console.log(res.data)
          this.setData({
            noworders: res.data.data,
            tableid:app.globalData.tableid,
          })
          console.log(this.data.noworders[0])
          var num=0;
          for(var i=0;i<this.data.noworders.length;i++)
          {
            num=num+this.data.noworders[i].money
          }
          this.setData({totalprice:num})
          //第一个订单为支付，则所有订单均已支付，进入已支付状态
          const pay=this.data.noworders[0].paid
        if(pay==1){
        this.setData({
          havePaid: 1
        })
      }
        },
        false:()=>{
          console.log("erro")
        }
      })
    },
  
    //跳转到支付页面
    toPay(){
        wx.navigateTo({
          url: '/pages/pay/pay?total='+this.data.totalprice,
        })
    },
    //加菜，跳转回点单页面
    toShopping(){
        wx.navigateTo({
          url: '/pages/shopping/shopping',
        })
    },
    //呼叫服务员接口
    call(){
      wx.request({
        url: 'http://'+app.globalData.baseurl+':8082/api/customer/call',
        method: "POST",
        header: {'Content-Type': 'application/x-www-form-urlencoded'},
        data:{
          tableid: this.data.tableid
        },
        success:(res)=>{
          wx.showToast({
            title: '已呼叫服务员',
            duration: 1500,
          })
        }
      })
    }
})