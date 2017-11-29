import {HttpClient} from "@angular/common/http";
import {HttpData} from "../../http/HttpData";
import {Injectable} from "@angular/core";
import {Interceptor} from "../interceptor/interceptor";
import {HttpHandler} from "@angular/common/http";
import {HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'
import {NzMessageService} from "ng-zorro-antd";
import {Router, ActivatedRoute} from "@angular/router";

@Injectable()
export class Http{
  constructor(private http:HttpClient,private httpData:HttpData,private nzMessage:NzMessageService,
              private interceptor:Interceptor,private next :HttpHandler,private router:Router,
              private route:ActivatedRoute){}

  /**
   * Post请求
   */
  post(url,body?){
     let urls = this.httpData.Host+url;
     let headers = this.httpData.Header;
      return this.http.post(urls,JSON.stringify(body),{headers:headers}).catch(
        error=>{
          this.nzMessage.error("系统错误");
          return Observable.throw(error);
        }
      );
  }

  /*上传图片*/
  postImg(url,body){
    let urls= this.httpData.Host+url;
    return this.http.post(urls,body).catch(
      error=>{
        this.nzMessage.error("系统错误");
        return Observable.throw(error);
      }
    );
  }
  /**
   * Get请求
   */
  get(url){
    let urls = this.httpData.Host+url;
    let request = new HttpRequest("GET",urls);
    let i = 1;
/*    this.interceptor.intercept(request,this.next).subscribe(
      res=>{
        if(res.type==0){
          console.log("请求刚发出");
        }else {
          console.log(res);
        }
      }
    );*/
    return this.http.get(urls).map(
      res=>{
        return res;
      }
    ).catch(
      error=>{
        //退出系统
        /*this.router.navigateByUrl("login");
        localStorage.removeItem("token");*/
        this.nzMessage.error("系统错误");
        return Observable.throw(error);
      }
    );
  }

}
