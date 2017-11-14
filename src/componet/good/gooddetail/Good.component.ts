import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Http} from "../../../common/http/Http";
import {NzMessageService} from "ng-zorro-antd";
import {DataTool} from "../../../common/data/DataTool";

@Component({
  selector:'good',
  templateUrl:"Good.component.html",
  styleUrls:["Good.component.css"]
})

export class GoodComponent implements OnInit{
  validateForm:FormGroup;
  validateImg:FormGroup;
  //判断是否为详情页
  isDetail:boolean;
  //初始化商品详情
  good:any= {
    categoryId: 0,
    goodName: '',
    description: '',
    promotion:0,
    discount:0,
    price: 0,
    stock: 0,
    isOnSale: false,
    isHot: false,
    isNew: false,
    isFreight: false,
    brandId:0,
    goodNo: ''
  };
  imgObj:any={
    cutSizeList:[],
    watermark:true,
    cut:true,
    imageType:'0'
  };
  imgUrlList:any=[];
  initUrl:any;
  constructor(private route:ActivatedRoute,private router :Router,private nzMessage:NzMessageService,
              private fb :FormBuilder,private https:Http,private dataTool:DataTool){}
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
      let url = "backstage/good/findById?id="+this.route.params['value'].id;
      this.https.get(url).subscribe(res=>{
        console.log(res);
        this.good=res["data"];
        this.imgUrlList = res["data"].imgList;
        //图片初始化
        if(this.imgUrlList.length!=0){
          this.initUrl= this.imgUrlList[0].url;
        }
        console.log(this.initUrl);
        this.transStr();
      });
    }
  }
  /**
   * 保存
   */
  save(){
    console.log(this.good);
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
    this.transBool();
    if(!this.validateForm.valid||this.imgUrlList.length==0){
      this.nzMessage.error("请将检查图片与表单信息是否都已录入");
      return;
    }
    this.https.post('backstage/good/add',{good:this.good,imageList:this.imgUrlList}).subscribe(res=>{
      console.log(res)
      if(res["result"]==1){
        this.nzMessage.success("添加成功");
        this.validateForm.reset();
        this.initUrl='';
      }else {
        this.transStr();
        this.nzMessage.error(res["error"].message);
      }
    },err=>{
      this.transStr();
      console.log("error="+err);
    })
  }

  /**
   * 修改
   */
  update(){
    if(!this.validateForm.valid||this.imgUrlList.length==0){
      this.nzMessage.error("请将检查图片与表单信息是否都已录入");
      return;
    }
    this.transBool();
    this.https.post('backstage/good/update',{good:this.good,imageList:this.imgUrlList}).subscribe(res=>{
      console.log(res)
      if(res["result"]==1){
        this.transStr();
        this.nzMessage.success(res["data"]);
      }else {
        this.transStr();
        this.nzMessage.error(res["error"].message);
      }
    },err=>{
      this.transStr();
      console.log(err);
    })
  }

  /**
   * 返回列表
   */
  back(){
    if(this.isDetail){
      this.router.navigate(['../../good-list'],{relativeTo:this.route})
    }else {
      this.router.navigate(['../good-list'],{relativeTo:this.route})
    }
  }

  /**
   * 构建表单验证
   */
  createValidatorGroup(){
    this.validateForm = this.fb.group({
      categoryId:['',[Validators.required]],
      name: ['',[Validators.required]],
      price:['',[Validators.required]],
      stock:['',[Validators.required]],
      brandId:['',[Validators.required]],
      discount:'',
      promotion:'',
      description:'',
      isFreight:'',
      isHot:'',
      isNew:'',
      isOnSale:''
    });
    this.validateImg = this.fb.group({
      imageType:['',[Validators.required]]
    });
  }

  /**
   * 转换bool
   */
  transBool(){
    this.good.isFreight = this.dataTool.boolTransStr(this.good.isFreight);
    this.good.isHot = this.dataTool.boolTransStr(this.good.isHot);
    this.good.isNew = this.dataTool.boolTransStr(this.good.isNew);
    this.good.isOnSale = this.dataTool.boolTransStr(this.good.isOnSale);
  }
  transStr(){
    this.good.isFreight = this.dataTool.strTransBool(this.good.isFreight);
    this.good.isHot = this.dataTool.strTransBool(this.good.isHot);
    this.good.isNew = this.dataTool.strTransBool(this.good.isNew);
    this.good.isOnSale = this.dataTool.strTransBool(this.good.isOnSale);
  }

  /**
   * 选取图片尺寸
   * @param val
   */
  selectImgSize(val){
    for(let index in val){
      let i = this.imgObj.cutSizeList.indexOf(val[index]["value"]);
      if(val[index]["checked"]){
        //判断是否已存在
        if(i!=-1){
          continue;
        }
        this.imgObj.cutSizeList.push(val[index]["value"])
      }else {
        //判断是否存在
        if(i==-1){
          continue;
        }
        this.imgObj.cutSizeList.splice(i,1);
      }
    }
  }
  /**
   * 图片
   */
  imgUpload = (val)=>{
    this.imgUrlList = val;
    this.good.mainImgUrl = val[0].url;
  };


  /**
   * 删除图片
   */
  delPic(){
    this.imgUrlList=[];
  }
}
