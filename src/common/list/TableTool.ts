import {Injectable} from "@angular/core";
@Injectable()
export class TableTool{
  constructor(){}

  /**
   *    * 选择复选框
   *
   * @param flag:Boolean  选中标志,
   * @param val id或dataList
   * @param type 0:全选，1:单选
   * @param idList 定义用来存id的数组
   * @param dataList 列表数据
   * @param index
   * @returns {boolean}
   */
  selectItem(flag:any,type:number,idList:any[],dataList:any[],val?:any,index?:any){
    if(type==1){
      if(flag){
        idList.push(val);
        if(idList.length==dataList.length){
          /*this.checkAll = true;*/
          return true;
        }
      }else {
        let index = idList.indexOf(val);
        idList.splice(index,1);
        /*this.checkAll = false;*/
        return false
      }
    }else {
      /*全选或全不选*/
      if(flag){
        for(let i =0;i<dataList.length;i++){
          if(idList.length==0){
            dataList[i]['checked']=true;
            idList.push(dataList[i].id);
            continue;
          }
          //检测是否在idList中已存在
          if(idList.indexOf(dataList[i].id)!=-1){
            continue;
          }else {
            dataList[i]['checked']=true;
            idList.push(dataList[i].id);
          }
        }
      }else {
        dataList.forEach(
          item=>{item.checked=false}
        );
        idList=idList.splice(0,idList.length);
      }
    }
  };
}
