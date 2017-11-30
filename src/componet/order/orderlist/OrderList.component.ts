import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {isUndefined} from "util";
import {Http} from "../../../common/http/Http";
import {HttpData} from "../../../http/HttpData";
import {DataTool} from "../../../common/data/DataTool";
import {OrderService} from "../../../service/order/Order.service";
import {TimePick} from "../../../common/data/TimePick";

@Component({
  selector:"order-list",
  templateUrl:"./OrderList.component.html",
  styleUrls:["./OrderList.component.css"],
  providers:[OrderService]
})

export class OrderListComponent implements OnInit{
  picUrl:string;
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
  constructor(private orderService:OrderService,private router:Router,private http:Http,private PicUrl:HttpData,
              private route:ActivatedRoute,private nzMessage:NzMessageService,private nzModal:NzModalService,
              private  dataTool:DataTool,private timePickTool:TimePick){}

  ngOnInit(){
    this.picUrl = this.PicUrl.PicUrl;
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    this.orderService.pageList({pageNo:this.page.pageNo,pageSize:this.page.pageSize}).subscribe(res=>{
      console.log(res);
      if(res["total"]!=0){
        this.orderList = res["list"];
        this.page.total = res["total"];
      }else {
        this.orderList = res["list"];
        this.page.total = res["total"];
      }
    })
  }
  /**
   * 页面跳转
   * @param name
   * @param val
   */
  skipToPage(name:string,val?:any){
    if(val){
      this.router.navigate([".."+name,val],{relativeTo:this.route});
    }else{
      this.router.navigate([".."+name],{relativeTo:this.route});
    }
  }

  /*分页*/
  pageChangeHandler(val:any){
    this.page.pageNo=val;
    this.condition.pageNo = this.page.pageNo;
    this.condition.pageSize = this.page.pageSize;
    this.condition.searchKey = this.searchKey;
    this.orderService.pageList(this.condition).subscribe(res=>{
        if(res["total"]!=0){
          this.orderList = res["list"];
          this.page.total = res["total"];
        }else {
          this.orderList = res["list"];
          this.page.total = res["total"];
        }
      });
  };
  /*size改变*/
  pageSizeChangeHandler(val:any){
    this.page.pageSize=val;
    this.condition.pageNo = this.page.pageNo;
    this.condition.pageSize = this.page.pageSize;
    this.condition.searchKey = this.searchKey;
    this.orderService.pageList(this.condition).subscribe(res=>{
        if(res["total"]!=0){
          this.orderList = res["list"];
          this.page.total = res["total"];
        }else {
          this.orderList = res["list"];
          this.page.total = res["total"];
        }
      });
  };

  /**
   * 关键字查询
   */
  search(){
    this.page.pageNo=1;
    this.condition.pageNo = this.page.pageNo;
    this.condition.pageSize = this.page.pageSize;
    this.condition.searchKey = this.searchKey;
    this.orderService.pageList(this.condition).subscribe(res=>{
      console.log(res);
        if(res["total"]!=0){
          this.orderList = res["list"];
          this.page.total = res["total"];
        }else {
          this.orderList = res["list"];
          this.page.total = res["total"];
        }
      })
  }

  /**
   * 禁止开始时间
   * @param startValue
   * @returns {boolean}
   */
  disabledStartDate=(startValue:any)=>{
    return this.timePickTool.disableStartTime(startValue,this.condition.endDate);
  };
  /**
   * 禁止结束时间
   * @param endValue
   * @returns {boolean}
   */
  disabledEndDate=(endValue:any)=>{
    return this.timePickTool.disableEndTime(endValue,this.condition.startDate);
  };

  /**
   *
   * @param id 订单id
   * @param content 内容
   * @param totalFee
   * @param title
   */
  returnMoneySuccessConfirm(id:any,content:any,totalFee:any,title:any){
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
  returnMoneySuccess(id:any,totalFee:any){
    if(this.returnMoney>totalFee){
      this.nzMessage.error("退款金额无法大于订单总额");
      return;
    }
    this.orderService.areggReturnMoney(id,this.returnMoney).subscribe(
      res=>{
        console.log(res)
        if(res["result"]==1){
          this.returnMoney=0;
          this.pageChangeHandler(1);
        }
      }
    )
  }
  returnMoneyFailConfirm(id:any,content:any){
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
  returnMoneyFail(id:any){
    console.log(this.failRemark);
    this.orderService.aginstReturnMoney(id,this.failRemark).subscribe(
      res=>{
        console.log(res);
        if(res["result"]==1){
          this.failRemark='';
        }
      }
    )
  }

  /**
   * 打开模态
   * @param orderId
   */
  openDeliveyModal(orderId:any){
    this.deliveryObj.orderId = orderId;
    this.isDeliveryShow=!this.isDeliveryShow;
  }
  /**
   * 发货
   * @param orderId
   */
  sendGoood(orderId:any){
    if(isUndefined(this.deliveryObj['expressName'])||isUndefined(this.deliveryObj['deliveryNo'])){
      this.nzMessage.warning("请将表单填写完整");
      return;
    }
    this.orderService.sendGood(this.deliveryObj.orderId,this.deliveryObj.deliveryNo,this.deliveryObj.expressName).subscribe(
      res=>{
        if(res["result"]==1){
          this.pageChangeHandler(1);
          this.deliveryObj={};
          this.isDeliveryShow=!this.isDeliveryShow;
        }else {
          this.nzMessage.warning(res["error"].message);
        }
      }
    )
  }
}
