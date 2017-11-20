import {Component, OnInit} from "@angular/core";
import {PageService} from "../../../service/page/Page.service";
import {Router, ActivatedRoute} from "@angular/router";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {isNull} from "util";
import {isUndefined} from "util";
import {Http} from "../../../common/http/Http";
import {HttpData} from "../../../http/HttpData";

@Component({
  selector:"order-list",
  templateUrl:"./OrderList.component.html",
  styleUrls:["./OrderList.component.css"]
})

export class OrderListComponent implements OnInit{
  picUrl:string;
  ngLoad:boolean=false;//加载中标志
  searchKey:string='';//关键字
  orderList:any[]=[];//订单列表
  isCollapse:boolean=false;
  isDeliveryShow:boolean=false;
  //分页对象
  page:any={
    pageNo:1,
    pageSize:10,
    total:0
  };
  returnMoney:number=0;
  failRemark:string;
  condition:any={};
  deliveryObj:any={};
  constructor(private pageObj:PageService,private router:Router,private http:Http,private PicUrl:HttpData,
              private route:ActivatedRoute,private nzMessage:NzMessageService,private nzModal:NzModalService){}

  ngOnInit(){
    this.picUrl = this.PicUrl.PicUrl;
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    this.ngLoad=true;
    this.pageObj.pageChange("backstage/order/findByCondition",1,10).subscribe(res=>{
      console.log(res);
      this.ngLoad=false;
      if(res["total"]!=0){
        this.orderList = res["list"];
        this.page.total = res["total"];
      }else {
        this.orderList = res["list"];
        this.page.total = res["total"];
      }
    },err=>{
      console.log(err);
      this.nzMessage.error("系统错误")
    })
  }
  /**
   * 页面跳转
   * @param name
   * @param val
   */
  skipToPage(name,val){
    console.log(name);
    if(val){
      this.router.navigate([".."+name,val],{relativeTo:this.route});
    }else{
      this.router.navigate([".."+name],{relativeTo:this.route});
    }
  }

  /*分页*/
  pageChangeHandler(val){
    this.ngLoad=true;
    this.page.pageNo=val;
    let url = 'backstage/order/findByCondition?pageNo='+this.page.pageNo+'&pageSize='+this.page.pageSize+'&searchKey='+
        this.searchKey;
    for(let key in this.condition){
     if(!isNull(this.condition[key]&&!isUndefined(this.condition[key]))){
       url+='&'+key+'='+this.condition[key];
     }
    }
    this.http.get(url).subscribe(res=>{
        this.ngLoad=false;
        if(res["total"]!=0){
          this.orderList = res["list"];
          this.page.total = res["total"];
        }else {
          this.orderList = res["list"];
          this.page.total = res["total"];
        }
      },
      err=>{
        this.ngLoad=false;
        console.log(err);
      });
  };
  /*size改变*/
  pageSizeChangeHandler(val){
    this.ngLoad=true;
    this.page.pageSize=val;
    let url = 'backstage/order/findByCondition?pageNo='+this.page.pageNo+'&pageSize='+this.page.pageSize+'&searchKey='+
      this.searchKey;
    for(let key in this.condition){
      if(!isNull(this.condition[key]&&!isUndefined(this.condition[key]))){
        url+='&'+key+'='+this.condition[key];
      }
    }
    this.http.get(url).subscribe(res=>{
        this.ngLoad=false;
        if(res["total"]!=0){
          this.orderList = res["list"];
          this.page.total = res["total"];
        }else {
          this.orderList = res["list"];
          this.page.total = res["total"];
        }
      },
      err=>{
        this.ngLoad=false;
        console.log(err);
      });
  };

  /**
   * 关键字查询
   */
  search(){
    this.page.pageNo=1;
    let url = 'backstage/order/findByCondition?pageNo='+this.page.pageNo+'&pageSize='+this.page.pageSize+'&searchKey='+
      this.searchKey;
    for(let key in this.condition){
      if(!isNull(this.condition[key]&&!isUndefined(this.condition[key]))){
        url+='&'+key+'='+this.condition[key];
      }
    }
    this.http.get(url).subscribe(res=>{
      console.log(res);
        this.ngLoad=false;
        if(res["total"]!=0){
          this.orderList = res["list"];
          this.page.total = res["total"];
        }else {
          this.orderList = res["list"];
          this.page.total = res["total"];
        }
      },
      err=>{
        console.log(err);
      });
  }

  /**
   * 禁止开始时间
   * @param startValue
   * @returns {boolean}
   */
  disabledStartDate=(startValue)=>{
    if(!startValue||!this.condition.endDate){
      return false;
    }
    return startValue.getTime()>=this.condition.endDate.getTime();
  }
  /**
   * 禁止结束时间
   * @param endValue
   * @returns {boolean}
   */
  disabledEndDate=(endValue)=>{
    if(!this.condition.startDate||!endValue){
      console.log(1);
      return false
    }
    return endValue.getTime() <= this.condition.startDate.getTime();
  }

  /**
   * 成功退款
   * @param id
   * @param flag
   */
  returnMoneySuccessConfirm(id,content,totalFee,title){
    this.nzModal.confirm({
      title:title,
      content:content,
      iconType:"waring",
      maskClosable:false,
      onOk:()=>{
        this.returnMoneySuccess(id,totalFee);
      }
    })
  }
  returnMoneySuccess(id,totalFee){
    console.log(this.returnMoney);
    if(this.returnMoney>totalFee){
      this.nzMessage.error("退款金额无法大于订单总额");
      return;
    }
    this.http.post("backstage/order/audit/refund?orderId="+id+'&flag=1&remark=&refundFee='+this.returnMoney,null).subscribe(
      res=>{
        console.log(res)
        if(res["result"]==1){
          this.returnMoney=0;
        }
      },
      err=>{console.log(err)}
    )
  }
  returnMoneyFailConfirm(id,content,title){
   let fail =  this.nzModal.confirm({
      title:"操作提示",
      content:content,
      iconType:"waring",
      maskClosable:false,
      onOk:()=>{
        this.returnMoneyFail(id);
      }
    });
  }
  returnMoneyFail(id){
    console.log(this.failRemark);
    this.http.post("backstage/order/audit/refund?orderId="+id+'&flag=0&refundFee=0&remark='+this.failRemark,null).subscribe(
      res=>{
        console.log(res)
        if(res["result"]==1){
          this.failRemark='';
        }
      },
      err=>{console.log(err)}
    )
  }

  /**
   * 打开模态
   * @param orderId
   */
  openDeliveyModal(orderId){
    this.deliveryObj.orderId = orderId;
    this.isDeliveryShow=!this.isDeliveryShow;
  }
  /**
   * 发货
   * @param orderId
   */
  sendGoood(orderId){
    if(isUndefined(this.deliveryObj['expressName'])||isUndefined(this.deliveryObj['deliveryNo'])){
      this.nzMessage.warning("请将表单填写完整");
      return;
    }
    let url = "backstage/order/sendGood?orderId="+this.deliveryObj.orderId+"&deliveryNo="+this.deliveryObj.deliveryNo+"&expressName="+this.deliveryObj.expressName;
    this.http.post(url).subscribe(
      res=>{
        if(res["result"]==1){
          this.pageChangeHandler(1);
          this.deliveryObj={};
          this.isDeliveryShow=!this.isDeliveryShow;
        }else {
          this.nzMessage.warning(res["error"].message);
        }
      },
      err=>{
        console.log(err);
      }
    )
  }
}
