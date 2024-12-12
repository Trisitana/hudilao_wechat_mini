// app.js
App({
  onLaunch() {

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
     //获取菜品
    wx.request({
      url: 'http://'+this.globalData.baseurl+':8082/api/customer/foodList',
      method:"GET",
      success:(res)=>{
        const app=getApp();
        app.globalData.foodlist=res.data.data;
       //向菜品数组里加入了已点数量属性
       var new_arr =  app.globalData.foodlist.map((item,index)=>{
    return Object.assign(item,{'ordernumber':0})
});
//建立映射
var new_arr =  app.globalData.foodlist.map((item,index)=>{
  return Object.assign(item,{'minusStatus':'disabled'})
});
      console.log(app.globalData.foodlist);
      },
      false:()=>{
        console.log("erro")
      }
    })
  },
  
  globalData: {
    userInfo: null,
    phonenumber:"",
    tableid:0,
    ranks:1,
    icon:"",
    items:[],
    foodlist:[],
    isEating:false,
    totalprice:0,
    timeID:0,
    baseurl:"192.168.121.158"
    
  }
})


