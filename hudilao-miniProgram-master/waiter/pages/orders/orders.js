// pages/orders/orders.js
const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderList:[],
        currentpage:1,
        pageSize: 4,
        total: 0,
       
    },
    //显示时间
    formatTime: function(time) {
      var date = new Date(time);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      var formattedTime = hours + ':' + minutes + ':' + seconds;
      return formattedTime; // 返回格式化后的时间字符串
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      wx.setNavigationBarTitle({
        title: '订单管理',
      })
      this.loadData()
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
        //取消WebSocket连接
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
      //重新加载当前未完成订单
      this.setData({
        currentpage:1,
        orderList:[],
      });
      this.loadData();
      console.log(this.data);
      //加载完毕后停止刷新效果
      wx.stopPullDownRefresh();
      
  },

    /**
     * 页面上拉触底事件的处理函数，自动加载订单
     */
    onReachBottom() {
      const nextpage = this.data.currentpage + 1;
      if(this.data.currentpage*this.data.pageSize<this.data.total)
        {
          this.setData({
            currentpage: nextpage
          })
          this.loadData();
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
    //绑定订单信息
    orderData(id){
      var key=id
      let data= {}
      for (let i = 0; i < this.data.orderList.length; i++) {
        let order = this.data.orderList[i];
        if(order.orderid==key)
        {
          Object.assign(data, this.data.orderList[i])
          console.log(data)
          break
        }
      }
      return data
    },
    //查看订单详情
    findDetail(e){
      const orderData= this.orderData(e.target.dataset.id)
      let queryString = encodeURIComponent(JSON.stringify(orderData));
      wx.navigateTo({
        url: '/pages/detail/detail?data='+queryString,
      })
    },
    //请求未完成的订单
    getOrders(){
        wx.showLoading({
          title: '订单数据加载中',
        })
        wx.request({
          url: 'http://'+app.globalData.baseurl+':8082/api/waiter/order',
          method:'GET',
          success:(res)=>{
            this.setData({
              orderList:res.data.data
            })
            console.log(this.data.orderList)
        },
        complete:()=>{
            wx.hideLoading()
        }
        })
    },
    
    //修改订单状态
    setStatus(e){
        wx.request({
            url: 'http://'+app.globalData.baseurl+':8082/api/waiter/changeCondition',
            method:'POST',
            header:{
              'Content-Type':'application/x-www-form-urlencoded'
            },
            data:{
                orderid: e.target.dataset.id,
                condition: e.target.dataset.newStatus,
            },
            success:(res)=>{
                wx.showToast({
                    title: '修改成功',
                    icon: 'success',
                    duration: 2000,
                  })
                //重新渲染页面
                this.onPullDownRefresh()
              }
        })
    },
    //修改订单内容（只能退菜）
    changeOrder(dataset){
        wx.request({
            url: 'http://'+app.globalData.baseurl+':8082/api/waiter/changeContent',
            method:'POST',
            header:{
              'Content-Type':'application/x-www-form-urlencoded'
            },
            data:{
                orderid: dataset.id,
                totalprice: dataset.totalprice,
                items: dataset.items
            },
        })
    },
    
    loadData() { 
      // 在此处获取新数据并存储到 newData 中
        wx.request({
          url: 'http://'+app.globalData.baseurl+':8082/api/waiter/page/littleorder',
          method:'GET',
          data:{
            pagenum: this.data.currentpage,
            pagesize: this.data.pageSize
          },
          success:(res)=>{
            console.log(res)
            const data =res.data.data
            const arr1 = this.data.orderList
            const arr2 = data.records
            for(let i=0;i<arr2.length;i++)
            {
              arr1.push(arr2[i])
            }
            this.setData({
              total: data.total,
              orderList:arr1,
            })
          },
          complete:()=>{
              wx.hideLoading()
          }
        })
    },

    
})