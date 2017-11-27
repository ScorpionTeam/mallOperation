import {Component, OnInit} from "@angular/core";
import {Http} from "../../../../common/http/Http";
import {Router, ActivatedRoute} from "@angular/router";
import {RouterTool} from "../../../../common/routertool/RouterTool";
@Component({
  selector:"menu-list",
  templateUrl:"MenuList.component.html"
})

export class MenuListComponent implements OnInit{
  menuList:any=[];
  ngLoad:boolean=false;
  page:any={
    pageNo:1,
    pageSize:10,
    total:0
  };
  idList:any=[];
  checkAll:boolean=false;
  searchKey:string='';
  constructor(private http:Http,private routerTool:RouterTool,private route:ActivatedRoute){}
  ngOnInit(){
    this.pageChangeHandler(1);
  }

  /*分页*/
  pageChangeHandler(val){
    this.ngLoad=true;
    this.page.pageNo=val;
    let url = 'backstage/brand/findByCondition?pageNo='+this.page.pageNo+'&pageSize='+this.page.pageSize+'&searchKey='+
      this.searchKey;
    this.http.get(url).subscribe(res=>{
        this.ngLoad=false;
        if(res["total"]!=0){
          this.menuList = res["list"];
          this.page.total = res["total"];
        }else {
          this.menuList = res["list"];
          this.page.total = res["total"];
        }
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
    this.http.get(url).subscribe(res=>{
        this.ngLoad=false;
        if(res["total"]!=0){
          this.menuList = res["list"];
          this.page.total = res["total"];
        }else {
          this.menuList = res["list"];
          this.page.total = res["total"];
        }
        this.idList=[];
      },
      err=>{
        this.ngLoad=false;
        console.log(err);
      });
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
        if(this.idList.length==this.menuList.length){
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
            this.menuList[i]['checked']=true;
            this.idList.push(val[i].id);
            continue;
          }
          //检测是否在idList中已存在
          for(let index in this.idList){
            if(val[i].id==this.idList[index]){
              break;
            }else if((Number(index)+1)==this.idList.length){
              this.menuList[i]['checked']=true;
              this.idList.push(val[i].id);
            }
          }
        }
      }else {
        for(let i =0;i<val.length;i++){
          this.menuList[i]['checked']=false;
        }
        this.idList=[]
      }
    }
    console.log(this.idList);
  };
}
