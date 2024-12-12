// pages/home/home.js
const app=getApp();
Page({
    mixins: [require('../../mixin/common')],
    /**
     * 页面的初始数据
     */
    data: {
      phonenumber:"",
      tableid:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      this.setData({
        phonenumber:app.globalData.phonenumber
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
    //跳转到购物页面
    toShopping(){
      wx.navigateTo({
        url: '/pages/shopping/shopping',
      })
    },
    //跳转到排队页面
    toLine(){
      wx.navigateTo({
        url: '/pages/line/line',
      })
    },
    //点击点餐按钮，判断下一个页面
    enter(e){
      console.log("左侧按钮")
      console.log(app.globalData)
      //先判断要不要登录
      if(this.data.phonenumber==""){
        console.log("1")
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
       //如果正在用餐
       if(app.globalData.isEating){
         wx.navigateTo({
           url: '/pages/eating/eating',
         })
       }
      //再判断有没有桌号
      if(app.globalData.tableid<=15&&app.globalData.tableid>=1)//应为&&
      {
        console.log(app.globalData)
        wx.navigateTo({
          url: '/pages/shopping/shopping',
        })
      }
     
      //如果正在取号或者没有桌号
      if(app.globalData.tableid>15||app.globalData.tableid<1){
        console.log(app.globalData.tableid)
        wx.navigateTo({
          url: '/pages/line/line',
        })
      }
      
    },
    //进入点餐接口
    gotoshopping(){
      wx.request({
        url: 'http://'+app.globalData.baseurl+':8082/api/customer/enter',
        method:"GET",
        data:{
          phonenumber:"123",
        },
        success:(res)=>{
        app.globalData.tablenumber=res.data.tableid;
        app.globalData.wattingid=res.data.waitingid;
        app.globalData.wattingnumber=res.data.waitingnumber;
        console.log(res.data);
        console.log("21");
        },
        false:()=>{
          console.log("erro")
        }
      })
    },
    //进入活动中心接口
    toActivity(){
      wx.navigateTo({
        url: '/pages/activity/activity',
      })
    }
})