import {Injectable} from "@angular/core";
import {HttpInterceptor} from "@angular/common/http";
import {HttpRequest,HttpHandler,HttpEvent} from "@angular/common/http";
import {Observable} from "rxjs";
import {Router, ActivatedRoute} from "@angular/router";
@Injectable()
export class Interceptor implements HttpInterceptor{
  constructor(private  router:Router,private route:ActivatedRoute){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
/*    if(!localStorage.getItem('token')){
      this.router.navigateByUrl("/login");
    }*/
    let req2 = req.clone({
      setHeaders: {
        auth: localStorage.getItem('token')
      }
    });
    console.log(req2);
    return next.handle(req2);
  }
}
