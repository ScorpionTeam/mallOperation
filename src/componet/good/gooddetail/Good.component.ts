import {Component, OnInit, ElementRef, Renderer2} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Http} from "../../../common/http/Http";
import {NzMessageService} from "ng-zorro-antd";
import {DataTool} from "../../../common/data/DataTool";
import {isUndefined} from "util";
import {GoodService} from "../../../service/good/Good.service";
import {CategoryService} from "../../../service/category/Category.service";

@Component({
  selector:'good',
  templateUrl:"Good.component.html",
  styleUrls:["Good.component.css"],
  providers:[GoodService,CategoryService]
})

export class GoodComponent implements OnInit{
  validateForm:FormGroup;
  validateImg:FormGroup;
  //判断是否为详情页
  isDetail:boolean;
  //初始化商品详情
  good:any= {
    good_name: '',
    description: '',
    promotion:0,
    discount:100,
    price: 0,
    stock: 0,
    on_sale: false,
    hot: false,
    is_new: false,
    freight: false,
    good_no: '',
    rich_content:'',
    goodAttrExts:[]
  };

  curAttrValueList:any=[];//当前属性值数组
  curAttrName:any='';//当前选中规格名称
  curAttrId:any;//当前选中规格Id
  selectRow:any;//当前选中行
  editRow:any;//当前规格编辑所在行
  editValueRow:any;//当前规格值编辑所在行
  editObj:any={};//编辑行的对象
  isAddAttr:boolean=false;//是否新增
  isAddAttrValue:boolean=false;//是否新增属性值
  isAttrShow:boolean=false;//规格模态
  AttrModalTit:string;//模态标题
  modalObj:any={};//模态中的对象
  modalArray:any= [];//模态中的数组
  imgUrlList:any=[];
  initUrl:any;
  initLittleUrl:any=[];
  categoryList:any=[];//类目列表
  brandList:any=[];//品牌列表
  constructor(private route:ActivatedRoute,private router :Router,private nzMessage:NzMessageService,
              private fb :FormBuilder,private https:Http,private dataTool:DataTool,
              private categoryService:CategoryService,private goodService:GoodService){}
  ngOnInit(){
    this.init();
    this.createValidatorGroup();
    this.getCategoryList();
  }

  /**
   * 初始化
   */
  init(){
    this.isDetail = this.route.params['value'].id?true:false;
    if(this.isDetail){
      this.goodService.detail(this.route.params['value'].id).subscribe(res=>{
        console.log(res);
        this.good=res["data"];
        /*this.good.goodAttrExts=[];*/
        this.good.price = this.dataTool.fTransYuan(this.good.price);//分转元显示
        this.good.promotion = this.dataTool.fTransYuan(this.good.promotion);//分转元显示
        this.imgUrlList = res["data"].imgList;
        //图片初始化
        if(this.imgUrlList.length!=0){
          this.initUrl= this.imgUrlList[0].url;
          this.initLittleUrl = this.imgUrlList.concat();
        }
        this.transBool();
      });
    }
  }

  /**
   * 获取商品类目列表
   */
  getCategoryList(){
    this.categoryService.findRootOrChildCategory("CHILD").subscribe(
      res=>{
        this.categoryList = res["list"];
      }
    )
  }

  /**
   * 保存
   */
  save(){
    console.log(this.good);
    if(!this.validateForm.valid||this.imgUrlList.length==0||this.good.rich_content==''||isUndefined(this.good.rich_content)){
      this.nzMessage.error("请将表单填写完整");
      for(const i in this.validateForm.controls){
        this.validateForm.controls[ i ].markAsDirty();
      }
      return;
    }else if(!this.validateForm.valid){
      this.nzMessage.error("请将检查主图是否上传");
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
  }
  /**
   * 新增
   */
  add(){
    this.initLittleUrl = this.imgUrlList.concat();
    this.transStr();
    this.good.price = this.dataTool.yTransFen(this.good.price);//元转分传
    this.good.promotion = this.dataTool.yTransFen(this.good.promotion);//元转分传
    this.goodService.add(this.good,this.imgUrlList).subscribe(res=>{
      console.log(res)
      if(res["result"]==1){
        this.nzMessage.success("添加成功");
        this.validateForm.reset();
        this.initUrl='';//清空主图
        //清空辅图
        console.log(this.initLittleUrl);
        for(let i =0 ;i<this.initLittleUrl.length;i++){
          this.initLittleUrl[i]='';
        }
        this.imgUrlList = [];//清空图片列表
        this.good.rich_content = '';
      }else {
        this.transBool();
        this.nzMessage.error(res["error"].message);
      }
      this.good.price = this.dataTool.fTransYuan(this.good.price);//分转元显示
      this.good.promotion = this.dataTool.fTransYuan(this.good.promotion);//分转元显示
    },err=>{
      this.transBool();
      console.log("error="+err);
      this.good.price = this.dataTool.fTransYuan(this.good.price);//分转元显示
      this.good.promotion = this.dataTool.fTransYuan(this.good.promotion);//分转元显示
    })
  }

  /**
   * 修改
   */
  update(){
    this.transStr();
    this.good.price = this.dataTool.yTransFen(this.good.price);//元转分传
    this.good.promotion = this.dataTool.yTransFen(this.good.promotion);//元转分传
    this.goodService.update(this.good,this.imgUrlList).subscribe(res=>{
      console.log(res);
      if(res["result"]==1){
        this.transBool();
        this.nzMessage.success(res["data"]);
      }else {
        this.transBool();
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
   * 获取富文本内容
   * @param richContent
   */
  getRitchContent(richContent:any){
    this.good.rich_content = richContent;
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
      isOnSale:'',
      seo:['',[Validators.required]]
    });
    this.validateImg = this.fb.group({
      imageType:['',[Validators.required]]
    });
  }

  /**
   * 转换bool
   */
  transBool(){
    this.good.freight = this.good.freight=="FREIGHT"?true:false;
    this.good.hot = this.good.hot=="HOT"?true:false;
    this.good.is_new = this.good.is_new=="IS_NEW"?true:false;
    this.good.on_sale = this.good.on_sale=="ON_SALE"?true:false;
  }
  transStr(){
    this.good.freight = this.good.freight?"FREIGHT":"UN_FREIGHT";
    this.good.hot = this.good.hot?"HOT":"NOT_HOT";
    this.good.is_new = this.good.is_new?"IS_NEW":"NOT_NEW";
    this.good.on_sale = this.good.on_sale?"ON_SALE":"OFF_SALE"
  }

  /**
   * 关闭模态框
   */
  closeModal(){
    this.isAttrShow = false;
  }


  /**
   * 图片
   * @param flag 0:主图  1:小图
   */
  imgUpload = (val:any,flag:any)=>{
    if(flag==0){
      this.good.main_image_url = val[0].url;
      this.imgUrlList.unshift(val[0]);
    }else {
      this.imgUrlList = this.imgUrlList.concat(val);
    }
  };


  /**
   * 删除图片
   * @param flag 0:主图  1:小图
   */
  delPic(val:any,flag?:any){
    console.log(val);
    let index ;
    for(let i in this.imgUrlList){
      if(this.imgUrlList[i].url==val){
        index = i;
      }
    }
    this.imgUrlList.splice(index,1);
  }
}
