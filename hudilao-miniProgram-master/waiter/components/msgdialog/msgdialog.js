// components/msgdialog/msgdialog.js
const app=getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },
    attached: function() {
      getApp().registerListener(this.onshowChange.bind(this));
    },
  
    /**
     * 组件的初始数据
     */
    data: {
      showmsgdialog: app.globalData.showmsgdialog,
      callmsg:app.globalData.callmsg,
    },

    /**
     * 组件的方法列表
     */
    methods: {
      //关闭弹窗
      closePopup(){
        app.globalData.showmsgdialog=false,
        getApp().triggerListeners();
       this.setData({
        showmsgdialog:false
       })
      },

      //监测showmsgdialog变化并使弹窗维持八秒
      onshowChange: function () {
        this.setData({
          showmsgdialog: getApp().globalData.showmsgdialog,
          callmsg: getApp().globalData.callmsg
        })
        setTimeout(() => {
          this.closePopup();
        }, 8000); 
      },

     
    
    }
})
