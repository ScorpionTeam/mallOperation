import {Component} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd";
import {Http} from "../../common/http/Http";
@Component({
  selector:'index',
  templateUrl:'./Index.component.html',
  styleUrls:['./Index.component.css']
})
export class IndexComponent{
  constructor(private router :Router ,private route :ActivatedRoute,private nzMessage:NzMessageService,private http:Http){}

  skipToPage(url){
    this.router.navigate([url],{relativeTo:this.route});
  }
  logout(){
    let url ='backstage/user/logout?mobile='+localStorage.getItem("mobile");
    this.http.get(url).subscribe(res=>{
      console.log(res)
      if(res["result"]==1){
        localStorage.removeItem("token");
        localStorage.removeItem("mobile");
        this.router.navigate(['../login'],{relativeTo:this.route})
      }else {
        this.nzMessage.error(res["error"].message);
      }
    }),
      err=>{
       console.log("error="+err)
      }
  }
}
