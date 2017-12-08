import {Component, OnInit, enableProdMode} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd";
import {Http} from "../../common/http/Http";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {MenuService} from "../../service/menu/Menu.service";
import {HMenu} from "../../common/menu/HMenu";
enableProdMode();
interface FlagState{
  loadFlag:boolean;
}
@Component({
  selector:'index',
  templateUrl:'./Index.component.html',
  styleUrls:['./Index.component.css'],
  providers:[MenuService]
})
export class IndexComponent implements OnInit{
  spinFlag:Observable<boolean>;
  name:string;
  menuList:any =[];//菜单
  constructor(private router :Router ,private route :ActivatedRoute,private nzMessage:NzMessageService,
              private http:Http,private store:Store<FlagState>,private menuService:MenuService){
    this.spinFlag = this.store.select('loadFlag');
  }
  ngOnInit(){
    this.name = localStorage.getItem("name");
    this.findMenuList();
  }

  menuClasses:any={
    "menu_item":true,
    "menu_item_selected":false
  }

  /**
   * 页面跳转
   * @param url
   */
  skipToPage(url:string){
    this.router.navigate([url],{relativeTo:this.route});
  }

  /**
   * 退出登录
   */
  logout(){
    let url ='backstage/user/logout?mobile='+localStorage.getItem("mobile");
    this.http.get(url).subscribe(res=>{
      console.log(res)
      if(res["result"]==1){
        localStorage.removeItem("token");
        localStorage.removeItem("mobile");
        localStorage.removeItem("id");
        localStorage.removeItem("city");
        this.router.navigate(['../login'],{relativeTo:this.route})
      }else {
        this.nzMessage.error(res["error"].message);
      }
    })
  }

  /**
   * 获取菜单
   */
  findMenuList(){
    this.menuService.findMenuByUserid(localStorage.getItem("id")).subscribe(
      (res:any)=>{
        console.log(res);
        if(res["result"]==1){
          this.menuList = res["data"];
        }
      }
    )
  }


}
