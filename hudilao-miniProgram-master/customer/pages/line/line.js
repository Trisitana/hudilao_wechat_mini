

// pages/line/line.js
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
      phonenumber:"",
      waitingid:0,
      waitingnumber:100,//默认最大等待人数
      isWaiting:0,
      canEat:0,
      timer:0,
      showpop: false, 
      table: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      wx.setNavigationBarTitle({
        title: '等待叫号',
      })
      //请求得到的数据
      const phone=app.globalData.phonenumber
      var id=0
      var number=100
      wx.request({
        url: 'http://'+app.globalData.baseurl+':8082/api/customer/waitingInfo',
        method:"GET",
        data:{
         phonenumber:app.globalData.phonenumber,
        },
        success:(res)=>{
          console.log(res.data)
          id=res.data.data.waitingid
          number=res.data.data.waitingnumber
          
        },
        //判断显示取号按钮还是排队进度
        complete:()=>{
          if(id>0)//已取号
        {
          this.setData({
            phonenumber: app.globalData.phonenumber,
            waitingid: id,
            waitingnumber:number,
            isWaiting:1,
            timeID: app.globalData.timeID,
          })
          
        }
        else{//未取号
          this.setData({
            phonenumber: phone,
            waitingid: id,
            waitingnumber:number,
            isWaiting:0,
          })
        }
        }
      });


      
      
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
      var those=this
      setTimeout(function(){
        //轮询是否排到号
      
      if(those.data.isWaiting)//设置定时器
        {
          const timerId=setInterval(function(){
            console.log("页面内轮询中")
            those.queryWaiting()
            those.check()
          },5000)
          
          this.setData({
            timer:timerId,
          })
        }
        //console.log(this.data)
      },3000)
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
      //清除在页面中设计的定时器
      /* 
      clearInterval(this.data.timer)
      if(this.data.isWaiting)//设置全局定时器
      {
        this.startTimer();
      }
      */
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
      if(this.data.isWaiting==1)
      {
        this.queryWaiting()
      }
 
      /* 强制刷新 
      wx.redirectTo({
        url: '/pages/line/line',
      })*/
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
    //取号接口
   beginWaiting(){
     wx.request({
       url: 'http://'+app.globalData.baseurl+':8082/api/customer/ask/waitingid',
       method:"POST",
       header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
       data:{
         phonenumber:this.data.phonenumber,
       },
       success:(res)=>{
         console.log(res.data)
         app.globalData.waitingid=res.data.waitingid
         app.globalData.waitingnumber=res.data.waitingnumber
       },
       complete:()=>{
         console.log("已完成")
         //进入等待状态，显示排队进程
        this.setData({
          isWaiting:true,
          waitingid:app.globalData.waitingid,
          waitingnumber: app.globalData.waitingnumber
        })
       }
     })
   },
   //点击取号按钮
   getIdButton(){
     var that = this
    that.beginWaiting()
   
    this.setData({
      timer: timerId
    })
   },
    //查看排队情况接口
    queryWaiting(){
      var that= this
      wx.request({
        url: 'http://'+app.globalData.baseurl+':8082/api/customer/waitingInfo',
        method:"GET",
        data:{
         phonenumber:that.data.phonenumber,
        },
        success:(res)=>{
          that.setData({
            waitingid: res.data.data.waitingid,
            waitingnumber:res.data.data.waitingnumber,
          })

        console.log(res.data);
        },
        false:()=>{
          console.log("erro")
        }
      });
    },

    //查看是否排到号接口
    /* 设计目的：前方还有一桌在等待，但是突然空出来两桌。此时可以直接给顾客发生确认就餐的提醒 */
    check(){
      var that=this
      wx.request({
        url: 'http://'+app.globalData.baseurl+':8082/api/customer/success',
        method:"GET",
      
        data:{
         phonenumber:app.globalData.phonenumber,
        },
        success:(res)=>{
          console.log(that.data)
          if(res.data.code==200){
            clearInterval(that.data.timer)
            console.log("页面内定时器清除")
            wx.showModal({
              title: '确认用餐',
              content: '终于等到您！请在1分钟点击确认用餐，否则需要重新排号哦',
              confirmText:"确认用餐",
              cancelText:"我不吃了",
              complete: (res) => {
                if (res.cancel) {
                  that.cancel()
                }
                  //跳转到点餐页面
                if (res.confirm) {
                  that.confirmeat()
                  setTimeout(function(){
                    wx.navigateTo({
                      url: '/pages/shopping/shopping',
                    })
                  },1000)
                }
              }
            })
            /* 定时取消，为便于测试暂时注释掉
            setTimeout(function(){
              that.cancel()，
              wx.switchTab({
                url: '/pages/home/home',
              })
            },120000)*/
          }
          else{
            console.log("等待中")
          }
        return res.data.code
        },
        false:()=>{
          console.log("erro")
        }
      });
      //排到号了
      that.setData({
        canEat: 1,
      })
    },
    
    //取消排号接口
    cancel(){
      var that=this
      wx.request({
        url: 'http://'+app.globalData.baseurl+':8082/api/customer/cancel',
        method:"POST",
        header:{
          "content-type":"application/x-www-form-urlencoded"
      },
        data:{
         phonenumber:app.globalData.phonenumber,
        },
        success:(res)=>{
        console.log(res);
        
        },
        false:()=>{
          console.log("erro")
        }
      });
    },
    //点击取消排号，有二次确认
    cancelButton(){
      wx.showModal({
        title:"取消排号",
        content:"真的要取消排号吗？",
        cancelText:"我再等等",
        confirmText:"我不等了",
        success:(res)=>{
          if(res.confirm){
            this.cancel()
            this.setData({
              isWaiting:0,
              waitingid:"",
              waitingnumber:100,
            })
            app.globalData.waitingnumber=100
            app.globalData.waitingid=""
          }
          if(res.cancel){
            
          }
        }
      })
    },
    //确认就餐接口
    confirmeat(){
      wx.request({
        url: 'http://'+app.globalData.baseurl+':8082/api/customer/confirm',
        method:"POST",
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data:{
         phonenumber:app.globalData.phonenumber,
        },
        success:(res)=>{
        app.globalData.tablenumber=res.data.tableid;
        this.setData({
          table: res.data.tableid,
          showpop: true
        })
        },
        false:()=>{
          console.log("erro")
        }
      });
    },
    //离开页面时设置轮询
    startTimer() {
      const timerId = setInterval(() => {
        const code= this.check()
        console.log("页面外轮询中")
      }, 10000);
  
      app.globalData.timeID=timerId
    },
  //进入页面时清除在页面外设置的定时器
    clearTimer() {
      const timerId = app.globalData.timeID;
      if (timerId) {
        clearInterval(timerId);
        app.globalData.timeID=null
        console.log('定时器已清除');
      }
    },
    //确认就餐以后，显示弹窗
    showpop: function () {
      var that=this;
      this.setData({
        showpop: true
      });setTimeout(function(){
        that.setData({
          showpop: false
        });
      },2000)
    },
  
    hidepop: function () {
      this.setData({
        showpop: false
      });
    },
    backHome(){ 
      wx.switchTab({
        url: '/pages/home/home',
      })
    },
})