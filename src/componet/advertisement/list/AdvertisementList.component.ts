import {Component} from "@angular/core";
import {PageService} from "../../../service/page/Page.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {Http} from "../../../common/http/Http";
import {isUndefined} from "util";
import {isNull} from "util";
@Component({
  selector:"banner-list",
  templateUrl:"./AdvertisementList.component.html"
})

export class AdvertisementListComonent{
  ngLoad:boolean=false;//加载中标志
  searchKey:string='';//关键字
  bannerList:any[]=[];//广告列表
  //分页对象
  page:any={
    pageNo:1,
    pageSize:10,
    total:0
  };
  condition:any={};
  idList:any=[];//批量操作id集合
  checkAll:boolean=false;
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
    this.pageObj.pageChange("backstage/banner/list",1,10).subscribe(res=>{
      console.log(res);
      this.ngLoad=false;
      if(res["total"]!=0){
        this.bannerList = res["list"];
        this.page.total = res["total"];
      }else {
        this.bannerList = res["list"];
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
    let url = 'backstage/banner/list?pageNo='+this.page.pageNo+'&pageSize='+this.page.pageSize+'&searchKey='+
      this.searchKey;
    for(let key in this.condition){
      if(!isNull(this.condition[key]&&!isUndefined(this.condition[key]))){
        url+='&'+key+'='+this.condition[key];
      }
    }
    this.http.get(url).subscribe(res=>{
        this.ngLoad=false;
        if(res["total"]!=0){
          this.bannerList = res["list"];
          this.page.total = res["total"];
        }else {
          this.bannerList = res["list"];
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
    let url = 'backstage/banner/list?pageNo='+this.page.pageNo+'&pageSize='+this.page.pageSize+'&searchKey='+
      this.searchKey;
    for(let key in this.condition){
      if(!isNull(this.condition[key]&&!isUndefined(this.condition[key]))){
        url+='&'+key+'='+this.condition[key];
      }
    }
    this.http.get(url).subscribe(res=>{
        this.ngLoad=false;
        if(res["total"]!=0){
          this.bannerList = res["list"];
          this.page.total = res["total"];
        }else {
          this.bannerList = res["list"];
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
    let url = 'backstage/banner/list?pageNo='+this.page.pageNo+'&pageSize='+this.page.pageSize+'&searchKey='+
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
          this.bannerList = res["list"];
          this.page.total = res["total"];
        }else {
          this.bannerList = res["list"];
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
      return false
    }
    return endValue.getTime() <= this.condition.startDate.getTime();
  };

  /**
   * 选择
   * @param flag 选中标志
   * @param val 广告id
   * @param type 类型 0:全选，1:单选
   */
  selectItem(flag,val,type,index?){
    if(type==1){
      if(flag){
        this.idList.push(val);
      }else {
        let index = this.idList.indexOf(val);
        this.idList.splice(index,1);
      }
    }else {
      /*全选或全不选*/
      if(flag){
        for(let i =0;i<val.length;i++){
          if(this.idList.length==0){
            this.bannerList[i]['checked']=true;
            this.idList.push(val[i].id);
            continue;
          }
          //检测是否在idList中已存在
          for(let index in this.idList){
            if(val[i].id==this.idList[index]){
              break;
            }else if((Number(index)+1)==this.idList.length){
              this.bannerList[i]['checked']=true;
              this.idList.push(val[i].id);
            }
          }
        }
      }else {
        for(let i =0;i<val.length;i++){
          this.bannerList[i]['checked']=false;
        }
        this.idList=[]
      }
    }
    console.log(this.idList);
  };

  /**
   * 改变广告状态
   * @param status
   */
  changeBannerStatus(status){
    if(this.idList.length==0){
      this.nzMessage.warning("请勾选要开启/结束的活动");
      return
    }
    this.http.post("backstage/banner/batchModifyStatus",{status:status,idList:this.idList}).subscribe(
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
