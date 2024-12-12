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
  },

  onShow() {
    wx.connectSocket({
      url: 'ws://'+this.globalData.baseurl+':8082/websocket2',
      data:{},
      header:{ 
        'content-type': 'application/json'
      },
      method:"GET",
      success:(res)=>{
        wx.onSocketOpen((res) => {
          console.log('WebSocket 成功连接', res)
          wx.onSocketMessage(function(res) {
            console.log('收到服务器内容：', res)
            getApp().globalData.callmsg=res.data
            getApp().globalData.showmsgdialog=true,
            getApp().triggerListeners();
            //不需要考虑如何触发，当服务器发送消息时自动接收
            })
    });
    
    }
    
    })
    
  },
       
  
  //导入菜品列表
  copyFoodList(backendItems){
    const globalItems =[];
    for(let i=0;i<backendItems.length;i++)
    {
      const item=backendItems[i];
      globalItems.push(item);
    }
    const app=getApp();
    app.globalData.items=globalItems;
    console.log(app.globalData.items)
  },

  // 注册监听器函数的方法
  registerListener: function (listener) {
    this.globalData.listeners.push(listener);
  },
  // 触发监听器函数的方法
  triggerListeners: function () {
    var listeners = this.globalData.listeners;
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]();
    }
  },
  


  globalData: {
    userInfo: null,
    items: [
    ],
    showmsgdialog:false,
    listeners: [], // 存储监听器函数的数组
    callmsg:"",
    baseurl:"192.168.121.155"
  }
})
