import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Http} from "../../../common/http/Http";
@Component({
  selector:'order-detail',
  templateUrl:'./Order.component.html',
  styleUrls:['Order.component.css']
})

export class OrderComponent implements OnInit{
  order:any={};
  constructor(private route:ActivatedRoute,private http:Http){}
  ngOnInit(){
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    console.log(this.route.params['value'].id)
    this.http.get("backstage/order/findById?id="+this.route.params['value'].id).subscribe(res=>{
      console.log(res);
    },err=>{
      console.log(err);
    })
  }
}
