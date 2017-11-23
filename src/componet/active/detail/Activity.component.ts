import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Router, ActivatedRoute} from "@angular/router";
import {Http} from "../../../common/http/Http";
import {NzMessageService} from "ng-zorro-antd";
import {DataTool} from "../../../common/data/DataTool";
@Component({
  selector:'app-detail',
  templateUrl:'Activity.component.html',
  styleUrls:['Activity.component.css']
})

export class ActivityComponent implements OnInit{

  validateForm:FormGroup;
  activity:any={
    status:true,
    activityType:'0',
    target:'3',
    num:1
  };
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
            this.activity.startDate = new Date(res["data"].startDate);
            this.activity.endDate = new Date(res["data"].endDate);
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
      activityType:["",[Validators.required]],
      target:"",
      status:"",
      end:["",[Validators.required]],
      start:["",[Validators.required]],
      number:["",[Validators.required]],
      discount:["",[Validators.required]],
      description:["",[Validators.required]]
    })
  }

  /**
   * 保存
   */
  save(){
    if(!this.validateForm.valid){
      this.nzMessage.warning("请将表单填写完整!");
      return;
    }
    if(this.route.params["value"].id){
      this.update();
    }else {
      this.add();
    }
  }

  add(){
    this.activity.status = this.dataTool.boolTransStr(!this.activity.status);
    this.http.post("backstage/activity/add",this.activity).subscribe(
      res=>{
        console.log(res);
        this.activity.status = !this.dataTool.strTransBool(this.activity.status);
        if(res["result"]==1){
          this.nzMessage.success("新增活动成功");
          this.validateForm.reset();
        }
      },
      err=>{
        this.activity.status = !this.dataTool.strTransBool(this.activity.status);
        console.log(err);
      }
    )
  }
  update(){
    this.activity.status = this.dataTool.boolTransStr(!this.activity.status);
    this.http.post("backstage/activity/modify",this.activity).subscribe(
      res=>{
        console.log(res);
        this.activity.status = !this.dataTool.strTransBool(this.activity.status);
        if(res["result"]==1){
          this.nzMessage.success("修改成功");
        }
      },
      err=>{
        this.activity.status = !this.dataTool.strTransBool(this.activity.status);
        console.log(err)
      }
    )
  }
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

  /**
   * 禁止开始时间
   * @param startValue
   * @returns {boolean}
   */
  disabledStartDate=(startValue)=>{
    if(!startValue||!this.activity.endDate){
      return false;
    }
    return startValue.getTime()>=this.activity.endDate.getTime();
  }

  /**
   * 禁止结束时间
   * @param endValue
   * @returns {boolean}
   */
  disabledEndDate=(endValue)=>{
    if(!this.activity.startDate||!endValue){
      return false
    }
    return endValue.getTime() <= this.activity.startDate.getTime();
  }
}
