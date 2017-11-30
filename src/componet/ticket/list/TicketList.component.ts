import {Component} from "@angular/core";
import {PageService} from "../../../service/page/Page.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd";
import {Http} from "../../../common/http/Http";
import {DataTool} from "../../../common/data/DataTool";
import {TicketService} from "../../../service/ticket/Ticket.service";
@Component({
  selector:"ticket-list",
  templateUrl:"TicketList.component.html",
  styleUrls:["TicketList.component.css"],
  providers:[TicketService]
})
export class  TicketListComponent{
  searchKey:string='';//关键字
  ticketList:any[]=[];//订单列表
  isCollapse:boolean=false;
  idList:any=[];//批量操作id集合
  checkAll:boolean=false;//全选标志
  //分页对象
  page:any={
    pageNo:1,
    pageSize:10,
    total:0
  };
  condition:any={};
  constructor(private pageObj:PageService,private router:Router,private http:Http,private dataTool:DataTool,
              private route:ActivatedRoute,private nzMessage:NzMessageService,private ticketService:TicketService){}

  ngOnInit(){
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    this.ticketService.pageList(this.page.pageNo,this.page.pageSize,this.condition).subscribe(res=>{
      console.log(res);
      if(res["total"]!=0){
        this.ticketList = res["list"];
        this.page.total = res["total"];
      }else {
        this.ticketList = res["list"];
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
  skipToPage(name:any,val?:any){
    if(val){
      this.router.navigate([".."+name,val],{relativeTo:this.route});
    }else{
      this.router.navigate([".."+name],{relativeTo:this.route});
    }
  }

  /*分页*/
  pageChangeHandler(val:any){
    this.page.pageNo=val;
    this.condition.searchKey = this.searchKey;
    this.ticketService.pageList(this.page.pageNo,this.page.pageSize,this.condition).subscribe(res=>{
        if(res["total"]!=0){
          this.ticketList = res["list"];
          this.page.total = res["total"];
        }else {
          this.ticketList = res["list"];
          this.page.total = res["total"];
        }
      },
      err=>{
        console.log(err);
      });
  };
  /*size改变*/
  pageSizeChangeHandler(val:any){
    this.page.pageSize=val;
    this.condition.searchKey = this.searchKey;
    this.ticketService.pageList(this.page.pageNo,this.page.pageSize,this.condition).subscribe(res=>{
        if(res["total"]!=0){
          this.ticketList = res["list"];
          this.page.total = res["total"];
        }else {
          this.ticketList = res["list"];
          this.page.total = res["total"];
        }
      },
      err=>{
        console.log(err);
      });
  };

  /**
   * 关键字查询
   */
  search(){
    this.page.pageNo=1;
    this.condition.searchKey = this.searchKey;
    this.ticketService.pageList(this.page.pageNo,this.page.pageSize,this.condition).subscribe(res=>{
        console.log(res);
        if(res["total"]!=0){
          this.ticketList = res["list"];
          this.page.total = res["total"];
        }else {
          this.ticketList = res["list"];
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
  disabledStartDate=(startValue:any)=>{
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
  disabledEndDate=(endValue:any)=>{
    if(!this.condition.startDate||!endValue){
      console.log(1);
      return false
    }
    return endValue.getTime() <= this.condition.startDate.getTime();
  };

  /**
   * 选择
   * @param flag 选中标志
   * @param val 商品id
   * @param type 类型 0:全选，1:单选
   */
  selectItem(flag:any,val:any,type:any,index?:any){
    if(type==1){
      if(flag){
        this.idList.push(val);
        if(this.idList.length==this.ticketList.length){
          this.checkAll = true;
        }
      }else {
        let index = this.idList.indexOf(val);
        this.idList.splice(index,1);
        this.checkAll = false;
      }
    }else {
      /*全选或全不选*/
      if(flag){
        for(let i =0;i<val.length;i++){
          if(this.idList.length==0){
            this.ticketList[i]['checked']=true;
            this.idList.push(val[i].id);
            continue;
          }
          //检测是否在idList中已存在
          for(let index in this.idList){
            if(val[i].id==this.idList[index]){
              break;
            }else if((Number(index)+1)==this.idList.length){
              this.ticketList[i]['checked']=true;
              this.idList.push(val[i].id);
            }
          }
        }
      }else {
        for(let i =0;i<val.length;i++){
          this.ticketList[i]['checked']=false;
        }
        this.idList=[]
      }
    }
    console.log(this.idList);
  };


  /**
   * 批量删除
   */
  outStore(){
    if(this.idList.length==0){
      this.nzMessage.warning("请先勾选要删除的优惠券");
      return
    }
    this.ticketService.delTickets({idList:this.idList}).subscribe(
      res=>{
        if(res["result"]==1){
          this.nzMessage.success("删除成功");
          this.checkAll=false;
          this.pageChangeHandler(1);
          this.idList = [];
        }
      },
      err=>{
        console.log(err);
      }
    )
  }
}
