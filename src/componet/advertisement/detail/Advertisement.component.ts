import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Http} from "../../../common/http/Http";
import {NzMessageService} from "ng-zorro-antd";
import {Router, ActivatedRoute} from "@angular/router";
import {DataTool} from "../../../common/data/DataTool";
import {isUndefined} from "util";

@Component({
 selector:'advertisement-detail',
  templateUrl:'Advertisement.component.html'
})

export class AdvertisementComponent implements OnInit{

  banner:any={
    status:true
  };
  initPicUrl:any;
  validateForm:FormGroup;
  constructor(private fb:FormBuilder,private http:Http,private nzMessage:NzMessageService,
                private router:Router,private route:ActivatedRoute,private dataTool:DataTool){}
  ngOnInit(){
    this.crateValidate();
  }

  /**
   * 创建检验
   */
  crateValidate(){
    this.validateForm = this.fb.group({
      name:["",[Validators.required]],
      actionUrl:["",[Validators.required]],
      sort:["",[Validators.required]],
      status:""
    });
  }

  /**
   * 图片上传成功
   * @param val
   */
  uploadSuccess(val){
    this.banner.imgUrl = val[0].url;
    console.log(this.banner.imgUrl);
  }

  /**
   * 图片删除成功
   */
  delSuccess(){
    this.banner.imgUrl = '';
  }

  /**
   * 保存
   */
  save(){
    if(isUndefined(this.banner.imgUrl)){
      this.nzMessage.warning("请上传图片");
      return;
    }else if(!this.validateForm.valid){
      console.log(this.validateForm);
      this.nzMessage.warning("请将表单填写完整");
      return;
    }
    if(this.route.params["value"].id){
      this.update();
    }else {
      this.add();
    }
  }

  add(){
    this.banner.status = this.dataTool.boolTransStr(!this.banner.status);
    this.http.post("backstage/banner/add",this.banner).subscribe(
      res=>{
        console.log(res);
        this.banner.status = !this.dataTool.strTransBool(this.banner.status);
        if(res["result"]==1){
          this.nzMessage.success("新增活动成功");
          this.validateForm.reset();
          this.initPicUrl='';
        }
      },
      err=>{
        this.banner.status = !this.dataTool.strTransBool(this.banner.status);
        console.log(err);
      }
    )
  }
  update(){
    this.banner.status = this.dataTool.boolTransStr(!this.banner.status);
    this.http.post("backstage/banner/modify",this.banner).subscribe(
      res=>{
        console.log(res);
        this.banner.status = !this.dataTool.strTransBool(this.banner.status);
        if(res["result"]==1){
          this.nzMessage.success("修改成功");
        }
      },
      err=>{
        this.banner.status = !this.dataTool.strTransBool(this.banner.status);
        console.log(err)
      }
    )
  }

  /**
   * 返回
   */
  back(){
    if((this.route.params['value'].id)){
      this.router.navigate(["../../banner-list"],{relativeTo:this.route});
    }else {
      this.router.navigate(["../banner-list"],{relativeTo:this.route});
    }
  }

}
