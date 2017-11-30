import {Injectable} from "@angular/core";
import {Http} from "../../common/http/Http";
import {PageService} from "../page/Page.service";
import {isUndefined} from "util";
import {isNull} from "util";
@Injectable()
export class RoleService{
  constructor(private http:Http,private pageService:PageService){}

  /**
   * 分页查询角色
   * @param pageNo
   * @param pageSize
   * @param condition
   * @returns {Observable<R|T>}
   */
  pageList(pageNo:any,pageSize:any,condition?:any){
    let url:string  ="backstage/role/list?pageNo="+pageNo+"&pageSize="+pageSize;
    for(let key in condition){
      if(isUndefined(condition[key])||isNull(condition[key])){
        continue;
      }
      url=url+'&'+key+'='+condition[key];
    }
    return this.http.get(url);
  }

  /**
   * 新增
   * @param roleObj
   * @returns {Observable<R|T>}
   */
  add(roleObj:any){
    let url= "backstage/role/add";
    return this.http.post(url,roleObj);
  }

  /**
   * 更新
   * @param roleObj
   * @returns {Observable<R|T>}
   */
  update(roleObj:any){
    let url= "backstage/role/modify";
    return this.http.post(url,roleObj);
  }

  /**
   * 根据Id删除角色
   * @param id
   * @returns {Observable<R>}
   */
  delRoleById(id:number){
    let url ="backstage/role/deleteById?id="+id;
    return this.http.post(url,null).map(res=>{return res;});
  }

  /**
   * 根据Id查找角色
   * @param id
   * @returns {Observable<R|T>}
   */
  findRoleById(id:number){
    let url= "backstage/role/findById?id="+id;
    return this.http.get(url);
  }
}
