import {Injectable} from "@angular/core";
import {Http} from "../../common/http/Http";
import {PageService} from "../page/Page.service";
@Injectable()
export class AdvertisementService{
  constructor(private http:Http,private pageService:PageService){}
  /**
   * 新增广告
   * @param bannerObj
   * @returns {Observable<R|T>}
   */
  add(bannerObj:any){
    let url="backstage/banner/add";
    return this.http.post(url,bannerObj);
  }

  /**
   * 修改广告
   * @param bannerObj
   * @returns {Observable<R|T>}
   */
  update(bannerObj:any){
    let url="backstage/banner/modify";
    return this.http.post(url,bannerObj);
  }

  /**
   * 根据广告ID查找广告
   * @param id
   * @returns {Observable<R|T>}
   */
  findById(id:any){
    let url ="backstage/banner/findById?id="+id;
    return this.http.get(url);
  }

  /**
   * 分页查询广告列表
   * @param pageNo
   * @param pageSize
   * @param condition
   * @returns {any}
   */
  pageList(pageNo:any,pageSize:any,condition?:any){
    let url = "backstage/banner/list?pageNo="+pageNo+"&pageSize="+pageSize;
    return this.pageService.pageList(url,condition);
  }

  /**
   * 广告上、下架
   * @param inObj { status:"状态",idList:[]}
   * @returns {any}
   */
  changeBannerStatus(inObj:any){
    let url ="backstage/banner/batchModifyStatus";
    return this.http.post(url,inObj);
  }
}
