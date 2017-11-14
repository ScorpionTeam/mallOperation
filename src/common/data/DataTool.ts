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
}
