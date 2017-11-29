import {Injectable} from "@angular/core";
import {Http} from "../../common/http/Http";
@Injectable()
export class OrderService{
  constructor(private http:Http){}

  findById(id){}

  pageList(condition?){
    let url ="backstage/order/findByCondition";
    return this.http.post(url,condition);
  }

  /**
   * 发货
   * @param orderId
   * @param deliveryNo
   * @param expressName
   */
  sendGood(orderId,deliveryNo,expressName){
    let url = "backstage/order/sendGood?orderId="+orderId+"&deliveryNo="+deliveryNo+"&expressName="+expressName;
    return this.http.post(url,null);
  }

  /**
   * 同意退款
   * @param id
   * @param fee
   * @returns {Observable<R|T>}
   */
  areggReturnMoney(id,fee){
    let url = 'backstage/order/audit/refund?orderId='+id+'&flag=AGREE&remark=&refundFee='+fee;
    return this.http.post(url,null);
  }

  /**
   * 拒绝退款
   * @param id
   * @param failRemark
   * @returns {Observable<R|T>}
   */
  aginstReturnMoney(id,failRemark){
    let url = 'backstage/order/audit/refund?orderId='+id+'&flag=REFUSE&refundFee=0&remark='+failRemark;
    return this.http.post(url,null);
  }
}
