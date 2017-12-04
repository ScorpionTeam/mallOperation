///<reference path="../../../../node_modules/rxjs/add/operator/switchMap.d.ts"/>
import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Router, ActivatedRoute} from "@angular/router";
import {Http} from "../../../common/http/Http";
import {NzMessageService} from "ng-zorro-antd";
import {DataTool} from "../../../common/data/DataTool";
import {isUndefined} from "util";
import {ActivityService} from "../../../service/active/Activity.service";
@Component({
  selector:'app-detail',
  templateUrl:'Activity.component.html',
  styleUrls:['Activity.component.css'],
  providers:[ActivityService]
})

export class ActivityComponent implements OnInit{

  validateForm:FormGroup;
  activity:any={
    status:true,
    target:'3'
  };
  constructor(private fb:FormBuilder,private router:Router,private nzMessage:NzMessageService,
              private route:ActivatedRoute,private http:Http,private dataTool:DataTool,
              private service:ActivityService){}
  ngOnInit() {
    this.init();
    this.createdFormValidate();
  }
  /**
   * 初始化
   */
  init(){
    if(this.route.params["value"].id){
      this.service.detail(this.route.params['value'].id).subscribe(
        res=>{
          if(res["result"]==1){
            this.activity = res["data"];
            this.activity.status = this.dataTool.strTransBool(this.activity.status,'status');
            this.activity.start_date = new Date(res["data"].start_date);
            this.activity.end_date = new Date(res["data"].end_date);
          }
        },
        err=>{
          this.nzMessage.error("系统错误");
          console.log(err);
        }
      );
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
      number:"",
      discount:["",[Validators.required]],
      description:["",[Validators.required]]
    })
  }

  /**
   * 保存
   */
  save(){
    console.log(this.validateForm);
    if(!this.validateForm.valid){
      this.nzMessage.warning("请将表单填写完整!");
      return;
    }else  if(this.activity.activity_type=='SPELL_GROUP'&&(this.activity.num==0||isUndefined(this.activity.num))){
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
    this.activity.status = this.dataTool.boolTransStr(this.activity.status,'status');
    this.service.add(this.activity).subscribe(
      res=>{
        console.log(res);
        this.activity.status = this.dataTool.strTransBool(this.activity.status,'status');
        if(res["result"]==1){
          this.nzMessage.success("新增活动成功");
          this.validateForm.reset();
        }
      },
      err=>{
        this.activity.status = this.dataTool.strTransBool(this.activity.status,'status');
        console.log(err);
      }
    );
  }
  update(){
    this.activity.status = this.dataTool.boolTransStr(this.activity.status,'status');
    this.service.update(this.activity).subscribe(
      res=>{
        console.log(res);
        this.activity.status = this.dataTool.strTransBool(this.activity.status,'status');
        if(res["result"]==1){
          this.nzMessage.success("修改成功");
        }
      },
      err=>{
        this.activity.status = this.dataTool.strTransBool(this.activity.status,'status');
        console.log(err)
      }
    );
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
  disabledStartDate=(startValue:any)=>{
    if(!startValue||!this.activity.end_date){
      return false;
    }
    return startValue.getTime()>=this.activity.end_date.getTime();
  }

  /**
   * 禁止结束时间
   * @param endValue
   * @returns {boolean}
   */
  disabledEndDate=(endValue:any)=>{
    if(!this.activity.start_date||!endValue){
      return false
    }
    return endValue.getTime() <= this.activity.start_date.getTime();
  }
}
