import {Component, OnInit} from "@angular/core";
import {RouterTool} from "../../../common/routertool/RouterTool";
import {ActivatedRoute} from "@angular/router";
import {CategoryService} from "../../../service/category/Category.service";
import {DataTool} from "../../../common/data/DataTool";
@Component({
  selector:'category-list',
  templateUrl:'CategoryList.component.html',
  providers:[CategoryService]
})

export class CategoryListComponent implements OnInit{
  constructor( private routeTool:RouterTool,private route:ActivatedRoute,private categoryService:CategoryService,
               private dataTool:DataTool){}
  ngOnInit(){
    this.pageChangeHandler(1);
  }

  page:any={
    pageSize:10,
    pageNo:1,
    total:0
  };
  categoryList:any=[];//类目数组
  searchKey:string='';
  idList:any =[];
  checkAll:boolean=false;
  rootcategoryList:any=[];

  skipToPage(url:string,val?:any){
    this.routeTool.skipToPage(url,this.route,val)
  }

  /**
   * 翻页
   * @param val
   */
  pageChangeHandler(val:any){
    this.page.pageNo = val;
    this.categoryService.pageList(this.page.pageNo,this.page.pageSize,this.searchKey).subscribe(
      res=>{
        this.categoryList = res["list"];
        this.page.total = res["total"];
      });
  }

  /**
   * 修改pageSize回调
   * @param val
   */
  pageSizeChangeHandler(val:any){
    this.page.pageSize = val;
    this.categoryService.pageList(this.page.pageNo,this.page.pageSize,this.searchKey).subscribe(
      res=>{
        this.categoryList = res["list"];
        this.page.total = res["total"];
      });
  }

  /**
   * 查询
   */
  search(){
    this.page.pageNo = 1;
    this.categoryService.pageList(this.page.pageNo,this.page.pageSize,this.searchKey).subscribe(
      res=>{
        this.categoryList = res["list"];
        this.page.total = res["total"];
      });
  }
  selectItem(flag:any,val:any,type:any,index?:any){
    if(type==1){
      if(flag){
        this.idList.push(val);
        if(this.idList.length==this.categoryList.length){
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
            this.categoryList[i]['checked']=true;
            this.idList.push(val[i].id);
            continue;
          }
          //检测是否在idList中已存在
          for(let index in this.idList){
            if(val[i].id==this.idList[index]){
              break;
            }else if((Number(index)+1)==this.idList.length){
              this.categoryList[i]['checked']=true;
              this.idList.push(val[i].id);
            }
          }
        }
      }else {
        for(let i =0;i<val.length;i++){
          this.categoryList[i]['checked']=false;
        }
        this.idList=[]
      }
    }
    console.log(this.idList);
  };


}
