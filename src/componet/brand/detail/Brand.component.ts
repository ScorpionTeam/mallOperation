import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router, ActivatedRoute} from "@angular/router";
import {Http} from "../../../common/http/Http";
import {NzMessageService} from "ng-zorro-antd";
import {isUndefined} from "util";
@Component({
  selector:"brand-detail",
  templateUrl:"Brand.component.html",
  styleUrls:["Brand.component.css"]
})

export class BrandDetailComponent{
  brand:any={};
  initUrl:any;
  validateForm:FormGroup;
  constructor(private fb:FormBuilder,private router:Router,private route:ActivatedRoute,
              private http:Http,private  nzMessage :NzMessageService){
    this.initFormValidate();
  }

  /**
   * 初始化表单验证
   */
  initFormValidate(){
    this.validateForm = this.fb.group({
      brandName:["",[Validators.required]],
      shortName:["",[Validators.required]],
      country:["",[Validators.required]],
      contact:["",[Validators.required]],
      contactPhone:["",[Validators.required,Validators.pattern("^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$")]],
      status:['']
    });
  }

  /**
   * 保存
   */
  save(){
    console.log(this.validateForm.valid)
    console.log(this.brand.brandImg)
    if(!this.validateForm.valid||this.brand.brandImg==''||isUndefined(this.brand.brandImg)){
      this.nzMessage.warning("请将表单填写完整");
      return;
    }
    if(this.route.params["value"].id){
      this.update();
    }else {
      this.add();
    }
  }

  /**
   * 新增
   */
  add(){
    this.http.post("backstage/brand/add",this.brand).subscribe(
      res=>{
        if(res["result"]==1){
          this.nzMessage.success("新增成功");
        }
      },
      err=>{
        console.log(err);
        this.nzMessage.error("系统错误");
      }
    )
  }

  /**
   * 更新
   */
  update(){
    console.log("更新");
  }

  /**
   * 返回
   */
  back(){
   this.router.navigate(["../brand-list"],{relativeTo:this.route});
  }

  /**
   * 上传图片成功
   * @param val
   */
  uploadPicSuccess(val){
    console.log(val)
    this.brand.brandImg = val[0].url;
  }

  /**
   * 删除图片成功
   * @param val
   */
  delPicSuccess(val){
    console.log(val)
    this.brand.brandImg="";
  }
}
