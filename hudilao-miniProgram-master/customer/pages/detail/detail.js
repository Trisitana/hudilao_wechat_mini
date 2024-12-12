// pages/detail/detail.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      order: "",
      orderfoodlist:[],
      ordermsg:"",
      isShowConfirm:false,
      showpopup:false,
      index:0,
      modifyquantity:0,
      conment:0,
      showinput:false,//默认显示可评价状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //接受页面传参获取订单ID
    this.setData({'ordermsg.finishedorderid':options.orderId})
      wx.setNavigationBarTitle({
          title: '订单详情',
        })
        //调用获取订单详情接口
      wx.request({
        url: 'http://'+app.globalData.baseurl+':8082/api/customer/orderdetail',
        method:"GET",
        data:{
          finishedorderid:this.data.ordermsg.finishedorderid
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
  //显示输入框
  showinput(){
    var temp=!this.data.showinput;
  this.setData({
    showinput:temp
  })
  },
  //绑定用户的输入
  bindconment(e){
    const value = e.detail.value;
   this.setData({
   conment:value
   })
  },

  //提交评价
  submitconment(){
    //评价星级最高只能为5星
    if(this.data.conment<=5&&this.data.conment>=0)
    {
      //提交评价接口
   wx.request({
     url: 'http://'+app.globalData.baseurl+':8082/api/customer/comment',
     method:"POST",
     header:{
      'Content-Type':'application/x-www-form-urlencoded'
    },
     data: {
      finishedorderid:this.data.ordermsg.finishedorderid,
      comment:this.data.conment,
     },
     success: (res) => {
      wx.showToast({
        title: '评价成功',
        icon:'success',
        mask: true,
      })
        this.setData({
          showinput:false,
        })
     },
   })
  }else{//提示输入错误
    wx.showToast({
      title: '请输入1-5之间的数据',
      icon:'none',
      mask: true,
    })
  }
  },

  })     