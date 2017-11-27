import {Router, ActivatedRoute} from "@angular/router";
import {Injectable} from "@angular/core";

@Injectable()
export class RouterTool{
  constructor(private router:Router){}

  /**
   * 路由跳转
   * @param url 跳转路径
   * @param route 当前route对象
   * @param val 路由参数
   */
  skipToPage(url,route,val?){
    if(val){
      this.router.navigate([".."+url,val],{relativeTo:route});
    }else {
      this.router.navigate([".."+url],{relativeTo:route});
    }
  }
}
