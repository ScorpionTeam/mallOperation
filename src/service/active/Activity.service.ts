import {Injectable} from "@angular/core";
import {Http} from "../../common/http/Http";
import {isNull} from "util";
import {isUndefined} from "util";
import {PageService} from "../page/Page.service";
@Injectable()
export class  ActivityService{

  constructor(private http:Http,private pageService:PageService){}

  /**
   * 分页查询
   * @param pageNo
   * @param pageSize
   * @param searchKey
   * @param condition
   * @returns {Observable<Object>}
   */
  pageList(pageNo:any,pageSize:any,searchKey:any,condition?:any){
    let url = 'backstage/activity/findByCondition?pageNo='+pageNo+'&pageSize='+pageSize+'&searchKey='+
      searchKey;
    return this.pageService.pageList(url,condition);
  }

  /**
   * 根据活动id查找详情
   * @param id
   * @returns {Observable<Object>}
   */
  detail(id:any){
    return this.http.get("backstage/activity/findById?id="+id);
  }
  /**
   * 新增活动
   * @param activityObj
   * @returns {Observable<Object>}
   */
  add(activityObj:any){
    return this.http.post("backstage/activity/add",activityObj);
  }

  /**
   * 修改活动
   * @param activityObj
   * @returns {Observable<Object>}
   */
  update(activityObj:any){
    return this.http.post("backstage/activity/modify",activityObj);
  }

  /**
   * 绑定活动商品
   * @param activityId
   * @param goodIdList
   * @returns {Observable<Object>}
   */
  concatGood(activityId:any,goodIdList:any){
    return this.http.post("backstage/activity/bindActivityWithGood",{activityId:activityId,goodList:goodIdList});
  }

  /**
   * 取消活动、商品关联
   * @param activiId
   * @param goodIdList
   * @returns {Observable<Object>}
   */
  unconcatGood(activiId:any,goodIdList:any){
    return this.http.post("backstage/activity/unbindActivityWithGood",{activityId:activiId,goodIdList:goodIdList});
  }
}
