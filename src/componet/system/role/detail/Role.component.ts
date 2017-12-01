import {Component, OnInit} from "@angular/core";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {RoleService} from "../../../../service/role/Role.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd";
import {DataTool} from "../../../../common/data/DataTool";
@Component({
  selector:'role-detail',
  templateUrl:'Role.component.html',
  providers:[RoleService]
})

export class RoleComponent implements OnInit{
  constructor(private roleService:RoleService,private fb:FormBuilder,private route:ActivatedRoute,
               private  nzMessage:NzMessageService,private dataTool:DataTool,private router:Router){}
  ngOnInit(){
    this.createValidatorGroup();
    this.init();
  }
  role:any={};
  validateForm:FormGroup;
  //判断是否为详情页
  isDetail:boolean;

  /**
   * 初始化
   */
  init(){
    this.isDetail = this.route.params['value'].id?true:false;
    if(this.isDetail){
      this.roleService.findRoleById(this.route.params['value'].id).subscribe(res=>{
        console.log(res);
        this.role=res["data"];
        this.role.status=this.dataTool.strTransBool(this.role.status,'status');
      });
    }
  }
  /**
   * 保存
   */
  save(){
    console.log(this.role);
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
    this.role.status=this.dataTool.boolTransStr(this.role.status,'status');
    this.roleService.add(this.role).subscribe(res=>{
      console.log(res);
      if(res["result"]==1){
        this.nzMessage.success("新建成功");
        this.validateForm.reset();
      }else {
        this.nzMessage.error(res["error"].message);
      }
      this.role.status = this.dataTool.strTransBool(this.role.status,'status');
    },err=>{
      console.log("error:"+err);
      this.role.status = this.dataTool.strTransBool(this.role.status,'status');
    })
  }

  /**
   * 返回列表
   */
  back(){
    if(this.isDetail){
      this.router.navigate(['../../role-list'],{relativeTo:this.route})
    }else {
      this.router.navigate(['../role-list'],{relativeTo:this.route})
    }
  }

  /**
   * 修改
   */
  update(){
    //转换数据
    this.role.status=this.dataTool.boolTransStr(this.role.status,'status');
    this.roleService.update(this.role).subscribe(res=>{
      console.log(res);
      if(res["result"]==1){
        this.nzMessage.success("修改成功");
      }else {
        this.nzMessage.error(res["error"].message);
      }
      this.role.status = this.dataTool.strTransBool(this.role.status,'status');
    },err=>{
      console.log("error:"+err);
      this.role.status = this.dataTool.strTransBool(this.role.status,'status');
    })
  }


  /**
   * 构建表单验证
   */
  createValidatorGroup(){
    this.validateForm = this.fb.group({
      name:['',[Validators.required]],
      status:'',
      remark:''
    })
  }
}
