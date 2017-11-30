import {Injectable} from "@angular/core";
import {Http} from "../../common/http/Http";
import {PageService} from "../page/Page.service";
@Injectable()
export class BrandService{
  constructor(private http:Http,private pageService:PageService){}

  /**
   * 新增品牌
   * @param brandObj
   * @returns {Observable<R|T>}
   */
  add(brandObj:any){
    let url="backstage/brand/add";
    return this.http.post(url,brandObj);
  }

  /**
   * 修改品牌
   * @param brandObj
   * @returns {Observable<R|T>}
   */
  update(brandObj:any){
    let url="backstage/brand/modify";
    return this.http.post(url,brandObj);
  }

  /**
   * 根据品牌ID查找品牌
   * @param id
   * @returns {Observable<R|T>}
   */
  findById(id:any){
    let url ="backstage/brand/findById?id="+id;
    return this.http.get(url);
  }

  /**
   * 分页查询品牌列表
   * @param pageNo
   * @param pageSize
   * @param condition
   * @returns {any}
   */
  pageList(pageNo:any,pageSize:any,condition:any){
    let url = "backstage/brand/findByCondition?pageNo="+pageNo+"&pageSize="+pageSize;
    return this.pageService.pageList(url,condition);
  }

  /**
   * 品牌上、下架
   * @param inObj { status:"状态",idList:[]}
   * @returns {any}
   */
  changeBrandStatus(inObj:any){
    let url ="backstage/brand/batchModifyStatus";
    return this.http.post(url,inObj);
  }
}
