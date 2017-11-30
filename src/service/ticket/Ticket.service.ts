import {Injectable} from "@angular/core";
import {Http} from "../../common/http/Http";
import {PageService} from "../page/Page.service";
@Injectable()
export class TicketService{
  constructor(private http:Http,private pageService:PageService){}
  /**
   * 新增优惠券
   * @param ticketObj
   * @returns {Observable<R|T>}
   */
  add(ticketObj:any){
    let url="backstage/ticket/add";
    return this.http.post(url,ticketObj);
  }

  /**
   * 修改优惠券
   * @param ticketObj
   * @returns {Observable<R|T>}
   */
  update(ticketObj:any){
    let url="backstage/ticket/modify";
    return this.http.post(url,ticketObj);
  }

  /**
   * 根据优惠券ID查找优惠券
   * @param id
   * @returns {Observable<R|T>}
   */
  findById(id:any){
    let url ="backstage/ticket/findById?id="+id;
    return this.http.get(url);
  }

  /**
   * 分页查询优惠券列表
   * @param pageNo
   * @param pageSize
   * @param condition
   * @returns {any}
   */
  pageList(pageNo:any,pageSize:any,condition?:any){
    let url = "backstage/ticket/findByCondition?pageNo="+pageNo+"&pageSize="+pageSize;
    return this.pageService.pageList(url,condition);
  }

  /**
   * 批量改变优惠券状态
   * @param idList
   * @returns {any}
   */
  delTickets(idListObj:any){
    let url = 'backstage/ticket/batchDelete';
    return this.http.post(url,idListObj);
  }
}
