import {Injectable} from "@angular/core";
import {Http} from "../../common/http/Http";
@Injectable()
export class OrderService{
  constructor(private http:Http){}

  /**
   * 根据ID查询订单详情
   * @param id
   */
  findById(id:any){
    let url ="backstage/order/findById?id="+id;
    return this.http.get(url);
  }

  /**
   * 分页查询
   * @param condition
   * @returns {Observable<R|T>}
   */
  pageList(condition?:any){
    let url ="backstage/order/findByCondition";
    return this.http.post(url,condition);
  }

  /**
   * 发货
   * @param orderId
   * @param deliveryNo
   * @param expressName
   */
  sendGood(orderId:any,deliveryNo:any,expressName:any){
    let url = "backstage/order/sendGood?orderId="+orderId+"&deliveryNo="+deliveryNo+"&expressName="+expressName;
    return this.http.post(url,null);
  }

  /**
   * 同意退款
   * @param id
   * @param fee
   * @returns {Observable<R|T>}
   */
  areggReturnMoney(id:any,fee:any){
    let url = 'backstage/order/audit/refund?orderId='+id+'&flag=AGREE&remark=&refundFee='+fee;
    return this.http.post(url,null);
  }

  /**
   * 拒绝退款
   * @param id
   * @param failRemark
   * @returns {Observable<R|T>}
   */
  aginstReturnMoney(id:any,failRemark:any){
    let url = 'backstage/order/audit/refund?orderId='+id+'&flag=REFUSE&refundFee=0&remark='+failRemark;
    return this.http.post(url,null);
  }

  /**
   * 修改订单
   * @param orderObj
   * @returns {Observable<R|T>}
   */
  update(orderObj:any){
    let url = "backstage/order/modify";
    return this.http.post(url,orderObj);
  }

  pageListOrderLog(pageNo:any,pageSize:any,id:any){
    let url = 'backstage/order/findOrderLogByOrderId?orderId='+id+'&pageNo='
      +pageNo+'&pageSize='+pageSize;
    return this.http.get(url);
  }
}
