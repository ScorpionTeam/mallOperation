import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd";
import {Http} from "../../../common/http/Http";
import {DataTool} from "../../../common/data/DataTool";

@Component({
  selector:'personal',
  templateUrl:'PersonDetail.component.html'
})

export class PersonalComponent{
  validateForm:FormGroup;
  //初始化用户详情
  person:any={
    sex:false
  };

  constructor(private route:ActivatedRoute,private router :Router,
              private fb :FormBuilder, private nzMessage:NzMessageService,
              private http:Http,private dataTool:DataTool){}
  ngOnInit(){
    this.init();
    this.createValidatorGroup();
  }

  /**
   * 初始化
   */
  init(){
    let url = "backstage/user/findById?id="+localStorage.getItem('id');
    this.http.get(url).subscribe(res=>{
      console.log(res);
      this.person=res["data"];
      this.person.sex=this.dataTool.strTransBool(this.person.sex,'sex');
      this.person.bornDate = new Date(res["data"].bornDate);
    });
  }
  /**
   * 保存
   */
  save(){
    console.log(this.person);
    if(!this.validateForm.valid){
      this.nzMessage.error("请将表单填写完整");
      for(const i in this.validateForm.controls){
        this.validateForm.controls[ i ].markAsDirty();
      }
      return;
    }
    this.update();
  }

  /**
   * 修改
   */
  update(){
    let url = 'backstage/user/modify';
    //转换数据
    this.person.sex=this.dataTool.boolTransStr(this.person.sex,'sex');
    this.http.post(url,this.person).subscribe(res=>{
      console.log(res);
      if(res["result"]==1){
        this.person.sex=this.dataTool.strTransBool(this.person.sex,'sex');
        this.nzMessage.success("修改成功");
      }else {
        this.person.sex=this.dataTool.strTransBool(this.person.sex,'sex');
        this.nzMessage.error(res["error"].message);
      }
    },err=>{
      console.log("error:"+err);
    })
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
      city:['',[Validators.required]],
      address:'',
      sex:'',
      birthDate:''
    })
  }
}
