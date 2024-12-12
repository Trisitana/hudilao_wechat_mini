// pages/personal/personal.js
const app=getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
      icon:"",
      birthday: "",
      customerid: 0,
      icon: "",
      nickname: "",
      phonenumber: "",
      rankpoint: 1,
      registerdate: "2023-09-12",
      updating:true,//默认修改状态
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      wx.setNavigationBarTitle({
        title: '个人资料',
      })
      this.findPerson()
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
    //进入修改状态
    modify(){
      this.setData({
        updating:true
      })
    },
    //查看个人中心
    findPerson(){
      wx.request({
        url: 'http://'+app.globalData.baseurl+':8082/api/customer/center',
        method:"GET",
        data:{phonenumber:app.globalData.phonenumber},
        success:(res)=>{
          app.globalData.phonenumber=res.data.data.phonenumber;
          this.setData({
          phonenumber: app.globalData.phonenumber,
          icon:res.data.data.icon,
          nickname:res.data.data.nickname,
          birthday:res.data.data.birthday,
          })
        },
        false:()=>{
          console.log("erro")
        }
      })
    },
    //根据输入框的输入修改昵称
    setNickname(e){
      this.setData({
        nickname:e.detail.value,
      })
    },
    //根据选择框的输入修改生日时间
    handleTimeChange(e){
      console.log(e.detail.value)
      this.setData({
        birthday:e.detail.value
      })
    },

    submit(){
      this.modifyPerson() 
    },
    //提交以后隐藏提交按钮
    enter(){
      this.setData({
        updating: false
      })
      this.submitForm()
    },

   
    //个人中心修改接口
    modifyPerson(){
      wx.request({
        url: 'http://'+app.globalData.baseurl+':8082/api/customer/edit/center',
        method:"POST",

        data:{
          icon:this.data.icon,
          nickname:this.data.nickname,
          phonenumber:this.data.phonenumber,
          birthday:this.data.birthday
        },
        success:(res)=>{
          //重新加载页面
          console.log(res)
          wx.showToast({
            title: '修改成功',
            duration: 1000, 
          })
        },
        false:()=>{
          console.log("erro")
        }
      })
    },

    
    //修改头像
    modifyicon() {
        const that = this;
        //微信原生的选择图片接口
        wx.chooseImage({
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success(res) {
            that.setData({
              icon: res.tempFilePaths[0],
            });
            //上传图片接口
            wx.uploadFile({
              filePath:res.tempFilePaths[0],
              name: 'file',
              url: 'http://'+app.globalData.baseurl+':8082/images/upload',
              success:(res)=>{
                var temp=JSON.parse(res.data);
                that.setData({icon:temp.data})
              }
            })
          },
        });
      },
})