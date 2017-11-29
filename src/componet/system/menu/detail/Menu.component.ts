import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd";
import {Http} from "../../../../common/http/Http";
import {DataTool} from "../../../../common/data/DataTool";
import {MenuService} from "../../../../service/menu/Menu.service";

@Component({
  selector:'menu-detail',
  templateUrl:'Menu.component.html',
  providers:[MenuService]
})

export class MenuComponent{
  validateForm:FormGroup;
  //判断是否为详情页
  isDetail:boolean;
  //初始化用户详情
  menu:any={
    status:true,
    pid:0
  };
  rootMenuList:any=[];
  constructor(private route:ActivatedRoute,private router :Router,private menuService:MenuService,
              private fb :FormBuilder, private nzMessage:NzMessageService,
              private http:Http,private dataTool:DataTool){}
  ngOnInit(){
    this.init();
    this.createValidatorGroup();
    this.findRootMenu();
  }

  /**
   * 初始化
   */
  init(){
    this.isDetail = this.route.params['value'].id?true:false;
    if(this.isDetail){
      this.menuService.findMenuById(this.route.params["value"].id).subscribe(res=>{
        console.log(res);
        this.menu=res["data"];
        this.menu.bornDate = new Date(res["data"].bornDate);
        this.menu.status=this.dataTool.strTransBool(this.menu.status,'status');
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
    //转换数据
    this.menu.status=this.dataTool.boolTransStr(this.menu.status,'status');
    this.menuService.add(this.menu).subscribe(res=>{
      console.log(res);
      if(res["result"]==1){
        this.nzMessage.success("新建成功");
        this.validateForm.reset();
      }else {
        this.nzMessage.error(res["error"].message);
      }
      this.menu.status = this.dataTool.strTransBool(this.menu.status,'status');
    },err=>{
      console.log("error:"+err);
      this.menu.status = this.dataTool.strTransBool(this.menu.status,'status');
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
    this.menu.status=this.dataTool.boolTransStr(this.menu.status,'status');
    this.menuService.update(this.menu).subscribe(res=>{
      console.log(res);
      if(res["result"]==1){
        this.nzMessage.success("修改成功");
      }else {
        this.nzMessage.error(res["error"].message);
      }
      this.menu.status = this.dataTool.strTransBool(this.menu.status,'status');
    },err=>{
      console.log("error:"+err);
      this.menu.status = this.dataTool.strTransBool(this.menu.status,'status');
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
      type: ['',[Validators.required]],
      sort: ['',[Validators.required]],
      url:'',
      status:'',
      description:'',
      pid:'',
      icon:''

    })
  }

  /**
   * 寻找根节点菜单
   */
  findRootMenu(){
    this.menuService.findRootMenu().subscribe(
      res=>{
        console.log(res);
        this.rootMenuList = res["data"];
      },
      err=>{
        console.log(err);
      }
    )
  }
}
