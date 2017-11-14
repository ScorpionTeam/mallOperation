import {Component} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {PageService} from "../../../service/page/Page.service";
import {NzModalService} from "ng-zorro-antd";
import {Http} from "../../../common/http/Http";

@Component({
  selector:'user-list',
  templateUrl:'UserList.component.html',
  styleUrls:['UserList.component.css']
})

export class UserListComponent{
  userList:Array<any> = [];
  ngLoad:Boolean = false;
  searchKey:any= '';
  page:any = {
    pageNo:1,
    pageSize:10,
    total:0
  };
  idList:any=[];//id集合
  constructor(private pageObj : PageService,private http:Http,
              private router:Router,private route :ActivatedRoute,
              private nzService :NzModalService ){
  }

  ngOnInit(){
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    let url = 'backstage/user/userList?pageNo='+this.page.pageNo+'&pageSize='+this.page.pageSize+'&searchKey='+this.searchKey;
    /*数据初始化*/
    this.http.get(url).subscribe(res=>{
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
  skipToPage(name,val){
    console.log(name);
    if(val){
      this.router.navigate([".."+name,val],{relativeTo:this.route});
    }else{
      this.router.navigate([".."+name],{relativeTo:this.route});
    }
  }
  /*分页*/
  pageChangeHandler(val){
    let url = 'backstage/user/userList';
    this.ngLoad=true;
    this.page.pageNo=val;
    this.pageObj.pageChange(url,val,this.page.pageNo).subscribe(res=>{
        this.ngLoad=false;
        for(let i =0;i<res["data"].length;i++){
          res["data"].checked=false
        }
        this.userList = res["data"];
        this.page.total=11;
      },
      err=>{
        this.ngLoad=false;
        console.log(err);
      });
  };
  /*size改变*/
  pageSizeChangeHandler(val){
    let url = 'backstage/user/userList';
    this.ngLoad=true;
    this.page.pageSize=val;
    this.pageObj.pageChange(url,this.page.pageSize,val).subscribe(res=>{
        this.ngLoad=false;
        this.userList = res["data"];
        this.page.total=res["data"].total;
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
    let url = 'backstage/user/userList';
    this.page.pageNo=1;
    this.pageObj.pageChange(url,this.page.pageNo,this.page.pageSize,this.searchKey).subscribe(res=>{
        console.log(res)
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
  selectItem(flag,val,type,index?){
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
      onOk:function(){
        console.log("success");
      }
    });
  }
}
