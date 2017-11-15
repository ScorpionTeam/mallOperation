import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Http} from "../../../common/http/Http";
import {DataTool} from "../../../common/data/DataTool";
@Component({
  selector:'order-detail',
  templateUrl:'./Order.component.html',
  styleUrls:['Order.component.css']
})

export class OrderComponent implements OnInit{
  order:any={};
  constructor(private router:Router,private route:ActivatedRoute,
              private http:Http,private dataTool:DataTool){}
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
      this.order = res["data"];
    },err=>{
      console.log(err);
    })
  }

  /**
   * 保存
   */
  save(){

  }

  /**
   * 返回
   */
  back(){
    this.router.navigate(["../../order-list"],{relativeTo:this.route});
  }

  /**
   * 查看商品详情
   * @param id 商品id
   */
  checkGoodDetail(id){
    this.router.navigate(["../../good-detail",id],{relativeTo:this.route});
  }
}
