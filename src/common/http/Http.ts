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
import {Store} from "@ngrx/store";

@Injectable()
export class Http{
  constructor(private http:HttpClient,private httpData:HttpData,private nzMessage:NzMessageService,
              private interceptor:Interceptor,private next :HttpHandler,private router:Router,
              private route:ActivatedRoute,private store:Store<boolean>){}

  /**
   * Post请求
   */
  post(url,body?){
    this.store.dispatch({type:"show"});
     let urls = this.httpData.Host+url;
     let headers = this.httpData.Header;
      return this.http.post(urls,JSON.stringify(body),{headers:headers}).map(
        res=>{
          this.store.dispatch({type:"hide"});
          return res;
        }
      ).catch(
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
    this.store.dispatch({type:"show"});
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
        this.store.dispatch({type:"hide"});
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
