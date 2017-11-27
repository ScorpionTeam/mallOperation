import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd";
import {Http} from "../../../../common/http/Http";

@Component({
  selector:'menu-detail',
  templateUrl:'Menu.component.html'
})

export class MenuComponent{
  validateForm:FormGroup;
  //判断是否为详情页
  isDetail:boolean;
  //初始化用户详情
  menu:any={
    status:true
  };

  constructor(private route:ActivatedRoute,private router :Router,
              private fb :FormBuilder, private nzMessage:NzMessageService,
              private http:Http){}
  ngOnInit(){
    this.init();
    this.createValidatorGroup();
  }

  /**
   * 初始化
   */
  init(){
    this.isDetail = this.route.params['value'].id?true:false;
    if(this.isDetail){
      let url = "backstage/menu/findById?id="+this.route.params['value'].id;
      this.http.get(url).subscribe(res=>{
        console.log(res);
        this.menu=res["data"];
        this.menu.bornDate = new Date(res["data"].bornDate);
      });
    }
  }
  /**
   * 保存
   */
  save(){
    console.log(this.menu);
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
    let url = 'backstage/menu/register';
    //转换数据
    this.menu.status=this.menu.status?"1":"0";
    this.http.post(url,this.menu).subscribe(res=>{
      console.log(res);
      if(res["result"]==1){
        this.nzMessage.success("注册成功");
        this.validateForm.reset();
      }else {
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
    let url = 'backstage/menu/modify';
    //转换数据
    this.menu.status=this.menu.status?"1":"0";
    this.http.post(url,this.menu).subscribe(res=>{
      console.log(res);
      if(res["result"]==1){
        this.nzMessage.success("修改成功");
      }else {
        this.nzMessage.error(res["error"].message);
      }
    },err=>{
      console.log("error:"+err);
    })
  }
  back(){
    if(this.isDetail){
      this.router.navigate(['../../menu-list'],{relativeTo:this.route})
    }else {
      this.router.navigate(['../menu-list'],{relativeTo:this.route})
    }
  }

  /**
   * 构建表单验证
   */
  createValidatorGroup(){
    this.validateForm = this.fb.group({
      name:['',[Validators.required]],
      address:['',[Validators.required]],
      parentMenu: ['',[Validators.required]],
      status:''
    })
  }
}
