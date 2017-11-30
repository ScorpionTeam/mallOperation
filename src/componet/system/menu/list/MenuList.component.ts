import {Component, OnInit} from "@angular/core";
import {Http} from "../../../../common/http/Http";
import {Router, ActivatedRoute} from "@angular/router";
import {RouterTool} from "../../../../common/routertool/RouterTool";
import {DataTool} from "../../../../common/data/DataTool";
import {MenuService} from "../../../../service/menu/Menu.service";
import {NzMessageService} from "ng-zorro-antd";
@Component({
  selector:"menu-list",
  templateUrl:"MenuList.component.html",
  providers:[MenuService]
})

export class MenuListComponent implements OnInit{
  menuList:any=[];
  page:any={
    pageNo:1,
    pageSize:10,
    total:0
  };
  idList:any=[];
  checkAll:boolean=false;
  searchKey:string='';
  constructor(private http:Http,public routerTool:RouterTool,public route:ActivatedRoute,
                private dataTool:DataTool,private menuService:MenuService,private nzMessage:NzMessageService){}
  ngOnInit(){
    this.pageChangeHandler(1);
  }

  /*分页*/
  pageChangeHandler(val:any){
    this.page.pageNo=val;
    this.menuService.pageList(this.page.pageNo,this.page.pageSize,this.searchKey).subscribe(res=>{
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
        console.log(err);
      });
  };
  /*size改变*/
  pageSizeChangeHandler(val:any){
    this.page.pageSize=val;
    this.menuService.pageList(this.page.pageNo,this.page.pageSize,this.searchKey).subscribe(res=>{
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
        console.log(err);
      });
  };

  /**
   * 查询
   */
  search(){
    this.page.pageNo=1;
    this.menuService.pageList(this.page.pageNo,this.page.pageSize,this.searchKey).subscribe(res=>{
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

  /**
   * 删除菜单
   * @param id
   */
  delMenu(id:any){
    this.menuService.delMenu(id).subscribe(
      res=>{
        this.pageChangeHandler(1);
        if(res["result"]==1){
          this.nzMessage.success("删除成功");
          this.pageChangeHandler(1);
        }else {
          this.nzMessage.warning(res["error"].message);
        }
      },
      err=>{
        console.log(err);
      }
    )
  }
}
