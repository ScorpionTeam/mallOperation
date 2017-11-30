import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Http} from "../../../common/http/Http";
import {NzMessageService} from "ng-zorro-antd";
import {Router, ActivatedRoute} from "@angular/router";
import {DataTool} from "../../../common/data/DataTool";
import {isUndefined} from "util";
import {AdvertisementService} from "../../../service/advertisement/Advertisement.service";

@Component({
 selector:'advertisement-detail',
  templateUrl:'Advertisement.component.html',
  providers:[AdvertisementService]
})

export class AdvertisementComponent implements OnInit{

  banner:any={
    status:true
  };
  initPicUrl:any;
  validateForm:FormGroup;
  constructor(private fb:FormBuilder,private http:Http,private nzMessage:NzMessageService,
              private advertisementService:AdvertisementService,private router:Router,
              private route:ActivatedRoute,private dataTool:DataTool){}
  ngOnInit(){
    this.crateValidate();
    this.init();
  }

  init(){
    if(this.route.params["value"].id){
      this.advertisementService.findById(this.route.params["value"].id).subscribe(
        res=>{
          if(res["result"]==1){
            this.banner = res["data"];
            this.initPicUrl=res["data"].image_url;
            this.banner.status=this.dataTool.strTransBool(this.banner.status,'status');
          }else {
            this.nzMessage.error(res["error"].message);
          }
        },
        err=>{
          console.log(err);
        }
      )
    }
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
  uploadPic(val:any){
    this.banner.image_url = val[0].url;
    console.log(this.banner.image_url);
  }

  /**
   * 图片删除成功
   */
  delPic(){
    this.banner.image_url = '';
  }

  /**
   * 保存
   */
  save(){
    if(isUndefined(this.banner.image_url)||this.banner.image_url==''){
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
    this.banner.status = this.dataTool.boolTransStr(this.banner.status,'status');
    this.advertisementService.add(this.banner).subscribe(
      res=>{
        console.log(res);
        this.banner.status = !this.dataTool.strTransBool(this.banner.status,'status');
        if(res["result"]==1){
          this.nzMessage.success("新增活动成功");
          this.validateForm.reset();
          this.initPicUrl='';
        }
      },
      err=>{
        this.banner.status = !this.dataTool.strTransBool(this.banner.status,'status');
        console.log(err);
      }
    )
  }
  update(){
    this.banner.status = this.dataTool.boolTransStr(this.banner.status,'status');
    this.advertisementService.update(this.banner).subscribe(
      res=>{
        console.log(res);
        this.banner.status = this.dataTool.strTransBool(this.banner.status,'status');
        if(res["result"]==1){
          this.nzMessage.success("修改成功");
        }
      },
      err=>{
        this.banner.status = this.dataTool.strTransBool(this.banner.status,'status');
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
