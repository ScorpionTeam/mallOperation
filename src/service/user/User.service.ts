import {Injectable} from "@angular/core";
import {Http} from "../../common/http/Http";
import {PageService} from "../page/Page.service";
@Injectable()
export class UserService{
  constructor(private http:Http,private pageService:PageService){}
  /**
   * 新增用户
   * @param userObj
   * @returns {Observable<R|T>}
   */
  add(userObj:any){
    let url="backstage/user/register";
    return this.http.post(url,userObj);
  }

  /**
   * 修改用户
   * @param userObj
   * @returns {Observable<R|T>}
   */
  update(userObj:any){
    let url="backstage/user/modify";
    return this.http.post(url,userObj);
  }

  /**
   * 根据用户ID查找用户
   * @param id
   * @returns {Observable<R|T>}
   */
  findById(id:any){
    let url ="backstage/user/findById?id="+id;
    return this.http.get(url);
  }

  /**
   * 分页查询用户列表
   * @param pageNo
   * @param pageSize
   * @param condition
   * @returns {any}
   */
  pageList(pageNo:any,pageSize:any,condition?:any){
    let url = "backstage/user/userList?pageNo="+pageNo+"&pageSize="+pageSize;
    return this.pageService.pageList(url,condition);
  }

}
