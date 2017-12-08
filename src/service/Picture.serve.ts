import {Injectable} from "@angular/core";
import {Http} from "../common/http/Http";
@Injectable()
export  class PictureServe{
  constructor(private http:Http){}

  /**
   * 分页
   * @param pageNo
   * @param pageSize
   * @returns {any}
   */
  list(pageNo:number,pageSize:number){
    let url = "file/findByCondition?type=6&pageNo="+pageNo+"&pageSize="+pageSize;
    return this.http.get(url);
  }

  /**
   * 删除图片
   * @param url
   */
  delPic(url:string) {
   return  this.http.get("file/deleteImage?imageName=" + url);
  }
}
