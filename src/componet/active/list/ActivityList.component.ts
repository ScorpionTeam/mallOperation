import {Component} from "@angular/core";
import {PageService} from "../../../service/page/Page.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {Http} from "../../../common/http/Http";
import {DataTool} from "../../../common/data/DataTool";
import {ActivityService} from "../../../service/active/Activity.service";
@Component({
  selector:"activity-list",
  templateUrl:"./ActivityList.component.html",
  styleUrls:["./ActivityList.component.css"],
  providers:[ActivityService]
})

export class ActivityListComponent{
  searchKey:string='';//关键字
  activityList:any[]=[];//订单列表
  isCollapse:boolean=false;
  //分页对象
  page:any={
    pageNo:1,
    pageSize:10,
    total:0
  };
  condition:any={};
  idList:any=[];//批量操作id集合
  checkAll:boolean=false;
  constructor(private pageObj:PageService,private router:Router,private http:Http,private dataTool:DataTool,
              private route:ActivatedRoute,private nzMessage:NzMessageService,private nzModal:NzModalService,
              private service:ActivityService){}

  ngOnInit(){
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    this.service.pageList(this.page.pageNo,this.page.pageSize,this.searchKey).subscribe(res=>{
        if(res["total"]!=0){
          this.activityList = res["list"];
          this.page.total = res["total"];
        }else {
          this.activityList = res["list"];
          this.page.total = res["total"];
        }
      });
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
  pageChangeHandler(val:any) {
    this.page.pageNo = val;
    this.service.pageList(this.page.pageNo, this.page.pageSize, this.searchKey, this.condition).subscribe(res => {
        if (res["total"] != 0) {
          this.activityList = res["list"];
          this.page.total = res["total"];
        } else {
          this.activityList = res["list"];
          this.page.total = res["total"];
        }
      },
      err => {
        console.log(err);
      });
  }
  /*size改变*/
  pageSizeChangeHandler(val:any){
    this.page.pageSize=val;
    this.service.pageList(this.page.pageNo,this.page.pageSize,this.searchKey,this.condition).subscribe(res=>{
        if(res["total"]!=0){
          this.activityList = res["list"];
          this.page.total = res["total"];
        }else {
          this.activityList = res["list"];
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
    this.service.pageList(this.page.pageNo,this.page.pageSize,this.searchKey,this.condition).subscribe(res=>{
        if(res["total"]!=0){
          this.activityList = res["list"];
          this.page.total = res["total"];
        }else {
          this.activityList = res["list"];
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
        if(this.idList.length==this.activityList.length){
          this.checkAll=true;
        }
      }else {
        let index = this.idList.indexOf(val);
        this.idList.splice(index,1);
        this.checkAll=false;
      }
    }else {
      /*全选或全不选*/
      if(flag){
        for(let i =0;i<val.length;i++){
          if(this.idList.length==0){
            this.activityList[i]['checked']=true;
            this.idList.push(val[i].id);
            continue;
          }
          //检测是否在idList中已存在
          for(let index in this.idList){
            if(val[i].id==this.idList[index]){
              break;
            }else if((Number(index)+1)==this.idList.length){
              this.activityList[i]['checked']=true;
              this.idList.push(val[i].id);
            }
          }
        }
      }else {
        for(let i =0;i<val.length;i++){
          this.activityList[i]['checked']=false;
        }
        this.idList=[]
      }
    }
    console.log(this.idList);
  };

  /**
   * 改变活动状态
   * @param status
   */
  changeActivityStatus(status:string){
    if(this.idList.length==0){
      this.nzMessage.warning("请勾选要开启/结束的活动");
      return
    }
    this.http.post("backstage/activity/batchModifyStatus",{status:status,idList:this.idList}).subscribe(
      res=>{
        if(res["result"]==1){
          this.nzMessage.success("操作成功");
          this.pageChangeHandler(1);
          this.checkAll=false;
          this.idList=[];
        }
      },
      err=>{
        console.log(err);
      }
    )
  }
}
