import {Injectable} from "@angular/core";
@Injectable()
export class TimePick{
  constructor(){}

  /**
   * 禁止开始时间
   * @param baseTime 基准时间
   * @param endTime 结束时间
   * @returns {boolean}
   */
  disableStartTime=(baseTime,endTime)=>{
    if(!baseTime||!endTime){
      return false;
    }
    return baseTime.getTime()>=endTime.getTime();
  }

  /**
   * 禁止结束时间
   * @param baseTime  基准时间
   * @param startTime 开始时间
   */
  disableEndTime=(baseTime,startTime)=>{
    if(!startTime||!baseTime){
      return false
    }
    return baseTime.getTime() <= startTime.getTime();
  }
}
