
// pages/orders/orders.js
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
      noworders:[],
      histories:[],
      comment:"",
      isNow:true,
      page: 1,//历史订单的当前页数
      pagesize: 5,//每页请求的历史订单数量
      total:0,
      tableid:0,
      totalprice:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      wx.setNavigationBarTitle({
        title: '我的订单',
      })
      //加载时获取当前订单
      this.getCurrent()
      wx.showLoading({
        title: '订单加载中',
        duration:1000,
      })
      console.log(this.data)

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
      wx.hideLoading()
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
    onReachBottom(e) {
      console.log(e)
      //判断是否还有历史订单可以请求
      if(this.data.page*this.data.pageSize<this.data.total)
        {
          this.setData({
            //页面自增
            page: this.data.page+1
          })
          this.getHistory()
        }
        else{//全部加载完了，提示订单加载完毕
          wx.showToast({
            title: '数据已加载完毕',
            duration: 2000
          })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    //切换到当前订单
    now(){
      this.setData({
        isNow:true
      })
    },
     //切换到历史订单
    history(){
      this.getHistory()
      this.setData({
        isNow:false,
        page:1,
      })
      
    },
    //查看当前订单
   getCurrent(){
    wx.request({
      url: 'http://'+app.globalData.baseurl+':8082/api/customer/current/order',
      method:"GET",
      data:{
        phonenumber:app.globalData.phonenumber,
      },
      success:(res)=>{
        this.setData({
          noworders: res.data.data,
          tableid:app.globalData.tableid,
        })
        console.log(this.data.noworders)
        var num=0;
        for(var i=0;i<this.data.noworders.length;i++)
        {
          num=num+this.data.noworders[i].money
        }
        this.setData({totalprice:num})
      },
      false:()=>{
        console.log("erro")
      }
    })
  },



  //查看历史订单
  getHistory(){
    wx.request({
      url: 'http://'+app.globalData.baseurl+':8082/api/customer/finishedOrder',
      method:"GET",
      data:{
        //phonenumber:app.globalData.phonenumber,
        phonenumber:app.globalData.phonenumber,
        pagenum: this.data.page,
        pagesize: this.data.pagesize
      },
      success:(res)=>{
        this.setData({
          histories: res.data.data.records
        })
        console.log(this.data.histories);
      },
      false:()=>{
        console.log("erro")
      }
    })
  },
  
  //点击订单查看详情
  toDetail(e){
    const id=e.currentTarget.dataset.value
   wx.navigateTo({
     url: '/pages/detail/detail?orderId='+id,
    })
  },
  //跳转到支付页面
  toPay(){
    wx.navigateTo({
      url: '/pages/pay/pay',
    })
  },
//加菜，跳转回点单页面
toShopping(){
    wx.navigateTo({
      url: '/pages/shopping/shopping',
    })
  }
})
