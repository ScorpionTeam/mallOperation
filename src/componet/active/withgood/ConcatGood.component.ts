import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {NzModalService, NzMessageService} from "ng-zorro-antd";
import {HttpData} from "../../../http/HttpData";
import {isUndefined} from "util";
import {ActivityService} from "../../../service/active/Activity.service";
import {GoodService} from "../../../service/good/Good.service";
import {CategoryService} from "../../../service/category/Category.service";
@Component({
  selector:"act-concat-good",
  templateUrl:"ConcatGood.component.html",
  styleUrls:["ConcatGood.component.css"],
  providers:[ActivityService,GoodService,CategoryService]
})

export class  ConcatGoodComponent implements OnInit{
  curActivity:any;//当前活动
  goodList:any=[];//商品列表
  activityList:any=[];//活动列表
  categoryList:any=[];//类目列表
  isCollapse:boolean=false;
  checkAll:boolean = false;//全选
  doCheckAll:boolean=false;//是否可以全选
  searchKey:any= '';
  page:any = {
    pageNo:1,
    pageSize:10,
    total:0
  };
  picUrl:string = '';//图片公共地址
  condition:any={};//条件
  idList:any=[];//选中商品ID集合
  nowDate:any;//当前时间
  constructor(private actService:ActivityService,private goodService:GoodService,private categoryService:CategoryService,
              private router:Router,private route :ActivatedRoute,private  PicUrl:HttpData,
              private nzModal :NzModalService ,private nzMessage:NzMessageService){}

  ngOnInit(){
    this.picUrl = this.PicUrl.PicUrl;
    let date = new Date();
    this.nowDate = date.getTime();
    this.init();
    this.getActivityList();
    this.getCategoryList();
  }
  /**
   * 初始化
   */
  init(){
    /*数据初始化*/
    this.goodService.pageConcatWithActivity(this.page.pageNo,this.page.pageSize,this.searchKey).subscribe(res=>{
        console.log(res);
        if(res["total"]!=0){
          this.goodList = res["list"];
          this.page.total=res["total"];
        }
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
   * 获取类目列表
   */
  getCategoryList(){
    this.categoryService.findRootOrChildCategory("CHILD").subscribe(
      res=>{
        this.categoryList = res["list"];
      }
    )
  }

  /**
   * 获取活动列表
   */
  getActivityList(){
    let condition:any=[];
    condition.status='NORMAL';
    condition.type='ALL';
    this.actService.pageList(1,10000,'',condition).subscribe(
      res=>{
        if(res["total"]!=0){
          this.activityList = res["list"];
          console.log(this.activityList);
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
    this.goodService.pageConcatWithActivity(this.page.pageNo,this.page.pageSize,this.searchKey).subscribe(res=>{
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
    this.goodService.pageConcatWithActivity(this.page.pageNo,this.page.pageSize,this.searchKey).subscribe(res=>{
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
    this.goodService.pageConcatWithActivity(this.page.pageNo,this.page.pageSize,this.searchKey,this.condition).subscribe(res=>{
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
   * 比较时间
   * @param date
   */
  compareDate(startDate:any,endDate:any){
    let sDate = new Date(startDate).getTime();
    let eDate = new Date(endDate).getTime();
    let now =new Date().getTime();
     if(now<sDate||now<eDate&&now>sDate){
       return false ;
     }else {
       return true;
     }
  }

  /**
   * 选择
   * @param flag 选中标志
   * @param val 商品id
   * @param stock 参加活动库存
   * @param type 类型 0:全选，1:单选
   */
  selectItem(flag:any,val:any,type:any,stock?:any,index?:any){
    if(type==1){
      if(flag){
        //单选勾选操作
        //封装good选中的good对象
        if(isUndefined(stock)||stock<=0){
          this.nzMessage.warning("请先将参加活动库存填写完毕");
          setTimeout(()=>{this.goodList[index]['checked']=false;},0);
          return;
        }
        let good:any={};
        good.id = val;
        good.stock = stock;
        this.idList.push(good);

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
        let good :any ={};
        for(let i =0;i<val.length;i++){
          //判断是否已经填写了参加活动库存
          if(isUndefined(val[i].inStock)||val[i].inStock<=0){
            console.log(val);
            this.nzMessage.warning("请先将参加活动库存填写完毕");
            setTimeout(()=>{this.checkAll=false;},0);
            for(let j =0;j<val.length-1-i;i++){
              this.goodList[i]['checked']=false;
            }
            return;
          }
          //判断是否加入的id是否是列表里的第一个
          if(this.idList.length==0){
            this.goodList[i]['checked']=true;
            good.id=val[i].id;
            good.stock=val[i].inStock;
            this.idList.push(Object.assign({},good));
            continue;
          }
          //检测是否在idList中已存在
          for(let index in this.idList){
            if(val[i].id==this.idList[index].goodId){
              break;
            }else if((Number(index)+1)==this.idList.length){
              this.goodList[i]['checked']=true;
              good.id=val[i].id;
              good.stock=val[i].inStock;
              this.idList.push(Object.assign({},good));
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
   * 比较库存
   * @param inStock 参加活动库存
   * @param allStock 总库存
   * @param index 序列号
   */
  compareStock(inStock:any,allStock:any,index:any){
    console.log(this.goodList);
    if(Number(inStock)>allStock){
      this.goodList[index].inStock=0;
      this.nzMessage.warning("参加活动库存不得大于库存总量!")
    }
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
  }

  /**
   * 取消关联商品
   */
  concatConfirm(){
    if(this.idList.length==0){
      this.nzMessage.warning("请先选择商品");
      return;
    }else if(isUndefined(this.curActivity)){
      this.nzMessage.warning("请先选择活动类型");
      return;
    }
    this.nzModal.warning({
      title:"关联提示",
      content:"是否确认关联已选商品",
      onOk:()=>{
        this.concatHandler();
      }
    });
  }

  /**
   * 取消关联操作
   */
  concatHandler(){
    this.actService.concatGood(this.curActivity,this.idList).subscribe(
      res=>{
        if(res["result"]==1){
          this.nzMessage.success("关联成功");
          this.pageChangeHandler(1);
          this.idList=[];//清空选中的id
        }else{
          this.nzMessage.success(res["error"].message);
        }
      },
      err=>{
        console.log(err);
      }
    )
  }
}
