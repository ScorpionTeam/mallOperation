import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Router, ActivatedRoute} from "@angular/router";
import {Http} from "../../../common/http/Http";
import {NzMessageService} from "ng-zorro-antd";
import {DataTool} from "../../../common/data/DataTool";
@Component({
  selector:'app-detail',
  templateUrl:'/Activity.component.html',
  styleUrls:['Activity.component.css']
})

export class ActivityComponent implements OnInit{

  validateForm:FormGroup;
  activity:any={
    status:true,
    activityType:'0',
    target:'3'
  };
  goodIdList:any=[];//参加活动商品的IdList
  constructor(private fb:FormBuilder,private router:Router,private nzMessage:NzMessageService,
                private route:ActivatedRoute,private http:Http,private dataTool:DataTool){}
  ngOnInit() {
    this.init();
    this.createdFormValidate();
  }
  /**
   * 初始化
   */
  init(){
    if(this.route.params["value"].id){
      this.http.get("backstage/activity/findById?id="+this.route.params["value"].id).subscribe(
        res=>{
          if(res["result"]==1){
            this.activity = res["data"];
            this.activity.status = !this.dataTool.strTransBool(this.activity.status);
          }
        },
        err=>{
          this.nzMessage.error("系统错误");
          console.log(err);
        }
      )
    }
  }

  /**
   * 创建表单验证
   */
  createdFormValidate(){
    this.validateForm = this.fb.group({
      name:["",[Validators.required]],
      activityType:[""],
      target:[""],
      status:[""]
    })
  }

  /**
   * 保存
   */
  save(){}

  add(){}
  update(){}
  /**
   * 返回
   */
  back(){
    if((this.route.params['value'].id)){
      this.router.navigate(["../../activity-list"],{relativeTo:this.route});
    }else {
      this.router.navigate(["../activity-list"],{relativeTo:this.route});
    }
  }
}
