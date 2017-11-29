import {Injectable} from "@angular/core";
import {Http} from "../../common/http/Http";
import {PageService} from "../page/Page.service";
@Injectable()
export class CategoryService{
  constructor(private http:Http,private pageService:PageService){}

  /**
   * 分页查询类目列表
   * @param pageSize
   * @param pageNo
   * @param searchKey
   */
  pageList(pageNo,pageSize,searchKey?){
    let url = 'backstage/category/findByCondition?pageNo='+pageNo+'&pageSize='+pageSize;
    let condition:any={};
    condition.searchKey= searchKey;
    return this.pageService.pageList(url,condition);
  }

  /**
   * 新增
   * @param categoryObj
   * @returns {Observable<Object>}
   */
  add(categoryObj){
    let url = 'backstage/category/add';
    return this.http.post(url,categoryObj);
  }

  /**
   * 修改
   * @param categoryObj
   * @returns {Observable<Object>}
   */
  update(categoryObj){
    let url = 'backstage/category/modify';
    return this.http.post(url,categoryObj);
  }

  /**
   * 根据Id查详情
   * @param id
   * @returns {Observable<Object>}
   */
  findById(id){
    let url = 'backstage/category/findById?id='+id;
    return this.http.get(url);
  }

  /*修改类目状态*/

  /**
   * 查询根类目
   * @param type :PARENT:父类目  CHILD:子类目
   * @returns {Observable<R|T>}
   */
  findRootOrChildCategory(type){
    let url ='backstage/category/findByCondition?pageNo=1&pageSize=1000&type='+type;
    return this.http.get(url);
  }
}
