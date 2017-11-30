import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd";
import {Http} from "../../../common/http/Http";
import {DataTool} from "../../../common/data/DataTool";
import {UserService} from "../../../service/user/User.service";

@Component({
  selector:'user-detail',
  templateUrl:'User.component.html',
  styleUrls:['User.component.css'],
  providers:[UserService]
})

export class UserComponent{
  validateForm:FormGroup;
  //判断是否为详情页
  isDetail:boolean;
  //初始化用户详情
  user:any={
    sex:false,
    status:true
  };

  constructor(private route:ActivatedRoute,private router :Router,private dataTool:DataTool,
              private fb :FormBuilder, private nzMessage:NzMessageService,private userService:UserService,
              private http:Http){}
  ngOnInit(){
    console.log(this.route.params['value'].id);
    this.init();
    this.createValidatorGroup();
  }

  /**
   * 初始化
   */
  init(){
    this.isDetail = this.route.params['value'].id?true:false;
    if(this.isDetail){
      this.userService.findById(this.route.params['value'].id).subscribe(res=>{
        console.log(res);
        this.user=res["data"];
        this.user.born_date = new Date(res["data"].born_date);
        this.user.status = this.dataTool.strTransBool(this.user.status,'status');
        this.user.sex = this.dataTool.strTransBool(this.user.sex,'sex');
      });
    }
  }
  /**
   * 保存
   */
  save(){
    console.log(this.user);
    if(!this.validateForm.valid){
      this.nzMessage.error("请将表单填写完整");
      for(const i in this.validateForm.controls){
        this.validateForm.controls[ i ].markAsDirty();
      }
      return;
    }
    if(this.isDetail){
      this.update();
    }else {
      this.add();
    }
  }

  /**
   * 新增
   */
  add(){
    //转换数据
    this.user.status=this.dataTool.boolTransStr(this.user.status,'status');
    this.user.sex=this.dataTool.boolTransStr(this.user.sex,'sex');
    this.userService.add(this.user).subscribe(res=>{
      console.log(res);
      if(res["result"]==1){
        this.nzMessage.success("注册成功");
        this.validateForm.reset();
        this.user.status = this.dataTool.strTransBool(this.user.status,'status');
      }else {
        this.user.status = this.dataTool.strTransBool(this.user.status,'status');
        this.nzMessage.error(res["error"].message);
      }
    },err=>{
      console.log("error:"+err);
    })
  }
  /**
   * 返回列表
   */
  /**
   * 修改
   */
  update(){
    //转换数据
    this.user.status=this.dataTool.boolTransStr(this.user.status,'status');
    this.user.sex=this.dataTool.boolTransStr(this.user.sex,'sex');
    this.userService.update(this.user).subscribe(res=>{
      console.log(res);
      if(res["result"]==1){
        this.user.status = this.dataTool.strTransBool(this.user.status,'status');
        this.nzMessage.success("修改成功");
      }else {
        this.user.status = this.dataTool.strTransBool(this.user.status,'status');
        this.nzMessage.error(res["error"].message);
      }
    },err=>{
      console.log("error:"+err);
    })
  }
  back(){
    if(this.isDetail){
      this.router.navigate(['../../user-list'],{relativeTo:this.route})
    }else {
      this.router.navigate(['../user-list'],{relativeTo:this.route})
    }
  }

  /**
   * 构建表单验证
   */
  createValidatorGroup(){
    this.validateForm = this.fb.group({
      name:['',[Validators.required]],
      password:['',[Validators.required]],
      certificateId: ['',[Validators.required]],
      mobile:['',[Validators.required]],
      email:['',[Validators.required]],
      userType:['',[Validators.required]],
      city:['',[Validators.required]],
      address:'',
      sex:'',
      birthDate:'',
      status:''
    })
  }
}
