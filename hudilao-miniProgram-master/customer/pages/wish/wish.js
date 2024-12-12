// pages/wish/wish.js
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
     food1:"",
     food2:"",
     food3:"",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      wx.setNavigationBarTitle({
        title: '心愿单',
      })
      //请求心愿单
      this.askWish()
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

    //获取心愿单输入
    inputChange1(e){
      this.setData({
        food1: e.detail.value
      });
    },
    inputChange2(e){
      this.setData({
        food2: e.detail.value
      });
    },
    inputChange3(e){
      this.setData({
        food3: e.detail.value
      });
    },
    //发送心愿单
    sendwish(){
      wx.request({
        url: 'http://'+app.globalData.baseurl+':8082/api/customer/submitWishList',
        method:"POST",
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data:{
          phonenumber:app.globalData.phonenumber,
          food1:this.data.food1,
          food2:this.data.food2,
          food3:this.data.food3,
        },
        success:(res)=>{
        },
        false:()=>{
          console.log("erro")
        }
      })
    },
    //请求心愿单接口
    askWish(){
      wx.request({
        url: 'http://'+app.globalData.baseurl+':8082/api/customer/wish',
        method:"GET",
        data:{
          phonenumber:app.globalData.phonenumber,
        },
        success:(res)=>{
          console.log(res.data)
          this.setData({
            food1:res.data.data.food1,
            food2:res.data.data.food2,
            food3:res.data.data.food3,
          })
          
        },
      })
    }
})