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

}
