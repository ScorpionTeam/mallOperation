import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router, ActivatedRoute} from "@angular/router";
import {Http} from "../../../common/http/Http";
import {NzMessageService} from "ng-zorro-antd";
import {isUndefined} from "util";
import {DataTool} from "../../../common/data/DataTool";
import {isNull} from "util";
import {Store} from "@ngrx/store";
import {num}from"../../../state/StateApplaction"
@Component({
  selector:"brand-detail",
  templateUrl:"Brand.component.html",
  styleUrls:["Brand.component.css"]
})

export class BrandDetailComponent implements OnInit{
  brand:any={
    status:true
  };
  initUrl:any;
  validateForm:FormGroup;
  constructor(private fb:FormBuilder,private router:Router,private route:ActivatedRoute,private store:Store<any>,
              private http:Http,private  nzMessage :NzMessageService,private dataTool:DataTool){
    this.initFormValidate();
  }

  ngOnInit(){
    this.init();
  }

  /**
   * 初始化
   */
  init(){
    if(this.route.params['value'].id){
      this.http.get("backstage/brand/findById?id="+this.route.params['value'].id).subscribe(
        res=>{
          if(res['result']==1){
            this.brand = res['data'];
            this.brand.status = this.dataTool.strTransBool(this.brand.status);
            if(!isNull(this.brand.brandImg)){
              this.initUrl = this.brand.brandImg;
            }
          }
        },
        err=>{
          console.log(err);
        }
      )
    }
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
    console.log(this.validateForm.valid);
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
    this.brand.status = this.dataTool.boolTransStr(this.brand.status);
    this.http.post("backstage/brand/add",this.brand).subscribe(
      res=>{
        if(res["result"]==1){
          this.nzMessage.success("新增成功");
          this.validateForm.reset();
          this.initUrl='';
        }
        this.brand.status = this.dataTool.strTransBool(this.brand.status);
      },
      err=>{
        console.log(err);
        this.brand.status = this.dataTool.strTransBool(this.brand.status);
        this.nzMessage.error("系统错误");
      }
    )
  }

  /**
   * 更新
   */
  update(){
    this.brand.status = this.dataTool.boolTransStr(this.brand.status);
    this.http.post("backstage/brand/modify",this.brand).subscribe(
      res=>{
        if(res["result"]==1){
          this.nzMessage.success("修改成功");
        }
        this.brand.status = this.dataTool.boolTransStr(this.brand.status);
      },
      err=>{
        console.log(err);
        this.brand.status = this.dataTool.boolTransStr(this.brand.status);
      }
    )
  }

  /**
   * 返回
   */
  back(){
    if(this.route.params['value'].id){
      this.router.navigate(["../../brand-list"],{relativeTo:this.route});
    }else {
      this.router.navigate(["../brand-list"],{relativeTo:this.route});
    }
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
