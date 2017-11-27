import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Http} from "../../../common/http/Http";
import {DataTool} from "../../../common/data/DataTool";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
@Component({
  selector:'order-detail',
  templateUrl:'./Order.component.html',
  styleUrls:['Order.component.css']
})

export class OrderComponent implements OnInit{
  order:any={};
  orderLogList:any=[];//订单日志列表
  page:any={
    pageNo:1,
    pageSize:10,
    total:0
  };
  ngLoad:boolean=false;
  constructor(private router:Router,private route:ActivatedRoute,private nzMessage:NzMessageService,
              private http:Http,private dataTool:DataTool,private nzModal:NzModalService){}
  ngOnInit(){
    this.init();
    this.pageChangeHandler(1);
  }

  /**
   * 初始化
   */
  init(){
    console.log(this.route.params['value'].id)
    this.http.get("backstage/order/findById?id="+this.route.params['value'].id).subscribe(res=>{
      console.log(res);
      this.order = res["data"];
    },err=>{
      console.log(err);
    })
  }

  /**
   * 保存
   */
  save(){
    this.nzModal.confirm({
      title:"提示",
      content:"确认进行修改吗？",
      onOk:()=>{
        this.update();
      }
    })
  }

  /**
   * 返回
   */
  back(){
    this.router.navigate(["../../order-list"],{relativeTo:this.route});
  }

  /**
   * 查看商品详情
   * @param id 商品id
   */
  checkGoodDetail(id){
    this.router.navigate(["../../good-detail",id],{relativeTo:this.route});
  }

  /**
   * 修改订单
   */
  update(){
    this.http.post("backstage/order/modify",this.order).subscribe(
      res=>{
        if(res["result"]==1){
          this.nzMessage.success("修改成功");
        }else {
          this.nzMessage.error(res["error"].message);
        }
      },
      err=>{
        console.log(err);
      }
    )
  }

  /**
   * 判断付款状态
   * @param val
   * *1 待付款
   * 2 待发货
   * 3 待收货
   * 4 已完成
   * 5 退款
   * 6 关闭
   * 7 待评价
   * 8 已评价
   */
  justifyPayStatus(val){
    switch(val)
    {
      case '1':
        return "待付款";
      case '2':
        return "待发货";
      case '3':
        return "待收货";
      case '4':
        return "已完成";
      case '5':
        return "退款";
      case '6':
        return "关闭";
      case '7':
        return "待评价";
      case '8':
        return "已评价";
    }
  }

  /*分页*/
  pageChangeHandler(val){
    this.ngLoad=true;
    this.page.pageNo=val;
    let url = 'backstage/order/findOrderLogByOrderId?orderId='+this.route.params['value'].id+'&pageNo='
      +this.page.pageNo+'&pageSize='+this.page.pageSize;
    this.http.get(url).subscribe(res=>{
        this.ngLoad=false;
        if(res["total"]!=0){
          this.orderLogList = res["list"];
          this.page.total = res["total"];
        }else {
          this.orderLogList = res["list"];
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
    let url = 'backstage/order/findOrderLogByOrderId?orderId='+this.route.params['value'].id+'&pageNo='
      +this.page.pageNo+'&pageSize='+this.page.pageSize;
    this.http.get(url).subscribe(res=>{
        this.ngLoad=false;
        if(res["total"]!=0){
          this.orderLogList = res["list"];
          this.page.total = res["total"];
        }else {
          this.orderLogList = res["list"];
          this.page.total = res["total"];
        }
      },
      err=>{
        this.ngLoad=false;
        console.log(err);
      });
  };

}
