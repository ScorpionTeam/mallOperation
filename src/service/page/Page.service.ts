import {Injectable} from "@angular/core";
import {isUndefined} from "util";
import {Http} from "../../common/http/Http";
import {isNull} from "util";
@Injectable()
export class PageService{
  constructor(private http:Http){}

  /**
   * 分页
   * @param url
   * @param pageNo
   * @param pageSize
   * @param key关键字
   * @returns {Observable<Object>}
   */
  pageChange(url,pageNo,pageSize,key?){
    let urls:any;
    if(!isUndefined(key)){
       urls = url+'?pageNo='+pageNo+'&pageSize='+pageSize+'&searchKey='+key;
    }else {
      urls = url+'?pageNo='+pageNo+'&pageSize='+pageSize+'&searchKey=';
    }
    return this.http.get(urls);
  }

  /**
   * 分页加载
   * @param url
   * @param condition
   * @returns {Observable<Object>}
   */
  pageList(url,condition){
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
