import {Injectable} from "@angular/core";
import {Http} from "../../common/http/Http";
@Injectable()
export class GoodService{
  constructor(private http:Http){}

  pageList(condition){
    let url = 'backstage/good/findByCondition';
    return this.http.post(url,condition);
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

  /**
   * 根据商品id查询商品详情
   * @param goodId
   * @returns {Observable<Object>}
   */
  detail(goodId){
    let url = "backstage/good/findById?id="+goodId;
    return this.http.get(url);
  }

  /**
   * 新增商品
   * @param goodObj
   * @param imgList
   * @returns {Observable<Object>}
   */
  add(goodObj,imgList){
    return this.http.post('backstage/good/add',{good:goodObj,imageList:imgList});
  }

  /**
   * 修改商品
   * @param goodObj
   * @param imgList
   * @returns {Observable<Object>}
   */
  update(goodObj,imgList){
    return this.http.post('backstage/good/update',{good:goodObj,imageList:imgList});
  }

  /**
   * 上、下架商品
   * @param status
   * @param idList
   * @returns {Observable<Object>}
   */
  batchGoodDown(status,idList){
    return this.http.post('backstage/good/batchModifySaleStatus',{saleStatus:status,goodsIdList:idList});
  }
}
