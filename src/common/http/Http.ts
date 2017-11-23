import {HttpClient} from "@angular/common/http";
import {HttpData} from "../../http/HttpData";
import {Injectable} from "@angular/core";
import {Interceptor} from "../interceptor/interceptor";
import {HttpHandler} from "@angular/common/http";
import {HttpRequest} from "@angular/common/http";

@Injectable()
export class Http{
  constructor(private http:HttpClient,private httpData:HttpData,
              private interceptor:Interceptor,private next :HttpHandler){}


  /**
   * Post请求
   */
  post(url,body?){
     let urls = this.httpData.Host+url;
     let headers = this.httpData.Header;
      return this.http.post(urls,JSON.stringify(body),{headers:headers});
  }

  /*上传图片*/
  postImg(url,body){
    let urls= this.httpData.Host+url;
    return this.http.post(urls,body);
  }
  /**
   * Get请求
   */
  get(url){
    let urls = this.httpData.Host+url;
    let request = new HttpRequest("GET",urls);
    let i = 1;
 /*   this.interceptor.intercept(request,this.next).subscribe(
      res=>{
        console.log(i++);
        console.log(res);
      }
    );*/

    return this.http.get(urls);
  }

}
