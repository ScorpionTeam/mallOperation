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
    goodNo: '',
    richContent:''
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
        this.good.price = this.dataTool.fTransYuan(this.good.price);//分转元显示
        this.good.promotion = this.dataTool.fTransYuan(this.good.promotion);//分转元显示
        this.imgUrlList = res["data"].imgList;
        //图片初始化
        if(this.imgUrlList.length!=0){
          this.initUrl= this.imgUrlList[0].url;
        }
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

  priceChange(){
    this.good.promotion = (this.good.price) * this.good.discount/100;
    console.log(this.good.promotion);
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
    this.good.price = this.dataTool.yTransFen(this.good.price);//元转分传
    this.good.promotion = this.dataTool.yTransFen(this.good.promotion);//元转分传
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
      this.good.price = this.dataTool.fTransYuan(this.good.price);//分转元显示
      this.good.promotion = this.dataTool.fTransYuan(this.good.promotion);//分转元显示
    },err=>{
      this.transStr();
      console.log("error="+err);
      this.good.price = this.dataTool.fTransYuan(this.good.price);//分转元显示
      this.good.promotion = this.dataTool.fTransYuan(this.good.promotion);//分转元显示
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
    this.good.price = this.dataTool.yTransFen(this.good.price);//元转分传
    this.good.promotion = this.dataTool.yTransFen(this.good.promotion);//元转分传
    this.https.post('backstage/good/update',{good:this.good,imageList:this.imgUrlList}).subscribe(res=>{
      console.log(res)
      if(res["result"]==1){
        this.transStr();
        this.nzMessage.success(res["data"]);
      }else {
        this.transStr();
        this.nzMessage.error(res["error"].message);
      }
      this.good.price = this.dataTool.fTransYuan(this.good.price);//分转元显示
      this.good.promotion = this.dataTool.fTransYuan(this.good.promotion);//分转元显示
    },err=>{
      this.transStr();
      this.good.price = this.dataTool.fTransYuan(this.good.price);//分转元显示
      this.good.promotion = this.dataTool.fTransYuan(this.good.promotion);//分转元显示
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
      goodNo:['',[Validators.required]],
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

  /**
   * 获取富文本内容
   * @param val
   */
  getRichContent(val){
    console.log(this.good.richContent);
  }
}
