import {Injectable} from "@angular/core";
@Injectable()
export  class DataTool{
  constructor(){}
  boolTransStr(val){
    return val?'1':'0';
  }
  strTransBool(val){
    return val=='1'?true:false;
  }

  /**
   * 分转元
   * @param val
   */
  fTransYuan(val){
    return (val/100);
  }

  /**
   * 元转分
   * @param val
   */
  yTransFen(val){
    return (val*100);
  }

  /**
   * 获取订单状态字符串
   * @param val
   */
  getOrderStatusStr(val){

  }

  /**
   * 获取订单类型字符串
   * @param val
   */
  getOrderTypeStr(val){
    switch (val){
      case "1":
        return "PC订单";
      case "2":
        return "手机订单";
    }
  }
}
