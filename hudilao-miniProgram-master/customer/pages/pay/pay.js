const app = getApp();
Page({
    data: {
        total: 0,//订单总价
        content: '',
        showPopup:false,
        showPayPwdInput: false,  //是否展示密码输入层
        pwdVal: '',  //输入的密码
        payFocus: true, //文本框焦点
        totalprice:0,
    },
   
    onLoad: function (options) {
      console.log(options) //接受页面传参得到订单的总价
      this.setData({
        totalprice: options.total
      })
      console.log(this.data.totalprice)
      this.showInputLayer();
    },
  pay(){
    wx.request({
      url: 'http://'+app.globalData.baseurl+':8082/api/customer/pay',
      method:"POST",
      data:{tableid:getApp().globalData.tableid},
      success:(res)=>{
        console.log(res)
      }
    })
    /* 
    wx.navigateTo({
      url: '/pages/payFinished/payFinished',
    })*/
  },
//显示支付密码的输入框
  showInputLayer: function(){
    this.setData({ showPayPwdInput: true, payFocus: true });
  },
  /**
   * 隐藏支付密码输入层
   */
  hidePayLayer: function(){
    
    var val = this.data.pwdVal;

    this.setData({ showPayPwdInput: false, payFocus: false, pwdVal: '' }, function(){
      wx.showToast({
        title: '支付成功',
        duration:1000
      })
      //提示支付完成后略微延迟，回到首页
      setTimeout(function(){
        wx.switchTab({
          url: '/pages/home/home',
        })
      },1000)
      
    });

  },
  /**
   * 获取焦点
   */
  getFocus: function(){
    this.setData({ payFocus: true });
  },
  /**
   * 输入密码监听
   */
  inputPwd: function(e){
      this.setData({ pwdVal: e.detail.value });

      if (e.detail.value.length >= 6){
        //this.pay()
        this.hidePayLayer();
        //清除用餐状态
        app.globalData.isEating=false
        app.globalData.tableid=0
        wx.navigateTo({
          url: '/pages/home/home',
        })
      }
  }


})
