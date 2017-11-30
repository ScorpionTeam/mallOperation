import {Injectable} from "@angular/core";
import {Http} from "../../common/http/Http";
import {isNull} from "util";
import {isUndefined} from "util";
import {PageService} from "../page/Page.service";
@Injectable()
export class GoodService{
  constructor(private http:Http){}

  /**
   * 条件查询商品列表
   * @param condition
   * @returns {Observable<Object>}
   */
  pageList(condition:any){
    let url = 'backstage/good/findByCondition';
    return this.http.post(url,condition);
  }

  /**
   * 根据活动id查询绑定商品
   * @param condition
   * @returns {Observable<Object>}
   */
  pageByActivityId(condition:any){
    let url ='backstage/good/findByCondition';
    let conditionObj= condition||{};
    conditionObj.type='BIND_ACTIVITY';
    return this.http.post(url,condition);
  }

  /**
   * 分页查询可绑定活动商品
   * @param pageNo
   * @param pageSize
   * @param searchKey
   * @param condition
   * @returns {Observable<Object>}
   */
  pageConcatWithActivity(pageNo:any,pageSize:any,searchKey:any,condition?:any){
    let url = 'backstage/good/findByCondition';
    let conditionObj= condition||{};
    conditionObj.pageNo = pageNo;
    conditionObj.pageSize = pageSize;
    conditionObj.searchKey = searchKey;
    conditionObj.type='UNBIND_ACTIVITY';
    return this.http.post(url,conditionObj);
  }

  /**
   * 根据商品id查询商品详情
   * @param goodId
   * @returns {Observable<Object>}
   */
  detail(goodId:any){
    let url = "backstage/good/findById?id="+goodId;
    return this.http.get(url);
  }

  /**
   * 新增商品
   * @param goodObj
   * @param imgList
   * @returns {Observable<Object>}
   */
  add(goodObj:any,imgList:any){
    return this.http.post('backstage/good/add',{good:goodObj,imageList:imgList});
  }

  /**
   * 修改商品
   * @param goodObj
   * @param imgList
   * @returns {Observable<Object>}
   */
  update(goodObj:any,imgList:any){
    return this.http.post('backstage/good/update',{good:goodObj,imageList:imgList});
  }

  /**
   * 上、下架商品
   * @param status
   * @param idList
   * @returns {Observable<Object>}
   */
  batchGoodDown(status:any,idList:any){
    return this.http.post('backstage/good/batchModifySaleStatus',{saleStatus:status,goodsIdList:idList});
  }
}
