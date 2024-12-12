// pages/shopping/shopping.js
const app=getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
      table: 1,
      orderItems:{},
      items:[],
      totalPrice: 0,
      ranks:1,
      enterTable: 0,
      ordereditems:[],
      phonenumber:"",
      items: [],
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
  idarray:[1,8,11,19,25,32,43,53,55,68,83,87,89]//每个分类的第一个菜品
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      wx.setNavigationBarTitle({
        title: '湖底捞点餐',
      })
      this.setData({
        foodlist:app.globalData.foodlist,
        phonenumber:app.globalData.phonenumber,
        ranks:app.globalData.ranks
      })
      // 为 foodlist 数组中的每个对象添加 ordernumber 和 minusStatus 属性
      const newData = this.data.foodlist.map((item) => {
        item.ordernumber = 0;
        item.minusStatus = 'disabled';
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

    observeItem() {
      // 使用唯一的 id 来创建 IntersectionObserver
      this.data.idarray.forEach((item) => {     
        const observer = wx.createIntersectionObserver(this);
       observer.relativeToViewport().observe('#m_'+item, (res) => {
        if (res.intersectionRatio > 0) {
          this.setData({
            curId:this.data.foodlist[item].foodtype,
          })
          console.log(`元素 ${item} 进入视口`);
        } else {
          console.log(`元素 ${item} 离开视口`);
        }
      });
    });
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

    
    //实时更新输入框
    inputHandler(e){
      this.setData({
        msg:e.detail.value
      })
    },
    //提交订单接口
    
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
     var num1=0;
    switch(this.data.ranks){
      case 2: {
        num1 = Math.floor(that.data.orderfoodlist[i].price*0.96) 
        break
      }
      case 3: {
       num1 = Math.floor(that.data.orderfoodlist[i].price*0.92)
       break
     }
     case 4: {
       num1 = Math.floor(that.data.orderfoodlist[i].price*0.88)
       break
     }
     case 5: {
       num1 =Math.floor(that.data.orderfoodlist[i].price*0.85)
       break
     }
      default:{//1级会员
        num1 = Math.floor(that.data.orderfoodlist[i].price*1)
        break
      }
    }
     num=num+(num1*that.data.orderfoodlist[i].number)
   } 
   this.setData({
     totalPrice:num
   })
  },

    //菜品加减绑定
  bindMinus(e){
    if(this.data.orderfoodnumber==1){
      this.hideModal();
      }
    const index = e.currentTarget.dataset.index; 
    var minusStatus = this.data.foodlist[index].ordernumber==1 ? 'disabled':'normal';  
    var oneitem={foodid:0,name:"",price:0,number:0};
    this.setData({   
      ['foodlist[' + index + '].minusStatus']: minusStatus  
    });  
    //循环判断点的菜是不是在orderfoodlist里面已经有了条目
    var p=1;
    var that=this;
    for (var i = 0; i < that.data.orderfoodlist.length; i++) { 
      var item = that.data.foodlist[index];
      if(item.foodid==that.data.orderfoodlist[i].foodid){
        if(that.data.orderfoodlist[i].number==1)//找到对应的食物id，表示这个菜品之前已经点过
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
    const currentOrdernumber = this.data.foodlist[index].ordernumber;
    this.setData({
      ['foodlist[' + index + '].ordernumber']:currentOrdernumber-1,
      orderfoodnumber:this.data.orderfoodnumber-1,
      })
      this.gettoltalprice();
  },

  

  bindPlus: function(e) {  
    if(this.data.orderfoodnumber==0){
      this.showModal();
    }
    var oneitem={foodid:0,name:"",price:0,number:0};
    const index = e.currentTarget.dataset.index; 
    var minusStatus = this.data.foodlist[index].ordernumber>=this.data.foodlist[index].repository ? 'disabled' : 'normal';  
    this.setData({   
      ['foodlist[' + index + '].minusStatus']: minusStatus  
    });  
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
       
      console.log(this.data.foodlist[i].price)
       p=0;
       break;
    }
  };
    //如果p==1则没有，需要添加
    if(p==1)
    {
      oneitem.foodid=this.data.foodlist[index].foodid,
      oneitem.name=this.data.foodlist[index].name,
      oneitem.price=Math.floor(1*this.data.foodlist[index].price) ,
      oneitem.number=1;
      that.setData({
      orderfoodlist: this.data.orderfoodlist.concat(oneitem),
    })
    }
    this.setData({
      ['foodlist[' + index + '].ordernumber']:currentOrdernumber+1,
      orderfoodnumber:this.data.orderfoodnumber+1,
      })
      this.gettoltalprice();
      console.log(this.data.orderfoodlist);
      
},  

/* 输入框事件 */  
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

//已点菜品加减绑定
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
  });
}else{
  this.setData({
    ['orderfoodlist[' + index + '].number']:this.data.orderfoodlist[index].number-1,
   })
}
this.gettoltalprice();
console.log(this.data.orderfoodlist);
},

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

  clickMenu:function(e){
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
   })
  },

  onRightScroll:function(e){

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

    
    
    //查看所有菜品接口
    findallfood(){
      wx.request({
        url: 'http://'+app.globalData.baseurl+':8082/api/customer/foodList',
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
 //提交订单接口
  submitorder(){
    var that=this;
    var items1 = [];
    for (var i = 0; i < that.data.orderfoodlist.length; i++) {
      //根据会员等级折算价格
      var  Price
      switch(app.globalData.ranks)
      {
        case 1:
          {
            Price= Math.floor(1*that.data.orderfoodlist[i].price * that.data.orderfoodlist[i].number)
            break
          }
          case 2:
          {
            Price= Math.floor(0.96*that.data.orderfoodlist[i].price * that.data.orderfoodlist[i].number)
            break
          }
          case 3:
          {
            Price= Math.floor(0.92*that.data.orderfoodlist[i].price * that.data.orderfoodlist[i].number)
            break
          }
          case 4:
          {
            Price= Math.floor(0.88*that.data.orderfoodlist[i].price * that.data.orderfoodlist[i].number)
            break
          }
          case 5:
          {
            Price= Math.floor(0.85*that.data.orderfoodlist[i].price * that.data.orderfoodlist[i].number)
            break
          }
          
        
          
      }
      //添加数据 
      var foodItem = {
        "foodid": that.data.orderfoodlist[i].foodid,
        "quantity": that.data.orderfoodlist[i].number,
        "price": Price
      }
      items1.push(foodItem);
      console.log(items1)
    }
    
    var rawData ={
      tableid: app.globalData.tableid,
      totalprice: this.data.totalPrice,
      items:items1
      // 添加更多键值对，根据你的数据需求
   };
   //添加订单接口
   wx.request({
    url: 'http://'+app.globalData.baseurl+':8082/api/customer/submitOrder',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data:rawData,
    success: function (res) {
      //进入用餐状态，此时再点击点餐按钮进入用餐中页面 
      app.globalData.isEating=true
      
    },
    fail: function (error) {
      // 请求失败的回调函数
      console.error(error);
    },
    complete:()=>{
      wx.redirectTo({
        url: '/pages/eating/eating',
      }) 
    }
  });
  },
}) 




