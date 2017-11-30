import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpData} from "../../../http/HttpData";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {isUndefined} from "util";
import {ActivityService} from "../../../service/active/Activity.service";
import {GoodService} from "../../../service/good/Good.service";
import {CategoryService} from "../../../service/category/Category.service";
@Component({
  selector:'out-good-activity',
  templateUrl:'OutGood.component.html',
  styleUrls:['OutGood.component.css'],
  providers:[ActivityService,GoodService,CategoryService]
})

export class OutGoodComponent implements OnInit{
  curActivity:any;//当前活动
  goodList:any=[];//商品列表
  activityList:any=[];//活动列表
  categoryList:any=[];//类目列表
  isCollapse:boolean=false;
  checkAll:boolean = false;//全选
  doCheckAll:boolean=false;//是否可以全选
  openFlag:boolean=false;
  searchKey:any= '';
  page:any = {
    pageNo:1,
    pageSize:10,
    total:0
  };
  picUrl:string = '';//图片公共地址
  condition:any={};//条件
  idList:any=[];//选中商品ID集合
  constructor(private actService:ActivityService,private goodService:GoodService,
              private categoryService:CategoryService, private router:Router,
              private route :ActivatedRoute,private  PicUrl:HttpData,
              private nzModal :NzModalService ,private nzMessage:NzMessageService){}

  ngOnInit(){
    this.picUrl = this.PicUrl.PicUrl;
    this.getActivityList();
    this.getCategoryList();
  }
  /**
   * 改变活动
   * @param flag 打开开关
   */
  changeActType(flag:any){
    this.openFlag=!this.openFlag;
    if(flag){
      return;
    }
    this.condition.pageNo = this.page.pageNo;
    this.condition.pageSize= this.page.pageSize;
    this.condition.activityId = this.curActivity;
    this.condition.searchKey = this.searchKey;
    /*数据初始化*/
    this.goodService.pageByActivityId(this.condition).subscribe(res=>{
        console.log(res);
        if(res["total"]!=0){
          this.goodList = res["list"];
          this.page.total=res["total"];
        }else {
          this.goodList = [];
          this.page.total=0;
        }
      },
      err=>{
        console.log(err);
      });

  }

  /**
   * 页面跳转
   * @param name
   * @param val
   */
  skipToPage(name:string,val?:any){
    console.log(name);
    if(val){
      this.router.navigate([".."+name,val],{relativeTo:this.route});
    }else{
      this.router.navigate([".."+name],{relativeTo:this.route});
    }
  }

  /**
   * 获取活动列表
   */
  getActivityList(){
    let condition:any={};
    condition.status='NORMAL';
    condition.type='ALL';
    this.actService.pageList(1,10000,'',condition).subscribe(
      res=>{
        if(res["total"]!=0){
          this.activityList = res["list"];
          this.curActivity = this.activityList[0].id;
          this.changeActType(false);
        }
      },
      err=>{
        console.log(err);
      }
    )
  }

  /*分页*/
  pageChangeHandler(val:any){
    this.page.pageNo=val;
    //拼接地址
    this.condition.pageNo = this.page.pageNo;
    this.condition.pageSize= this.page.pageSize;
    this.condition.activityId = this.curActivity;
    this.condition.searchKey = this.searchKey;
    this.goodService.pageByActivityId(this.condition).subscribe(res=>{
        /*给checkbox赋值*/
        for(let i =0;i<res["list"].length;i++){
          res["list"].checked=false
        }
        this.idList=[];
        if(res["total"]!=0){
          this.checkAll=false;
          this.goodList = res["list"];
          this.page.total=res["total"];
        }else {
          this.goodList = [];
          this.page.total=0;
        }
      },
      err=>{
        console.log(err);
      });
  };

  /*size改变*/
  pageSizeChangeHandler(val:any){
    this.page.pageSize=val;
    //拼接地址
    this.condition.pageNo = this.page.pageNo;
    this.condition.pageSize= this.page.pageSize;
    this.condition.activityId = this.curActivity;
    this.condition.searchKey = this.searchKey;
    this.goodService.pageByActivityId(this.condition).subscribe(res=>{
        for(let i =0;i<res["list"].length;i++){
          res["list"].checked=false
        }
        this.idList=[];
        if(res["total"]!=0){
          this.checkAll=false;
          this.goodList = res["list"];
          this.page.total=res["total"]
        }else {
          this.goodList = [];
          this.page.total=0;
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
    //拼接地址
    this.condition.pageNo = this.page.pageNo;
    this.condition.pageSize= this.page.pageSize;
    this.condition.activityId = this.curActivity;
    this.condition.searchKey = this.searchKey;
    this.goodService.pageByActivityId(this.condition).subscribe(res=>{
        for(let i =0;i<res["list"].length;i++){
          res["list"].checked=false
        }
        this.idList=[];
        if(res["total"]!=0){
          this.checkAll=false;
          this.goodList = res["list"];
          this.page.total=res["total"]
        }else {
          this.goodList = [];
          this.page.total=0;
        }
      },
      err=>{
        console.log(err);
      });
  }


  /**
   * 选择
   * @param flag 选中标志
   * @param val 商品id
   * @param type 类型 0:全选，1:单选
   */
  selectItem(flag:any,val:any,type:any,index?:any){
    if(type==1){
      if(flag){
        //单选勾选操作
        this.idList.push(val);
        if(this.idList.length==this.goodList.length){
          this.checkAll = true;
        }else {
          this.checkAll=false;
        }
      }else {
        //单选取消操作
        this.checkAll=false;
        let index = this.idList.indexOf(val);
        this.idList.splice(index,1);
      }
    }else {
      if(flag){
        //全选
        for(let i =0;i<val.length;i++){
          if(this.idList.length==0){
            this.goodList[i]['checked']=true;
            this.idList.push(val[i].id);
            continue;
          }
          //检测是否在idList中已存在
          for(let index in this.idList){
            if(val[i].id==this.idList[index]){
              break;
            }else if((Number(index)+1)==this.idList.length){
              this.goodList[i]['checked']=true;
              this.idList.push(val[i].id);
            }
          }
        }
      }else {
        //全不选
        for(let i =0;i<val.length;i++){
          this.goodList[i]['checked']=false;
        }
        this.idList=[]
      }
    }
    console.log(this.idList);
  };


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
   * 关联商品
   */
  unconcatConfirm(){
    if(this.idList.length==0){
      this.nzMessage.warning("请先选择商品");
      return;
    }else if(isUndefined(this.curActivity)){
      this.nzMessage.warning("请先选择活动类型");
      return;
    }
    this.nzModal.warning({
      title:"解绑提示",
      content:"是否确认解绑已选商品",
      onOk:()=>{
        this.unconcatHandler();
      }
    });
  }

  /**
   * 关联操作
   */
  unconcatHandler(){
    this.actService.unconcatGood(this.curActivity,this.idList).subscribe(
      res=>{
        if(res["result"]==1){
          this.nzMessage.success("解绑成功");
          this.pageChangeHandler(1);
          this.checkAll=false;
          this.idList=[];//清空选中的id
        }else{
          this.nzMessage.success("解绑失败");
        }
      },
      err=>{
        console.log(err);
      }
    )
  }

  /**
   * 获取类目列表
   */
  getCategoryList(){
    this.categoryService.findRootOrChildCategory("CHILD").subscribe(
      res=>{
        this.categoryList = res["list"];
      }
    )
  }
}
