import {Component, OnInit} from "@angular/core";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd";
import {DataTool} from "../../../common/data/DataTool";
import {ActivatedRoute} from "@angular/router";
import {CategoryService} from "../../../service/category/Category.service";
import {RouterTool} from "../../../common/routertool/RouterTool";
@Component({
  selector:"category-detail",
  templateUrl:"Category.component.html",
  providers:[CategoryService]
})

export class CategoryComponent implements OnInit{
  constructor( private fb:FormBuilder ,private nzMessage:NzMessageService,private dataTool:DataTool,
               private route:ActivatedRoute,private categoryService:CategoryService,private routeTool:RouterTool){}
  ngOnInit(){
    this.init();
    this.createValidatorGroup();
    this.findRootCategory();
  }
  category:any={};
  validateForm:FormGroup;
  isDetail:boolean=false;//详情页标志
  rootcategoryList:any=[];//根目录

  /**
   * 初始化
   */
  init(){
    if(this.route.params['value'].id){
      this.isDetail=true;
      this.categoryService.findById(this.route.params['value'].id).subscribe(
        res=>{
          if(res["result"]==1){
            this.category = res["data"];
          }else {
            this.nzMessage.error(res["error"].message);
          }
          this.category.status = this.dataTool.strTransBool(this.category.status,'status');
        },
        err=>{
          this.category.status = this.dataTool.strTransBool(this.category.status,'status');
          console.log(err);
        }
      )
    }
  }

  /**
   * 构建表单验证
   */
  createValidatorGroup(){
    this.validateForm = this.fb.group({
      name:['',[Validators.required]],
      sort: ['',[Validators.required]],
      status:'',
      pid:'',
      icon:''

    });
  }

  /**
   *保存按钮事件
   */
  save(){
    if(!this.validateForm.valid){
      this.nzMessage.warning("请将表单填写完整");
      return ;
    }
    if(this.isDetail){
      this.update();
    }else{
      this.add();
    }
  }

  /**
   * 新增类目
   */
  add(){
    this.category.status = this.dataTool.boolTransStr(this.category.status,'status');
    this.categoryService.add(this.category).subscribe(
      res=>{
        if(res["result"]==1){
          this.nzMessage.success("新增成功");
          this.validateForm.reset();
        }else {
          this.nzMessage.error(res["error"].message);
        }
        this.category.status = this.dataTool.strTransBool(this.category.status,'status');
      },
      err=>{
        this.category.status = this.dataTool.strTransBool(this.category.status,'status');
        console.log(err);
      }
    )
  }

  /**
   * 修改类目信息
   */
  update(){
    this.category.status = this.dataTool.boolTransStr(this.category.status,'status');
    this.categoryService.update(this.category).subscribe(
      res=>{
        if(res["result"]==1){
          this.nzMessage.success("修改成功");
        }else {
          this.nzMessage.error(res["error"].message);
        }
        this.category.status = this.dataTool.strTransBool(this.category.status,'status');
      }
    )
  }

  /**
   * 返回
   */
  back() {
    if (this.isDetail) {
      this.routeTool.skipToPage("/../category-list",this.route);
    }else {
      this.routeTool.skipToPage("/category-list",this.route);
    }
  }

  /**
   * 查找根类目
   */
  findRootCategory(){
    this.categoryService.findRootOrChildCategory("PARENT").subscribe(
      res=>{
        this.rootcategoryList = res["list"];
      }
    );
  }
}
