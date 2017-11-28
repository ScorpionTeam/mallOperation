import {Injectable} from "@angular/core";
import {Http} from "../../common/http/Http";
@Injectable()
export class GoodService{
  constructor(private http:Http){}

  pageList(){

  }

  /**
   * 根据活动id查询绑定商品
   * @param condition
   * @returns {Observable<Object>}
   */
  pageByActivityId(condition){
    return this.http.post('backstage/good/findByActivityId',condition);
  }

  /**
   * 分页查询可绑定活动商品
   * @param pageNo
   * @param pageSize
   * @param searchKey
   * @param condition
   * @returns {Observable<Object>}
   */
  pageConcatWithActivity(pageNo,pageSize,searchKey,condition?){
    let url = 'backstage/good/findForActivity?pageNo='+pageNo+'&pageSize='+pageSize+'&searchKey='+searchKey;
    for(let key in condition){
      url+='&'+key+'='+condition[key];
    }
    return this.http.get(url);
  }
}
