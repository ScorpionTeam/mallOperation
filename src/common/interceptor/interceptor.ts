import {Injectable} from "@angular/core";
import {HttpInterceptor} from "@angular/common/http";
import {HttpRequest,HttpHandler,HttpEvent} from "@angular/common/http";
import {Observable} from "rxjs";
@Injectable()
export class Interceptor implements HttpInterceptor{
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(req);
    return next.handle(req);
  }
}
