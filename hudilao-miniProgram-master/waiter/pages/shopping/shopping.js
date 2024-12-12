// pages/shopping/shopping.js
const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        table: '1',
        orderItems:{},
        items:[],
        enterTable: 0,
        numberRange:["请选择桌号",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
        totalPrice: 0,
        msg: 0,
       
        ordereditems:[],
        items: [
          {
            foodid: 1,
            quantity: 1,
            price: 84,
        },
        {
            foodid: 2,
            quantity: 1,
            price: 84,
        }
      ],
    num:0,//加减号组件
    active:0,
    currentTab:0,
    foodlist:[],
    array: [ {
      message: 'bar'
    }],
    orderfoodnumber:0,
    orderfoodlist:[],
    typeid:0,
    toView:1,
    imgurlslist:[],
    typelist:[
      {type:1,name:"锅底"},
      {type:2,name:"特色菜"},
      {type:3,name:"牛羊肉"},
      {type:4,name:"海鲜"},
      {type:5,name:"丸滑"},
      {type:6,name:"其他荤菜"},
      {type:7,name:"豆面制品"},
      {type:8,name:"菌菇"},
      {type:9,name:"蔬菜"},
      {type:10,name:"饮料酒水"},
      {type:11,name:"甜品"},
      {type:12,name:"主食"},
      {type:13,name:"自选类"},
    ],
    curId:0,
    idarray:[1,8,11,19,25,32,43,53,55,68,83,87,89],
    observers:[],
    openobservs:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */

     //页面出现前获取菜品数组
    onLoad(options) {
      wx.setNavigationBarTitle({
        title: '点餐',
      })
      wx.request({
        url: 'http://'+app.globalData.baseurl+':8082/api/customer/foodList',
        method:"GET",
        success:(res)=>{
          this.setData({
            foodlist:res.data.data
          })
          // 为 foodlist 数组中的每个对象添加 ordernumber 和 minusStatus 属性
          const newData = this.data.foodlist.map((item) => {
            item.ordernumber = 0;
            item.minusStatus = 'disabled';
            item.inputStatus = 'disabled';
            return item;
          });
          this.setData({
            foodlist: newData
          });
          console.log(this.data.foodlist);
          var that=this;
      for(var i=0;i<that.data.foodlist.length;i++){
        var oneurl=that.data.foodlist[i].img;
        that.data.imgurlslist.push(oneurl);
      }
      this.observeItem();
          },
        false:()=>{
          console.log("erro")
        }
      })

     
    },

    //监测菜品试图是否离开界面，以此来高亮相应的菜品种类栏目
    observeItem() {
      // 使用唯一的 id 来创建 IntersectionObserver
     // console.log(this.data.idarray[1]);
      this.data.idarray.forEach((item) => {     
        const observer = wx.createIntersectionObserver(this);
        this.data.observers.push(observer);
       observer.relativeToViewport().observe('#m_'+item, (res) => {
        if (res.intersectionRatio > 0) {
          this.setData({
            curId:this.data.foodlist[item].foodtype,
            openobservs:true,
          })
          console.log(`元素 ${item} 进入视口`);
        } else {
          console.log(`元素 ${item} 离开视口`);
        }
      });
     
    });
    },

    // 停止监听
    stopObserving() {
      // 停止所有的 IntersectionObserver 对象
      this.data.observers.forEach(observer => {
        observer.disconnect();
      });
      this.setData({
        openobservs:false
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
    //选择桌号
    handleNumberChange(e) {
      this.setData({
        table: e.detail.value
      })
    },
    //输入完桌号后隐藏桌号按钮
    sentTable(e){
        wx.request({
          url: 'http://'+app.globalData.baseurl+':8082/api/waiter/table',
          method:"POST",
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data:{
            tableid: this.data.table,
          
          },
          success:(res)=>{
            wx.showToast({
              title: '绑定桌号成功',
            })
            this.setData({
              table: this.data.table,
              enterTable: 1
            })
          }
        })
      
    },
    //实时更新输入框
    inputHandler(e){
      this.setData({
        msg:e.detail.value
      })
    },
    
  
    //查看所有菜品接口
    allFood(){
        wx.request({
            url: 'http://'+app.globalData.baseurl+':8082/api/customer/foodList',
            method:"GET",
            success:(res)=>{
              console.log("成功调用");
              const backendItems = res.data.data;
              this.copyFoodList(backendItems)
            }
          })      
    },
    copyFoodList(backendItems){
        const globalItems =[];
        for(let i=0;i<backendItems.length;i++)
        {
          const item=backendItems[i];
          globalItems.push(item);
        }
        const app=getApp();
        this.data.orderItems=globalItems;
      },
      
      //顾客端移植
      //关闭商品详情页
    close: function() {
      this.setData({
        show: false
      });
    },

   

    //打开商品详情页
    showcurrentorder(){
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animdata: animation.export(),
        show: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animdata: animation.export()
        })
      }.bind(this), 200)
    },

  //计算当前菜品总价
  gettoltalprice(){
    var that=this;
    var num=0;
   for(var i=0;i<that.data.orderfoodlist.length;i++){
     num=num+(that.data.orderfoodlist[i].price*that.data.orderfoodlist[i].number)
   } 
   this.setData({
     totalPrice:num
   })
  },

    //点餐界面菜品加减绑定
  bindMinus(e){
    if(this.data.orderfoodnumber==1){
      this.hideModal();
      }
    const index = e.currentTarget.dataset.index; 
    //console.log(this.data.foodlist[index].ordernumber);
    var minusStatus = this.data.foodlist[index].ordernumber==1 ? 'disabled':'minusnormal';
    var inputStatus = this.data.foodlist[index].ordernumber==1 ? 'disabled':'inputnormal';  
    var oneitem={foodid:0,name:"",price:0,number:0};
    this.setData({   
      ['foodlist[' + index + '].minusStatus']: minusStatus ,
      ['foodlist[' + index + '].inputStatus']: inputStatus
    });  
    //循环判断点的菜是不是在orderfoodlist里面已经有了条目，有条目且数量不为1则直接在条目里减少数量，数量为1则删除条目
    var p=1;
    var that=this;
    for (var i = 0; i < that.data.orderfoodlist.length; i++) { 
      var item = that.data.foodlist[index];
      if(item.foodid==that.data.orderfoodlist[i].foodid){
        if(that.data.orderfoodlist[i].number==1)
        {
          const newArray = that.data.orderfoodlist.slice(); // 复制原始数组
          newArray.splice(i, 1); // 使用splice移除元素
          that.setData({
            orderfoodlist: newArray, // 更新数据
          });
          break;
        }else{
          that.setData({
            ['orderfoodlist[' + i + '].number']:that.data.orderfoodlist[i].number-1,
           })
           p=0;
           break;
        }
    }
  };
  console.log(this.data.orderfoodlist);
    const currentOrdernumber = this.data.foodlist[index].ordernumber;
    this.setData({
      ['foodlist[' + index + '].ordernumber']:currentOrdernumber-1,
      orderfoodnumber:this.data.orderfoodnumber-1,
      })
      this.gettoltalprice();
  },

  
//点餐界面加号绑定
  bindPlus: function(e) {  
    if(this.data.orderfoodnumber==0){
      this.showModal();
    }
    //console.log(this.data.orderfoodnumber);
    //循环判断点的菜是不是在orderfoodlist里面已经有了条目，有条目且数量不为0则直接在条目里增加数量，数量为0则创建条目
    var oneitem={foodid:0,name:"",price:0,number:0};
    const index = e.currentTarget.dataset.index;
    if(this.data.foodlist[index].ordernumber==0)
    {
      this.setData({ ['foodlist[' + index + '].minusStatus']: 'minusnormal'})
    }
    if(this.data.foodlist[index].ordernumber==0)
    {
      this.setData({ ['foodlist[' + index + '].inputStatus']: 'inputnormal'})
    }
    const currentOrdernumber = this.data.foodlist[index].ordernumber;
    //循环判断点的菜是不是在orderfoodlist里面已经有了条目
    var p=1;
    var that=this;
    for (var i = 0; i < that.data.orderfoodlist.length; i++) {
      var item = that.data.foodlist[index];
      if(item.foodid==that.data.orderfoodlist[i].foodid){
        that.setData({
        ['orderfoodlist[' + i + '].number']:that.data.orderfoodlist[i].number + 1,
       })
       p=0;
       break;
    }
  };
    //如果p==1则没有，需要添加
    if(p==1)
    {
      oneitem.foodid=this.data.foodlist[index].foodid,
      oneitem.name=this.data.foodlist[index].name,
      oneitem.price=this.data.foodlist[index].price,
      oneitem.number=1;
      that.setData({
      orderfoodlist: this.data.orderfoodlist.concat(oneitem)
    })
    }
    this.setData({
      ['foodlist[' + index + '].ordernumber']:currentOrdernumber+1,
      orderfoodnumber:this.data.orderfoodnumber+1,
      })
      this.gettoltalprice();
      console.log(this.data.orderfoodlist);
      
},  

//点餐界面输入框事件 
bindManual: function(e) {  
  var num = parseFloat(e.detail.value);  
  const index = e.currentTarget.dataset.index; 
    var that=this;
    var temp=0;
    var p=1;
    for (var i = 0; i < that.data.orderfoodlist.length; i++) { 
      var item = that.data.foodlist[index];
      if(item.foodid==that.data.orderfoodlist[i].foodid){
        temp=i;
        p=0;
        that.setData({
          ['orderfoodlist[' + i + '].number']:num,
          orderfoodnumber:that.data.orderfoodnumber-that.data.orderfoodlist[i].number+num,
          })
      }
    };
  if(num==0)
  {
    const newArray = this.data.orderfoodlist.slice(); // 复制原始数组
    newArray.splice(temp, 1); // 使用splice移除元素
    this.setData({
      orderfoodlist: newArray, // 更新数据
      ['foodlist[' + index + '].minusStatus']: "disabled",
      ['foodlist[' + index + '].inputStatus']: "disabled",
    });
  }else{
    this.setData({
      ['foodlist[' + index + '].ordernumber']:num,
     })
    }
  var that1=this;
  if(that1.data.orderfoodnumber==0){
    that1.hideModal();
    }
    this.gettoltalprice();
  console.log(this.data.orderfoodlist); 
} ,

//详情弹窗已点菜品减号绑定
bindorderminus(e){
  var that1=this;
  if(that1.data.orderfoodnumber==1){
    that1.hideModal();
    that1.close();
    }
  const index = e.currentTarget.dataset.index; 
  var that=this;
  var temp=0;
  for (var i = 0; i < that.data.foodlist.length; i++) { 
    var item = that.data.orderfoodlist[index];
    if(item.foodid==that.data.foodlist[i].foodid){
      temp=i;
      that.setData({
        ['foodlist[' + i + '].ordernumber']:that.data.foodlist[i].ordernumber-1,
        orderfoodnumber:that.data.orderfoodnumber-1,
        })
  }
};
if(this.data.orderfoodlist[index].number==1)
{
  const newArray = this.data.orderfoodlist.slice(); // 复制原始数组
  newArray.splice(index, 1); // 使用splice移除元素
  this.setData({
    orderfoodlist: newArray, // 更新数据
    ['foodlist[' + temp + '].minusStatus']: "disabled",
    ['foodlist[' + temp + '].inputStatus']: "disabled",
  });
}else{
  this.setData({
    ['orderfoodlist[' + index + '].number']:this.data.orderfoodlist[index].number-1,
   })
}
this.gettoltalprice();
console.log(this.data.orderfoodlist);
},

//详情弹窗已点菜品加号绑定
bindorderplus(e){
  const index = e.currentTarget.dataset.index; 
  var that=this;
  for (var i = 0; i < that.data.foodlist.length; i++) { 
    var item = that.data.orderfoodlist[index];
    if(item.foodid==that.data.foodlist[i].foodid){
      that.setData({
        ['foodlist[' + i + '].ordernumber']:that.data.foodlist[i].ordernumber+1,
        orderfoodnumber:that.data.orderfoodnumber+1,
        })
  }
};
  this.setData({
    ['orderfoodlist[' + index + '].number']:this.data.orderfoodlist[index].number+1,
  })
  this.gettoltalprice();
console.log(this.data.orderfoodlist);
},

//详情弹窗已点菜品输入框绑定
bindnumber: function(e) {  
  var num =  parseFloat(e.detail.value);  
  const index = e.currentTarget.dataset.index; 
    var that=this;
    var temp=0;
    for (var i = 0; i < that.data.foodlist.length; i++) { 
      var item = that.data.orderfoodlist[index];
      if(item.foodid==that.data.foodlist[i].foodid){
        temp=i;
        that.setData({
          ['foodlist[' + i + '].ordernumber']:num,
          orderfoodnumber:that.data.orderfoodnumber-that.data.orderfoodlist[index].number+num,
          })
      }
    };
  if(num==0)
  {
    const newArray = this.data.orderfoodlist.slice(); // 复制原始数组
    newArray.splice(index, 1); // 使用splice移除元素
    this.setData({
      orderfoodlist: newArray, // 更新数据
      ['foodlist[' + temp + '].minusStatus']: "disabled",
      ['foodlist[' + temp + '].inputStatus']: "disabled",
    });
  }else{
    this.setData({
      ['orderfoodlist[' + index + '].number']:num,
     })
    }
  var that1=this;
  if(that1.data.orderfoodnumber==0){
    that1.hideModal();
    that1.close();
    }
  this.gettoltalprice();
  console.log(this.data.orderfoodlist);
} ,

//点击放大图片
previewImage: function (e) {
  const currentUrl = e.currentTarget.dataset.src; // 获取当前点击的图片链接
  const urls = this.data.imgurlslist; // 这里只有一张图片，也可以传入多张图片链接到数组中
  wx.previewImage({
    current: currentUrl, 
    urls: urls, 
  });
},

//清空购物车
clearshop(){
  this.close();
  this.hideModal();
  this.data.orderfoodlist.splice(0,this.data.orderfoodlist.length);
  var that=this;
  for(var i=0;i<that.data.foodlist.length;i++)
  {
    that.data.foodlist[i].ordernumber=0;
    that.data.foodlist[i].minusStatus='disabled';
    that.data.foodlist[i].inputStatus='disabled';
  }
  var newar=this.data.orderfoodlist;
  var newary=this.data.foodlist;
  this.setData({
   orderfoodlist:newar,
   foodlist:newary,
   totalPrice:0
  })
  console.log(newary);
},




//点击左侧栏目跳到相应菜品界面
  switchNav: function (e) {
    var page = this;
    var id = e.target.id;
    if (this.data.currentTab == id) {
      return false;
    } else {
      page.setData({
        currentTab: id
      });
    }
    page.setData({
      active: id
    });
  },

  //点击菜单
  clickMenu:function(e){
    this.stopObserving();
    var id = e.currentTarget.dataset.id;
    var num;
    if(id==1) num=1 ;
    if(id==2) num=8 ;
    if(id==3) num=11 ;
    if(id==4) num=19 ;
    if(id==5) num=25 ;
    if(id==6) num=32 ;
    if(id==7) num=43 ;
    if(id==8) num=53 ;
    if(id==9) num=55 ;
    if(id==10) num=68 ;
    if(id==11) num=83 ;
    if(id==12) num=87 ;
    if(id==13) num=89 ;
   this.setData({
    toView: num,
    curId:id,
  })  ;
              
              
  },

  

  

  
  

//显示对话框
 showModal: function () {
   // 显示遮罩层
  
   var animation = wx.createAnimation({
     duration: 200,
     timingFunction: "linear",
     delay: 0
   })
   this.animation = animation
   animation.translateY(300).step()
   this.setData({
     animationData: animation.export(),
     showModalStatus: true
   })
   setTimeout(function () {
     animation.translateY(0).step()
     this.setData({
       animationData: animation.export()
     })
   }.bind(this), 200)
  
 },

 //隐藏对话框
 hideModal: function () {
   // 隐藏遮罩层
   var animation = wx.createAnimation({
     duration: 200,
     timingFunction: "linear",
     delay: 0
   })
   this.animation = animation
   animation.translateY(300).step()
   this.setData({
     animationData: animation.export(),
   })
   setTimeout(function () {
     animation.translateY(0).step()
     this.setData({
       animationData: animation.export(),
       showModalStatus: false
     })
   }.bind(this), 200)
 },
    //获取菜品 备用
    getitems(){
    wx.request({
      url: 'http://'+app.globalData.baseurl+':8082/api/customer/foodList',
      method:"GET",
      success:(res)=>{
        console.log("成功调用")
        const backendItems = res.data.data;
        this.copyFoodList(backendItems)
      }
    })
    
  },

    //跳转到用餐时的页面
    toEating(){
        wx.navigateTo({
          url: '/pages/eating/eating',
        })
    },
    
    
    //查看所有菜品接口
    findallfood(){
      wx.request({
        url: 'http://192.168.102.155:8082/api/customer/foodList',
        method:"GET",
        success:(res)=>{
        this.data.foodlist=res.data.data;
        console.log(res.data);
        },
        false:()=>{
          console.log("erro")
        }
      })
    },
 
    //提交订单
  submitorder(){
    var that1=this;
    var that=this;
    var items1 = [];
    for (var i = 0; i < that.data.orderfoodlist.length; i++) {
      var foodItem = {
        "foodid": that.data.orderfoodlist[i].foodid,
        "quantity": that.data.orderfoodlist[i].number,
        "price": that.data.orderfoodlist[i].price * that.data.orderfoodlist[i].number
      };
      items1.push(foodItem);
    }
  
    console.log(items1)
    var rawData ={
      tableid: this.data.table,
      totalprice: this.data.totalPrice,
      items:items1
      // 添加更多键值对，根据你的数据需求
   };
   wx.request({
    url: 'http://'+app.globalData.baseurl+':8082/api/customer/submitOrder',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data:rawData,
    success: function (res) {
      // 请求成功的回调函数
      wx.showToast({
        title: '下单成功',
        icon:'success',
      })
      that1.setData({
        enterTable:0,
        orderfoodlist:[],
        orderfoodnumber:0,
      })
      that1.clearshop();
    },
    fail: function (error) {
      // 请求失败的回调函数
      console.error(error);
    }
  });
  },
})