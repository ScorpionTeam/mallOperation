import {Injectable} from "@angular/core";
import {HttpHeaders} from "@angular/common/http";
@Injectable()
export class HttpData{
  Host:string="http://192.168.0.120:8088/mall/";
  /*Host:string="http://pfpyu6.natappfree.cc/mall/";*/
  Header:HttpHeaders;
  constructor(){
    this.Header = new HttpHeaders().append("Content-Type", "application/json;charset=UTF-8")
  }

}
