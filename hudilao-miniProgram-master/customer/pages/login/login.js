// pages/login/login.js
const app=getApp()
Page({
  data: {
    vcodeValue: "",
    msg: false,
    code:" ",
    checkValue: 1,
    check: false,
    mobileFormat:"false",
    phonenumber:"",
    //提交时的手机号
    submitPhone:""
  },


    /**
     * 页面的初始数据
     */

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      wx.hideHomeButton()
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
      //双向绑定手机号并验证手机号是否符合格式
      bindphone(e){
        this.setData({
          phonenumber:e.detail.value
    })
     },
      //双向绑定验证码
      bindVcodeInput(e) {
        if (e.detail.value) {
          this.setData({
            vcodeValue: e.detail.value
          });
        }
      },

      checkStatus() {
        if (!this.data.check) {
          this.setData({
            msg: true,
          });
        }
        const that = this;
        setTimeout(() => {
          that.setData({
            msg: false,
          });
        }, 320);
        //根据验证码是否正确判断是否需要跳转
        if(this.data.code==this.data.vcodeValue&&this.data.submitPhone==this.data.phonenumber){
          app.globalData.phonenumber=this.data.submitPhone
          wx.request({
            url: 'http://'+app.globalData.baseurl+':8082/api/customer/personal',
            method:"GET",
          
            data:{
              phonenumber:this.data.phonenumber,
            },
            success:(res)=>{
              wx.showToast({
                title: '登录成功',
                duration:2000
              })
      
            },
            complete:()=>{
              setTimeout(function(){
                wx.switchTab({
                  url: '/pages/home/home',
                })
              },1000)
            }
          })
        }
        else{//验证码错误
          wx.showToast({
            title: '验证码输入错误',
            icon:"error",
            duration:2000
          })
        }
      },
      checkboxChange(e) {
        if (e.detail.value.includes('1')) {
          this.setData({
            check: "true",
          });
        } else {
          this.setData({
            check: "false",
          });
        }
      },
      //获取验证码按钮
      askCode(){
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (this.data.phonenumber.length ==0) {
          wx.showToast({
            title: '请输入手机号！',
            icon: 'none',
            duration: 1500
          })
          this.setData({
            mobileFormat: "false",
          })
        } else if (this.data.phonenumber.length < 11) {
          wx.showToast({
            title: '手机号长度有误，请重新输入！',
            icon: 'none',
            duration: 1500
          })
          this.setData({
            mobileFormat: "false",
          })
        } else if (!myreg.test(this.data.phonenumber)) {
          wx.showToast({
            title: '手机号有误，请重新输入！',
            icon: 'none',
            duration: 1500
          })
          this.setData({
            mobileFormat: "false",
          })
    
        } else {
          this.setData({
            mobileFormat: "true",
          })
        }
       
        if(this.data.mobileFormat=="true")
        {
          wx.showToast({
            title: '验证码已发送',
            icon:"none",
            duration:1000
          })
          wx.request({
            url: 'http://'+app.globalData.baseurl+':8082/api/customer/code',
            method:"POST",
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data:{
              phonenumber:this.data.phonenumber,
            },
            success:(res)=>{
             this.setData({
               code:res.data.data,
               submitPhone:this.data.phonenumber
             })
           },
           fail:()=>{
              console.log("no")
           }
          })
}
},


})