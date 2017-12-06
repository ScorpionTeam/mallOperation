import {Injectable} from "@angular/core";
import {HttpHeaders} from "@angular/common/http";
@Injectable()
export class HttpData{
  /*Host:string="http://192.168.0.122:8088/mall/";*/
  /*Host:string="http://localhost:8088/mall/";*/
  Host:string = "https://zjhkhl.com/mall/";
  Header:HttpHeaders;
  /*PicUrl:string = "http://ajijkh.natappfree.cc";*/
  PicUrl:string="https://zjhkhl.com";
  constructor(){
    this.Header = new HttpHeaders().append("Content-Type", "application/json;charset=UTF-8")
  }

}
