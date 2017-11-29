import {Injectable} from "@angular/core";
import {Http} from "../../common/http/Http";

@Injectable()
export class MenuService{
  constructor(private http:Http){}

  /**
   * 分页查询菜单列表
   * @param pageNo
   * @param pageSize
   * @param searchKey
   * @returns {Observable<Object>}
   */
  pageList(pageNo,pageSize,searchKey?){
    let url = 'backstage/menu/findByCondition?pageNo='+pageNo+'&pageSize='+pageSize+'&searchKey='+ searchKey;
    return this.http.get(url);
  }

  /**
   * 根据ID查询菜单详情
   * @param id
   * @returns {Observable<Object>}
   */
  findMenuById(id){
    let url = "backstage/menu/findById?id="+id;
    return this.http.get(url);
  }
  /**
   * 新增菜单
   * @param menuObj
   * @returns {Observable<Object>}
   */
  add(menuObj){
    return this.http.post('backstage/menu/add',menuObj);
  }

  /**
   * 修改菜单
   * @param menuObj
   * @returns {Observable<Object>}
   */
  update(menuObj){
    return this.http.post('backstage/menu/modify',menuObj);
  }

  /**
   * 寻找根节点
   * @returns {Observable<Object>}
   */
  findRootMenu(){
    return this.http.get("backstage/menu/findRootMenu");
  }

  /**
   * 根据ID删除菜单
   * @param id
   * @returns {Observable<Object>}
   */
  delMenu(id){
    return this.http.get("backstage/menu/deleteById?id="+id);
  }
}
