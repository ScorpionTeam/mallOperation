import {Component} from "@angular/core";
import {PageService} from "../../../service/page/Page.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {Http} from "../../../common/http/Http";
import {isUndefined} from "util";
import {isNull} from "util";
import {HttpData} from "../../../http/HttpData";
import {DataTool} from "../../../common/data/DataTool";
@Component({
  selector:"brand-list",
  templateUrl:"./BrandList.component.html",
  styleUrls:["./BrandList.component.css"]
})

export class BrandListComponent{
  picUrl:string;
  ngLoad:boolean=false;//加载中标志
  searchKey:string='';//关键字
  brandList:any[]=[];//订单列表
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
  constructor(private pageObj:PageService,private router:Router,private http:Http,private PicUrl:HttpData,
              private route:ActivatedRoute,private nzMessage:NzMessageService,
              private dataTool:DataTool,private nzModal:NzModalService){}

  ngOnInit(){
    this.picUrl = this.PicUrl.PicUrl;
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    this.ngLoad=true;
    this.pageObj.pageChange("backstage/brand/findByCondition",1,10).subscribe(res=>{
      console.log(res);
      this.ngLoad=false;
      if(res["total"]!=0){
        this.brandList = res["list"];
        this.page.total = res["total"];
      }else {
        this.brandList = res["list"];
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
  skipToPage(name,val?){
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
    let url = 'backstage/brand/findByCondition?pageNo='+this.page.pageNo+'&pageSize='+this.page.pageSize+'&searchKey='+
      this.searchKey;
    for(let key in this.condition){
      if(!isNull(this.condition[key]&&!isUndefined(this.condition[key]))){
        url+='&'+key+'='+this.condition[key];
      }
    }
    this.http.get(url).subscribe(res=>{
        this.ngLoad=false;
        if(res["total"]!=0){
          this.brandList = res["list"];
          this.page.total = res["total"];
        }else {
          this.brandList = res["list"];
          this.page.total = res["total"];
        }
        this.checkAll=false;
        this.idList=[];
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
    let url = 'backstage/brand/findByCondition?pageNo='+this.page.pageNo+'&pageSize='+this.page.pageSize+'&searchKey='+
      this.searchKey;
    for(let key in this.condition){
      if(!isNull(this.condition[key]&&!isUndefined(this.condition[key]))){
        url+='&'+key+'='+this.condition[key];
      }
    }
    this.http.get(url).subscribe(res=>{
        this.ngLoad=false;
        if(res["total"]!=0){
          this.brandList = res["list"];
          this.page.total = res["total"];
        }else {
          this.brandList = res["list"];
          this.page.total = res["total"];
        }
        this.checkAll=false;
        this.idList=[];
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
    let url = 'backstage/brand/findByCondition?pageNo='+this.page.pageNo+'&pageSize='+this.page.pageSize+'&searchKey='+
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
          this.brandList = res["list"];
          this.page.total = res["total"];
        }else {
          this.brandList = res["list"];
          this.page.total = res["total"];
        }
        this.checkAll=false;
        this.idList=[];
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

  /**
   * 选择
   * @param flag 选中标志
   * @param val 商品id
   * @param type 类型 0:全选，1:单选
   */
  selectItem(flag,val,type,index?){
    if(type==1){
      if(flag){
        this.idList.push(val);
        if(this.idList.length==this.brandList.length){
          this.checkAll = true;
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
            this.brandList[i]['checked']=true;
            this.idList.push(val[i].id);
            continue;
          }
          //检测是否在idList中已存在
          for(let index in this.idList){
            if(val[i].id==this.idList[index]){
              break;
            }else if((Number(index)+1)==this.idList.length){
              this.brandList[i]['checked']=true;
              this.idList.push(val[i].id);
            }
          }
        }
      }else {
        for(let i =0;i<val.length;i++){
          this.brandList[i]['checked']=false;
        }
        this.idList=[]
      }
    }
    console.log(this.idList);
  };

  /**
   * 批量上架
   */
  inStore(){
    if(this.idList.length==0){
      this.nzMessage.warning("请先勾选要上架的品牌");
      return
    }
    this.http.post("backstage/brand/batchModifyStatus",{status:'ENTER',idList:this.idList}).subscribe(
      res=>{
        if(res["result"]==1){
          this.nzMessage.success("上架成功");
          this.pageChangeHandler(1);
          this.idList = [];
        }
      },
      err=>{
        console.log(err);
      }
    )
  }

  /**
   * 批量下架
   */
  outStore(){
    if(this.idList.length==0){
      this.nzMessage.warning("请先勾选要下架的品牌");
      return
    }
    this.http.post("backstage/brand/batchModifyStatus",{status:'QUITE',idList:this.idList}).subscribe(
      res=>{
        if(res["result"]==1){
          this.nzMessage.success("下架成功");
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
