import {Router, ActivatedRoute} from "@angular/router";
import {Injectable} from "@angular/core";
import {isNull} from "util";
import {isUndefined} from "util";

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
    if(!isUndefined(val)){
      this.router.navigate([".."+url,val],{relativeTo:route});
    }else {
      this.router.navigate([".."+url],{relativeTo:route});
    }
  }
}
