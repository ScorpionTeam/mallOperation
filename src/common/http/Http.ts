import {HttpClient} from "@angular/common/http";
import {HttpData} from "../../http/HttpData";
import {Injectable} from "@angular/core";
import {Interceptor} from "../interceptor/interceptor";
import {HttpHandler} from "@angular/common/http";
import {Observable} from "rxjs";
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'
import {NzMessageService} from "ng-zorro-antd";
import {Router, ActivatedRoute} from "@angular/router";
import {Store} from "@ngrx/store";
import {HttpHeaders} from "@angular/common/http";

@Injectable()
export class Http{
  constructor(private http:HttpClient,private httpData:HttpData,private nzMessage:NzMessageService,
              private interceptor:Interceptor,private next :HttpHandler,private router:Router,
              private route:ActivatedRoute,private store:Store<boolean>){}

  /**
   * Post请求
   */
  post(url:string,body?:any){
    this.store.dispatch({type:"show"});
     let urls:string = this.httpData.Host+url;
    //Todo:判断是否有token
     let headers:HttpHeaders = this.httpData.Header.append("auth","JSONID:94268");
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
  postImg(url:string,body:any){
    let urls:string= this.httpData.Host+url;
    //Todo:判断是否有token
    let headers:HttpHeaders = new HttpHeaders().append("auth","JSONID:94268");
    return this.http.post(urls,body,{headers:headers}).catch(
      error=>{
        this.nzMessage.error("系统错误");
        return Observable.throw(error);
      }
    );
  }

  /**
   * Get请求
   */
  get(url:string){
    this.store.dispatch({type:"show"});
    let urls:string = this.httpData.Host+url;
    //Todo:判断是否有token
    let headers:HttpHeaders = new HttpHeaders().append("auth","JSONID:94268");
    return this.http.get(urls,{headers:headers}).map(
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

  /**
   * 判断是否有token
   */
  hasToken(){
    if(localStorage.getItem('token')){
      return true;
    }else{
      this.router.navigateByUrl("login");
      this.nzMessage.warning("请重新登录");
      return false;
    }
  }
}
