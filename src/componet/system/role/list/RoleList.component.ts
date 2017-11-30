import {Component, OnInit} from "@angular/core";
import {RoleService} from "../../../../service/role/Role.service";
import {RouterTool} from "../../../../common/routertool/RouterTool";
import {ActivatedRoute} from "@angular/router";
import {NzModalService} from "ng-zorro-antd";
import {DataTool} from "../../../../common/data/DataTool";
@Component({
  selector:'role-list',
  templateUrl:'RoleList.component.html',
  providers:[RoleService]
})

export class RoleListComponent implements OnInit{
  constructor(private roleService:RoleService,private routerTool:RouterTool,private dataTool:DataTool,
              private route:ActivatedRoute,private nzModal:NzModalService){}
  ngOnInit(){
    this.pageChangeHandler(1);
  }
  roleList:any=[];//角色列表
  page:any={
    pageNo:1,
    pageSize:10,
    total:0
  };
  searchKey:string;//关键字

  /**
   * 跳转
   * @param url
   * @param val
   */
  skipToPage(url:string,val?:any){
    this.routerTool.skipToPage(url,this.route,val);
  }

  /**
   * 改变页码
   * @param val
   */
  pageChangeHandler(val:any){
    this.page.pageNo=val;
    this.roleService.pageList(this.page.pageNo,this.page.pageSize,{searchKey:this.searchKey}).subscribe(
      res=>{
        this.roleList = res["list"];
        this.page.total = res["total"];
      }
    )
  }

  /**
   * 改变每页展现条数
   * @param val
   */
  pageSizeChangeHandler(val:any){
    this.page.pageSize = val;
    this.roleService.pageList(this.page.pageNo,this.page.pageSize,{searchKey:this.searchKey}).subscribe(
      res=>{
        this.roleList = res["list"];
        this.page.total = res["total"];
      }
    )
  }

  /**
   * 搜索
   */
  search(){
    this.page.pageNo=1;
    this.roleService.pageList(this.page.pageNo,this.page.pageSize,{searchKey:this.searchKey}).subscribe(
      res=>{
        this.roleList = res["list"];
        this.page.total = res["total"];
      }
    )
  }

  /**
   * 根据Id删除
   * @param id
   */
  delConfirm(id:number){
    this.nzModal.warning({
      title:"提示",
      content:"确认删除?",
      onOk:()=>{
        this.delById(id);
      }
    })
  }

  delById(id:number){
    this.roleService.delRoleById(id).subscribe(
      res=>{
        if(res.result==1){
          this.nzModal.success({
            content:"删除成功"
          });
        }else {
          this.nzModal.error(res.error.message);
        }
      }
    );
  }
}
