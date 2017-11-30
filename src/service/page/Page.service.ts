import {Injectable} from "@angular/core";
import {isUndefined} from "util";
import {Http} from "../../common/http/Http";
import {isNull} from "util";
@Injectable()
export class PageService{
  constructor(private http:Http){}

  /**
   * 分页(get请求)
   * @param url
   * @param pageNo
   * @param pageSize
   * @param key关键字
   * @returns {Observable<Object>}
   */
  pageChange(url:any,pageNo:any,pageSize:any,condition?:any){
    let urls:any=url+'&pageNo='+pageNo+'&pageSize='+pageSize;
    for(let key in condition){
      if(isNull(condition[key])||isUndefined(condition[key])){
        continue;
      }
      urls = urls+"&"+key+"="+condition[key];
    }
    return this.http.get(urls);
  }

  /**
   * 分页加载
   * @param url
   * @param condition
   * @returns {Observable<Object>}
   */
  pageList(url:any,condition:any){
    let urls = url;
    for(let key in condition){
      if(isNull(condition[key])||isUndefined(condition[key])){
        continue;
      }
      urls = urls+"&"+key+"="+condition[key];
    }
    return this.http.get(urls);
  }
}
