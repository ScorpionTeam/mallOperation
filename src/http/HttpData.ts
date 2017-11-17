import {Injectable} from "@angular/core";
import {HttpHeaders} from "@angular/common/http";
@Injectable()
export class HttpData{
  Host:string="http://192.168.0.120:8088/mall/";
  /*Host:string="http://ka82zd.natappfree.cc/mall/";*/
/*  Host:string="http://localhost:8088/mall/";*/
  Header:HttpHeaders;
  constructor(){
    this.Header = new HttpHeaders().append("Content-Type", "application/json;charset=UTF-8")
  }

}
