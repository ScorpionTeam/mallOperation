import {Injectable} from "@angular/core";
@Injectable()
export  class DataTool{
  constructor(){}

  /**
   * 分转元
   * @param val
   */
  fTransYuan(val:any){
    return (val/100);
  }

  /**
   * 元转分
   * @param val
   */
  yTransFen(val:any){
    return (val*100);
  }

  /**
   * 获取订单状态字符串
   * @param val
   */
  getOrderStatusStr(val:any){
    switch (val){
      case "UN_PAY":
        return "待付款";
      case "UN_DELIVERY":
        return "待发货";
      case "UN_RECEIVE":
        return "待收货";
      case "DONE":
        return "已完成";
      case "REFUND":
        return "退货";
      case "CLOSING":
        return "关闭";
      case "UN_ESTIMATE":
        return "待评价";
      case "ESTIMATE":
        return "已评价";
    }
  }

  /**
   * 获取订单类型字符串
   * @param val
   */
  getOrderTypeStr(val:any){
    switch (val){
      case "PC_ORDER":
        return "PC订单";
      case "MOBILE_ORDER":
        return "手机订单";
    }
  }

  /**
   * 判断支付类型
   * @param val
   * @returns {any}
   */
  getPayTypeStr(val:any){
    switch (val){
      case "ALI_PAY":
        return "支付宝";
      case "WE_CHAT_PAY":
        return "微信";
      case "CREDIT_PAY":
        return "信用卡";
      case "DEPOSIT_PAY":
        return "储蓄卡";
    }
  }

  /**
   * 获取活动类型
   * @param val
   */
  getActivityType(val:any){
    switch (val){
      case "SECONDS_KILL":
        return "秒杀";
      case "SPELL_GROUP":
        return "拼团";
      case "FREE":
        return "试用";
    }
  }


  /**
   * 转换得到具体值
   * @param val
   * @param flag status:状态
   *              new:新品
   *              hot:热品
   *              email:包邮
   *              limit:限量
   *              onsale:上架状态
   *              quit:入住
   *              sex:性别
   *              auth:实名认证
   *              water:水印
   *              cut:裁剪
   */
  boolTransStr(val:any,flag:any){
    switch (flag){
      case "status":
        return val?"NORMAL":"UN_NORMAL";
      case "new":
        return val?"IS_NEW":"NOT_NEW";
      case "hot":
        return val?"HOT":"NOT_HOT";
      case "email":
        return val?"FREIGHT":"UN_FREIGHT";
      case "onsale":
        return val?"ON_SALE":"OFF_SALE";
      case "quit":
        return val?"ENTER":"QUITE";
      case "sex":
        return val?"MALE":"FEMALE";
      case "auth":
        return val?"IS_AUTH":"NOT_PASS_AUTH";
      case "water":
        return val?"WATER_REMARK":"NOT_WATER_REMARK";
      case "cut":
        return val?"CUT":"NOT_CUT";
      case "limit":
        return val?"LIMITED":"UN_LIMITED";
    }
  }

  /**
   * 获取菜单类型
   * @param val
   */
  getMenuType(val:any){
    switch (val){
      case "PARENT_MENU":
        return"父菜单";
      case "SUBMENU":
        return "子菜单";
    }
  }
  /**
   * 字符串转布尔
   * @param val 值
   * @param flag status:状态
   *              new:新品
   *              hot:热品
   *              email:包邮
   *              limit:限量
   *              onsale:上架状态
   *              quit:入住
   *              sex:性别
   *              auth:实名认证
   *              water:水印
   *              cut:裁剪
   */
  strTransBool(val:string,flag:string){
    switch (flag){
      case "status":
        return val=="NORMAL"?true:false;
      case "new":
        return val=="IS_NEW"?true:false;
      case "hot":
        return val=="HOT"?true:false;
      case "email":
        return val=="FREIGHT"?true:false;
      case "onsale":
        return val=="ON_SALE"?true:false;
      case "quit":
        return val=="ENTER"?true:false;
      case "sex":
        return val=="MALE"?true:false;
      case "auth":
        return val=="IS_AUTH"?true:false;
      case "water":
        return val=="WATER_REMARK"?true:false;
      case "cut":
        return val=="CUT"?true:false;
      case "limit":
        return val=="LIMITED"?true:false;
    }
  }
}
