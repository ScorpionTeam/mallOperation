import {Component} from "@angular/core";
import {PageService} from "../../../service/page/Page.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {Http} from "../../../common/http/Http";
import {isUndefined} from "util";
import {isNull} from "util";
@Component({
  selector:"activity-list",
  templateUrl:"./ActivityList.component.html",
  styleUrls:["./ActivityList.component.css"]
})

export class ActivityListComponent{
  ngLoad:boolean=false;//加载中标志
  searchKey:string='';//关键字
  activityList:any[]=[];//订单列表
  isCollapse:boolean=false;
  //分页对象
  page:any={
    pageNo:1,
    pageSize:10,
    total:0
  };
  returnMoney:number=0;
  failRemark:string;
  condition:any={};
  constructor(private pageObj:PageService,private router:Router,private http:Http,
              private route:ActivatedRoute,private nzMessage:NzMessageService,private nzModal:NzModalService){}

  ngOnInit(){
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    this.ngLoad=true;
    this.pageObj.pageChange("backstage/activity/findByCondition",1,10).subscribe(res=>{
      console.log(res);
      this.ngLoad=false;
      if(res["total"]!=0){
        this.activityList = res["list"];
        this.page.total = res["total"];
      }else {
        this.activityList = res["list"];
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
    let url = 'backstage/activity/findByCondition?pageNo='+this.page.pageNo+'&pageSize='+this.page.pageSize+'&searchKey='+
      this.searchKey;
    for(let key in this.condition){
      if(!isNull(this.condition[key]&&!isUndefined(this.condition[key]))){
        url+='&'+key+'='+this.condition[key];
      }
    }
    this.http.get(url).subscribe(res=>{
        this.ngLoad=false;
        if(res["total"]!=0){
          this.activityList = res["list"];
          this.page.total = res["total"];
        }else {
          this.activityList = res["list"];
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
    let url = 'backstage/activity/findByCondition?pageNo='+this.page.pageNo+'&pageSize='+this.page.pageSize+'&searchKey='+
      this.searchKey;
    for(let key in this.condition){
      if(!isNull(this.condition[key]&&!isUndefined(this.condition[key]))){
        url+='&'+key+'='+this.condition[key];
      }
    }
    this.http.get(url).subscribe(res=>{
        this.ngLoad=false;
        if(res["total"]!=0){
          this.activityList = res["list"];
          this.page.total = res["total"];
        }else {
          this.activityList = res["list"];
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
    let url = 'backstage/activity/findByCondition?pageNo='+this.page.pageNo+'&pageSize='+this.page.pageSize+'&searchKey='+
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
  };

}
