import {Component, OnInit} from "@angular/core";
import {PageService} from "../../../service/page/Page.service";
import {Router, ActivatedRoute} from "@angular/router";
import {NzModalService, NzMessageService} from "ng-zorro-antd";
import {Http} from "../../../common/http/Http";
import {isNull} from "util";
import {HttpData} from "../../../http/HttpData";
import {DataTool} from "../../../common/data/DataTool";
@Component({
  selector:"good-list",
  templateUrl:"GoodList.component.html",
  styleUrls:["GoodList.component.css"]
})

export class GoodListComponent implements OnInit{
  picUrl:string;//图片公共地址
  goodList:Array<any> = [];
  ngLoad:Boolean = false;
  checkAll:boolean = false;//全选
  doCheckAll:boolean=false;//是否可以全选
  searchKey:any= '';
  page:any = {
    pageNo:1,
    pageSize:10,
    total:0
  };
  //条件
  condition:any={}

  //是否展开
  isCollapse:boolean = false;
  idList:any=[];//id集合
  constructor(private pageObj : PageService,private http:Http,private dataTool:DataTool,
              private router:Router,private route :ActivatedRoute,private  PicUrl:HttpData,
              private nzService :NzModalService ,private nzMessage:NzMessageService){}

  ngOnInit(){
    this.picUrl = this.PicUrl.PicUrl;
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    let url = 'backstage/good/findByCondition?pageNo='+this.page.pageNo+'&pageSize='+this.page.pageSize+'&searchKey='+this.searchKey;
    /*数据初始化*/
    this.ngLoad=true;
    this.http.get(url).subscribe(res=>{
        this.ngLoad=false;
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
  skipToPage(name,val?){
    if(val){
      this.router.navigate([".."+name,val],{relativeTo:this.route});
    }else{
      this.router.navigate([".."+name],{relativeTo:this.route});
    }
  }
  /*分页*/
  pageChangeHandler(val){
    console.log(val);
    this.ngLoad=true;
    this.page.pageNo=val;
    this.pageObj.pageChange('backstage/good/findByCondition',val,this.page.pageSize).subscribe(res=>{
        this.ngLoad=false;
        /*给checkbox赋值*/
        for(let i =0;i<res["list"].length;i++){
          res["list"].checked=false
        }
        this.checkAll=false;
        this.goodList = res["list"];
        this.page.total=res["total"]
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
    this.pageObj.pageChange('backstage/good/findByCondition',this.page.pageNo,val).subscribe(res=>{
        for(let i =0;i<res["list"].length;i++){
          res["list"].checked=false
        }
        this.ngLoad=false;
        this.checkAll=false;
        this.goodList = res["list"];
        this.page.total=res["total"]
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
    let url = 'backstage/good/findByCondition?pageNo='+this.page.pageNo+'&pageSize='+this.page.pageSize+'&searchKey='+this.searchKey;
    for(let key in this.condition){
      if(isNull(this.condition[key])){
        continue;
      }
      url+="&"+key+"="+this.condition[key]
    }
    console.log(url);
    this.ngLoad=true;
    this.page.pageNo=1;
    this.http.get(url).subscribe(res=>{
        this.ngLoad=false;
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
  }

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
        if(this.idList.length==this.goodList.length){
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
        for(let i =0;i<val.length;i++){
          this.goodList[i]['checked']=false;
        }
        this.idList=[]
      }
    }
    console.log(this.idList);
  };

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
  }

  /**
   * 上、下架商品
   */
  batchGoodDown(status){
    if(this.idList.length==0){
      this.nzMessage.warning("请先选择商品");
      return;
    }
    this.http.post('backstage/good/batchModifySaleStatus',{saleStatus:status,goodsIdList:this.idList}).subscribe(res=>{
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
  /*  delete(){
   if(this.idList.length==0){
   this.nzService.warning({
   title:"提示",
   content:"请先选择要删除的商品!"
   });
   return;
   }
   let url = 'backstage/good/bathDeleteGoods';
   let self = this;
   this.nzService.confirm({
   title:"删除提醒",
   content:"确认进行删除吗?",
   maskClosable:false,
   onOk:function(){
   self.http.post(url,{idList:self.idList}).subscribe(res=>{
   if(res['result']==1){
   self.nzMessage.success("删除成功");
   self.pageChangeHandler(1);
   }else {
   self.nzMessage.error(res["error"].message);
   }
   },err=>{
   console.log(err);
   })
   }
   });
   }*/
}
