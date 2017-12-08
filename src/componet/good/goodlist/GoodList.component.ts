import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {NzModalService, NzMessageService} from "ng-zorro-antd";
import {HttpData} from "../../../http/HttpData";
import {DataTool} from "../../../common/data/DataTool";
import {GoodService} from "../../../service/good/Good.service";
import {CategoryService} from "../../../service/category/Category.service";
import {TimePick} from "../../../common/data/TimePick";
import {TableTool} from "../../../common/list/TableTool";
@Component({
  selector:"good-list",
  templateUrl:"GoodList.component.html",
  styleUrls:["GoodList.component.css"],
  providers:[GoodService,CategoryService,TableTool]
})

export class GoodListComponent implements OnInit{
  picUrl:string;//图片公共地址
  goodList:Array<any> = [];
  checkAll:boolean = false;//全选
  doCheckAll:boolean=false;//是否可以全选
  page:any = {
    pageNo:1,
    pageSize:10,
    total:0
  };
  condition:any={};//条件
  categoryList:any = [];

  //是否展开
  isCollapse:boolean = false;
  idList:any=[];//id集合
  constructor( public dataTool:DataTool,private goodService:GoodService,private categoryService:CategoryService,
              private router:Router,private route :ActivatedRoute,private  PicUrl:HttpData,
              private nzService :NzModalService ,private nzMessage:NzMessageService,
              private timePickTool:TimePick,private tableTool:TableTool){}

  ngOnInit(){
    this.picUrl = this.PicUrl.PicUrl;
    this.init();
    this.getCategoryList();
  }
  /**
   * 获取商品类目列表
   */
  getCategoryList(){
    this.categoryService.findRootOrChildCategory("CHILD").subscribe(
      res=>{
        this.categoryList = res["list"];
      }
    )
  }

  /**
   * 初始化
   */
  init(){
    let conditionObj:any={};
    conditionObj.pageNo = this.page.pageNo;
    conditionObj.pageSize = this.page.pageSize;
    /*数据初始化*/
    this.goodService.pageList(conditionObj).subscribe(res=>{
        console.log(res)
        if(res["total"]!=0){
          this.goodList = res["list"];
          this.page.total=res["total"]
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
    if(val){
      this.router.navigate([".."+name,val],{relativeTo:this.route});
    }else{
      this.router.navigate([".."+name],{relativeTo:this.route});
    }
  }
  /*分页*/
  pageChangeHandler(val:any){
    console.log(val);
    this.page.pageNo=val;
    this.condition.pageNo=this.page.pageNo;
    this.condition.pageSize=this.page.pageSize;
    this.goodService.pageList(this.condition).subscribe(res=>{
        /*给checkbox赋值*/
        for(let i =0;i<res["list"].length;i++){
          res["list"].checked=false
        }
        this.checkAll=false;
        this.goodList = res["list"];
        this.page.total=res["total"];
        this.idList=[];
      },
      err=>{
        console.log(err);
      });
  };
  /*size改变*/
  pageSizeChangeHandler(val:any){
    this.page.pageSize=val;
    this.condition.pageNo=this.page.pageNo;
    this.condition.pageSize=this.page.pageSize;
    this.goodService.pageList(this.condition).subscribe(res=>{
        for(let i =0;i<res["list"].length;i++){
          res["list"].checked=false
        }
        this.checkAll=false;
        this.goodList = res["list"];
        this.page.total=res["total"]
        this.idList=[];
      },
      err=>{
        console.log(err);
      });
  };

  /**
   * 关键字查询
   */
  search(){
    let url = 'backstage/good/findByCondition';
    this.page.pageNo=1;
    this.condition.pageNo=1;
    this.condition.pageSize=this.page.pageSize;
    this.goodService.pageList(this.condition).subscribe(res=>{
        for(let i =0;i<res["list"].length;i++){
          res["list"].checked=false
        }
        this.checkAll=false;
        this.goodList = res["list"];
        this.page.total=res["total"];
        this.idList=[];
      },
      err=>{
        console.log(err);
      });
  }

  /**
   * 选择复选框
   * @param flag :boolean 是否选中
   * @param type 0:全选  1:单选
   * @param idList
   * @param dataList
   * @param val
   * @param index
   */
    selectItem(flag:boolean,type:number,idList:any[],dataList:any[],val?:any,index?:any){
      if(type==0){
        this.tableTool.selectItem(flag,type,idList,dataList);
      }else {
        this.checkAll = this.tableTool.selectItem(flag,type,idList,dataList,val);
      }
      console.log(this.idList);
    }

  /**
   * 禁止全选
   */
  canCheckAll(){
    for(let index in this.goodList ){
      if(!this.goodList[index].checked){
        this.doCheckAll = true;
        return;
      }
    }
    this.doCheckAll=false;
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
    return this.timePickTool.disableEndTime(endValue,this.condition.startDate)
  };

  /**
   * 上、下架商品
   */
  batchGoodDown(status:any){
    if(this.idList.length==0){
      this.nzMessage.warning("请先选择商品");
      return;
    }
    this.goodService.batchGoodDown(status,this.idList).subscribe(res=>{
      console.log(res);
      if(res["result"]==1){
        this.nzMessage.success(res["data"])
        this.pageChangeHandler(1);
        this.idList=[];
      }else {
        this.nzMessage.error(res["error"].message)
      }
    },err=>{
      console.log(err);
      this.nzMessage.error("系统错误");
    })
  }
}
