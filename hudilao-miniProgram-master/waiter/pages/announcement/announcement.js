// pages/announcement/announcement.js

const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        
        page: 1,
        pageSize: 11,
        total: 0,
        annoucements:[],
        
    },

    /**
     * 生命周期函数--监听页面加载
     */

     //获取通告信息
    onLoad(options) {
      wx.setNavigationBarTitle({
        title: '通知公告',
      })
      wx.showLoading({
        title: '数据加载中',
      })
        wx.request({
          url: 'http://'+app.globalData.baseurl+':8082/api/waiter/announcement',
          method:'GET',
          data:{
            pagenum: this.data.page,
            pagesize: this.data.pageSize
          },
          success:(res)=>{
            const data =res.data.data
            const arr1 = this.data.annoucements
            const arr2 = data.records
            for(let i=0;i<arr2.length;i++)
            {
              arr1.push(arr2[i])
            }
            
            this.setData({
              total: data.total,
              annoucements: arr1
            })
          },
          complete:()=>{
              wx.hideLoading()
              this.setData({

              })
          }
        })
        console.log(this.data.annoucements)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
      /*
      const WebSocket= require('path/to/websocket')
      const socket = new WebSocket('wss://your-websocket-url');//待更改
      */
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
      /*socket.onMessage(function (event) {
        console.log('收到消息：', event.data);
      })*/
      /*
      setInterval(function() {
        wx.showToast({
          title: '呼叫服务员',
        })
      }, 5000);*/
    },
    
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
      //轮询
      /*
      setInterval(function(){
        this.getAnnouncements()
      },100000)//100秒
      */
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
      //socket.close();
    },

   
    //页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh() {
      this.setData({
        page: 1,
        total:0,
        annoucements:[]
      })
      this.getAnnouncements()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        
        if(this.data.page*this.data.pageSize<this.data.total)
        {
          this.setData({
            //页面自增
            page: this.data.page+1
          })
          this.getAnnouncements()
        }
        else{
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

   
    //获取历史公告
    getAnnouncements(){
        wx.showLoading({
          title: '数据加载中',
        })
        wx.request({
          url: 'http://'+app.globalData.baseurl+':8082/api/waiter/announcement',
          method:'GET',
          data:{
            pagenum: this.data.page,
            pagesize: this.data.pageSize
          },
          success:(res)=>{
            //用暂存数组进行拼接得到新数组
            const data =res.data.data
            const arr1 = this.data.annoucements
            const arr2 = data.records
            for(let i=0;i<arr2.length;i++)
            {
              arr1.push(arr2[i])
            }
            console.log(this.data.annoucements)
            this.setData({
              total: data.total,
              test: res.data.data.records,
              annoucements: arr1,
            })
          },
          complete:()=>{
              wx.hideLoading()
          }
        })
    },
    /* 监听呼叫和上菜通知的方法
    getNews(){
      console.log("尝试获取消息")
    }*/
})