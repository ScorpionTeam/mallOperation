import {Component} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {NzModalService, NzMessageService} from "ng-zorro-antd";
import {DataTool} from "../../../common/data/DataTool";
import {UserService} from "../../../service/user/User.service";
import {RoleService} from "../../../service/role/Role.service";
import {isUndefined} from "util";

@Component({
  selector:'user-list',
  templateUrl:'UserList.component.html',
  styleUrls:['UserList.component.css'],
  providers:[UserService,RoleService]
})

export class UserListComponent{
  userList:Array<any> = [];
  searchKey:any= '';
  page:any = {
    pageNo:1,
    pageSize:10,
    total:0
  };
  idList:any=[];//id集合
  curRoleId:number;//当前选择的角色ID
  roleList:any=[];
  constructor(private roleService:RoleService,private dataTool:DataTool,private nzMessage:NzMessageService,
              private router:Router,private route :ActivatedRoute,private userService:UserService,
              private nzService :NzModalService,private nzModal:NzModalService){
  }

  ngOnInit(){
    this.init();
    this.getRoleList();
  }

  /**
   * 初始化
   */
  init(){
    /*数据初始化*/
    this.userService.pageList(this.page.pageNo,this.page.pageSize,{searchKey:this.searchKey}).subscribe(res=>{
        console.log(res)
        this.userList = res["list"];
        this.page.total =res["total"];
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
    this.page.pageNo=val;
    this.userService.pageList(this.page.pageNo,this.page.pageSize,{searchKey:this.searchKey}).subscribe(res=>{
        for(let i =0;i<res["list"].length;i++){
          res["list"].checked=false
        }
        this.userList = res["list"];
        this.page.total=res["total"];
      },
      err=>{
        console.log(err);
      });
  };
  /*size改变*/
  pageSizeChangeHandler(val:any){
    let url = 'backstage/user/userList';
    this.page.pageSize=val;
    this.userService.pageList(this.page.pageNo,this.page.pageSize,{searchKey:this.searchKey}).subscribe(res=>{
        for(let i =0;i<res["list"].length;i++){
          res["list"].checked=false
        }
        this.userList = res["list"];
        this.page.total=res["total"];
      },
      err=>{
        console.log(err);
      });
  };

  /**
   * 关键字查询
   */
  search(){
    let url = 'backstage/user/userList';
    this.page.pageNo=1;
    this.userService.pageList(this.page.pageNo,this.page.pageSize,{searchKey:this.searchKey}).subscribe(res=>{
        for(let i =0;i<res["list"].length;i++){
          res["list"].checked=false
        }
        this.userList = res["list"];
        this.page.total=res["total"];
      },
      err=>{
        console.log(err);
      });
    console.log(this.searchKey);
  }

  /**
   * 选择
   * @param flag 选中标志
   * @param val 用户id
   * @param type 类型 0:全选，1:单选
   */
  selectItem(flag:any,val:any,type:any,index?:any){
    if(type==1){
      if(!flag._checked){
        this.idList.push(val);
      }else {
        let index = this.idList.indexOf(val);
        this.idList.splice(index,1);
      }
    }else {
      /*全选或全不选*/
      if(!flag._checked){
        for(let i =1;i<=val.length;i++){
          this.userList['checked']=true;
          this.idList.push(i);
        }
      }else {
        for(let i =1;i<=val.length;i++){
          this.userList['checked']=false;
        }
        this.idList=[]
      }
    }
    console.log(this.idList);
  };

  /**
   * 删除商品
   */
  delete(){
    if(this.idList.length==0){
      this.nzService.warning({
        title:"提示",
        content:"请先选择要删除的商品!"
      });
      return;
    }
    this.nzService.confirm({
      title:"删除提醒",
      content:"确认进行删除吗?",
      maskClosable:false,
      onOk:()=>{
        this.deleteHandler();
      }
    });
  }

  /**
   * 删除执行函数
   */
  deleteHandler(){

  }

  /**
   * 打开角色分配模态
   * @param id
   * @param bodyTemplate
   */
  openRoleModal(userId:number,bodyTemplate:any,roleId:number){
    this.curRoleId = roleId;//初始化用户角色Id
    this.nzModal.confirm({
      title:"分配角色",
      content:bodyTemplate,
      onOk:()=>{
        if(isUndefined(this.curRoleId)){
          this.nzMessage.warning("请先选择角色");
          return ;
        }
        this.roleService.assignRoleToUser(userId,this.curRoleId).subscribe(
          res=>{
            if(res["result"]==1){
              this.nzMessage.success("绑定成功");
              this.pageChangeHandler(this.page.pageNo);
            }else {
              this.nzMessage.error(res["error"].message);
            }
          }
        );
      },
      closable:false
    });
  }

  /**
   *获取角色列表
   */
  getRoleList(){
    this.roleService.pageList(1,1000).subscribe(
      res=>{
        this.roleList= res.list;
      }
    )
  }

}
