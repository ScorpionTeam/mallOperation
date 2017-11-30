import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Http} from "../../../common/http/Http";
import {DataTool} from "../../../common/data/DataTool";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {OrderService} from "../../../service/order/Order.service";
@Component({
  selector:'order-detail',
  templateUrl:'./Order.component.html',
  styleUrls:['Order.component.css'],
  providers:[OrderService]
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
              private dataTool:DataTool,private nzModal:NzModalService, private orderService:OrderService){}
  ngOnInit(){
    this.init();
    this.pageChangeHandler(1);
  }

  /**
   * 初始化
   */
  init(){
    console.log(this.route.params['value'].id)
    this.orderService.findById(this.route.params['value'].id).subscribe(res=>{
      console.log(res);
      this.order = res["data"];
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
  checkGoodDetail(id:any){
    this.router.navigate(["../../good-detail",id],{relativeTo:this.route});
  }

  /**
   * 修改订单
   */
  update(){
    this.orderService.update(this.order).subscribe(
      res=>{
        if(res["result"]==1){
          this.nzMessage.success("修改成功");
        }else {
          this.nzMessage.error(res["error"].message);
        }
      });
  }

  /*分页*/
  pageChangeHandler(val:any){
    this.ngLoad=true;
    this.page.pageNo=val;
    this.orderService.pageListOrderLog(this.page.pageNo,this.page.pageSize,this.route.params["value"].id).subscribe(res=>{
        this.ngLoad=false;
        if(res["total"]!=0){
          this.orderLogList = res["list"];
          this.page.total = res["total"];
        }else {
          this.orderLogList = res["list"];
          this.page.total = res["total"];
        }
      });
  };
  /*size改变*/
  pageSizeChangeHandler(val:any){
    this.ngLoad=true;
    this.page.pageSize=val;
    this.orderService.pageListOrderLog(this.page.pageNo,this.page.pageSize,this.route.params["value"].id).subscribe(res=>{
        this.ngLoad=false;
        if(res["total"]!=0){
          this.orderLogList = res["list"];
          this.page.total = res["total"];
        }else {
          this.orderLogList = res["list"];
          this.page.total = res["total"];
        }
      });
  };

}
