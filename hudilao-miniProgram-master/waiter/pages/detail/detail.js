// pages/detail/detail.js
const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //payButton: 0,
        //urgeBUtton: 0,
        order: "",
        orderfoodlist:[],
        ordermsg:"",
        isShowConfirm:false,
        showpopup:false,
        index:0,
        modifyquantity:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.setNavigationBarTitle({
            title: '订单详情',
          })
        let queryString = decodeURIComponent(options.data);
        let orderData = JSON.parse(queryString);
        var orderid=orderData.orderid;
        //console.log(orderid);
        wx.request({
          url: 'http://'+app.globalData.baseurl+':8082/api/waiter/page/orderdetail',
          method:"GET",
          data:{
            orderid:orderid
          },
          success:(res)=>{
            this.setData({
              orderfoodlist:res.data.data.items,
              ordermsg:res.data.data,
            })
            console.log(this.data.orderfoodlist);
            console.log(this.data.ordermsg)
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
    //催菜接口
    urge(e){
      this.setData({
        'ordermsg.emergency':1,
      })
      
        wx.request({
          url: 'http://'+app.globalData.baseurl+':8082/api/waiter/urge',
          method:'POST',
          header:{
            'Content-Type':'application/x-www-form-urlencoded'
          },
          data:{
              orderid: this.data.ordermsg.orderid
          },
          success:(res)=>{
            wx.showToast({
                title: '已催菜',
                icon: 'success',
                duration: 2000,
              })
          },
        })
    },
    //修改订单状态为已支付
    finishPay(){
        wx.request({
          url: 'http://'+app.globalData.baseurl+':8082/api/waiter/pay',
          method:'POST',
          header:{
            'Content-Type':'application/x-www-form-urlencoded'
          },
          data:{
              tableid: this.data.ordermsg.tableid
          },
          success:(res)=>{
            this.setData({
              'ordermsg.payButton':1,
            })
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000//持续的时间
            })
          },
      })
     
      },

       //修改订单状态
      modifycondition(){
        if(this.data.ordermsg.conditions==2){
          //修改状态为已上菜
      this.setData({
        'ordermsg.conditions':3,
      })
      wx.request({
        url: 'http://'+app.globalData.baseurl+':8082/api/waiter/changeCondition',
        method:'POST',
        header:{
          'Content-Type':'application/x-www-form-urlencoded'
        },
        data:{
            orderid: this.data.ordermsg.orderid,
            condition:3
        },
        success:(res)=>{
          console.log(res)
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000//持续的时间
          })
          this.setData({
            isShowConfirm:false,
          })
        }
      })
    }else{
      //修改状态为已结束
      this.setData({
        'ordermsg.conditions':4,
      })
      wx.request({
        url: 'http://'+app.globalData.baseurl+':8082/api/waiter/changeCondition',
        method:'POST',
        header:{
          'Content-Type':'application/x-www-form-urlencoded'
        },
        data:{
            orderid: this.data.ordermsg.orderid,
            condition:4
        },
        success:(res)=>{
          console.log(res)
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000//持续的时间
          })
          this.setData({
            isShowConfirm:false,
          })
        }
      })
    }
     
      },
   
      //关闭弹窗
      closemodify(){
        this.setData({
          isShowConfirm:false,
        })
      },

      
      //打开修改订单弹窗
    openpopup(){
      this.setData({showpopup:true,})
      },
  
      //关闭修改订单弹窗
      closepopup(){
        this.setData({showpopup:false,})
        },

        //长按菜品可修改菜品数量
        modifyfood(e){
          if(this.data.ordermsg.conditions==1){
          this.setData({
            index:e.currentTarget.dataset.index,
            showpopup:true,
          })
        }else{
          wx.showToast({
            title: '菜已做好，不能修改',
            icon:'none',
          })
        }
        
        },
        //绑定input并更新菜品数量
        inputchange(e){
          var i=this.data.index;
          this.setData({
           modifyquantity:e.detail.value,
          })
        },

       //提交修改后的订单
        submit(){
          var that=this;
          var that1=this;
          var temp=this.data.index;
          this.setData({['orderfoodlist[' + temp + '].quantity']:this.data.modifyquantity})
          var items1 = [];
          for (var i = 0; i < that.data.orderfoodlist.length; i++) {
            var foodItem = {
              "foodid": that.data.orderfoodlist[i].foodid,
              "quantity": that.data.orderfoodlist[i].quantity,
              "price": that.data.orderfoodlist[i].price * that.data.orderfoodlist[i].number
            };
            items1.push(foodItem);
          }
          var rawData ={
            orderid: this.data.ordermsg.orderid,
            totalprice: this.data.ordermsg.money,
            items:items1
           
         };
         wx.request({
          url: 'http://'+app.globalData.baseurl+':8082/api/waiter/changeContent',
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          data:rawData,
          success: function (res) {
            // 请求成功的回调函数
            console.log(res.data); // 输出服务器返回的数据
            that1.closepopup();
          },
          fail: function (error) {
            // 请求失败的回调函数
            console.error(error);
          }
        });
      
        },
      
     
     

    })     