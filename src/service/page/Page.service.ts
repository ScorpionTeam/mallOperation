import {Injectable} from "@angular/core";
import {isUndefined} from "util";
import {Http} from "../../common/http/Http";
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
}
