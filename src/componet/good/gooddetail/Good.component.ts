import {Component, OnInit, ElementRef, Renderer2} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Http} from "../../../common/http/Http";
import {NzMessageService} from "ng-zorro-antd";
import {DataTool} from "../../../common/data/DataTool";
import {isUndefined} from "util";

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
    richContent:'',
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
  /*规格模态*/
  isAttrShow:boolean=false;
  AttrModalTit:string;//模态标题
  modalObj:any={};//模态中的对象
  modalArray:any= [];//模态中的数组

  imgUrlList:any=[];
  initUrl:any;
  constructor(private route:ActivatedRoute,private router :Router,private nzMessage:NzMessageService,
              private fb :FormBuilder,private https:Http,private dataTool:DataTool,
              private render:Renderer2,private element : ElementRef,){}
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
        /*this.good.goodAttrExts=[];*/
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
        this.good.richContent = '';
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
    }else if(this.good.goodAttrExts.length==0){
      this.nzMessage.error("请先配置商品规格");
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
/*    let editor;
    setTimeout(()=>{
      editor = this.element.nativeElement.querySelector(".editor");
      console.log(editor);
      this.render.destroyNode(editor);
    },0);*/
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
   * 关闭模态框
   */
  closeModal(){
    this.isAttrShow = false;
  }

  /**
   * 查找规格
   */
   findAttr(){
    let url = "backstage/good/findById?id="+this.route.params['value'].id;
    this.https.get(url).subscribe(res=> {
      console.log(res);
      this.good.goodAttrExts = res["data"].goodAttrExts;
    });
  }
  /**
   * 新增规格
   * @param flag 0:新增规格，1:新增属性
   */
  addAttr(flag){
    if(flag==0){
      this.AttrModalTit = '规格新增';
      this.isAttrShow=true;
      this.modalArray=[];
      this.modalObj={};
    }else {
      this.modalArray.push({});
    }
  }
  /**
   * 修改属性
   * @param index
   * @param data
   */
  editAttr(index,data){
    console.log(data);
      this.isAttrShow = !this.isAttrShow;
      this.AttrModalTit = '规格详情';
      this.modalObj = Object.assign(data);
      console.log(this.modalObj);
      if(data.attrExts.length==0){
        this.modalArray = [];
      }else {
        this.modalArray = data.attrExts[0].attrValueList.concat();
      }
  }

  /**
   * 保存更改
   */
  saveAttr(){
    console.log(this.modalObj);
    console.log(this.modalArray);
    //保存新增更改
    if(isUndefined(this.modalObj.attrName)||isUndefined(this.modalObj.verNo||this.modalArray.length==0)){
      this.nzMessage.warning("所有的输入框都需填写!");
      return;
    }
    let attrObj:any= {};
    attrObj.goodId = this.route.params['value'].id;
    this.modalObj.attrValueList = this.modalArray;
    attrObj.attrExts= [this.modalObj];
    this.https.post('attr/add',attrObj).subscribe(
      res=>{
        console.log(res);
        if(res["result"]==1){
          this.isAttrShow =false;
          this.nzMessage.success("新增规格成功");
          this.findAttr();
        }
      },
      err=>{
        this.nzMessage.error("新增规格失败");
        console.log(err);
      }
    )
  }

  /**
   * 删除属性
   * @param flag 0:规格 1:规格值
   * @param id
   */
  delAttr(flag,index,id?){
      if(flag==0){

      }else {
        this.modalArray.splice(index,1);
      }
  }

 /* /!**
 * 选规格
 * @param i 当前规格序列号
 * @param id 当前规格id
 *!/
 selectAttr(i,id){
 this.selectRow = i;
 this.curAttrName = this.good.attrList[i].attrName;//当前规格名
 this.curAttrId = id;//当前规格ID
 this.curAttrValueList = this.good.attrList[i].attrValueList;//将attrValueList指针赋给curAttrValueList
 console.log(this.good.attrList);
 }

 /!**
 * 新增
 * @param flag 0:新增规格 1:新增规格值
 *!/
 addAttr(flag){
 if(flag==0){
 this.good.attrList.push({attrValueList:[]});//属性列表长度+1
 this.editObj = {attrName:'',verNo:0,attrValueList:[]};//初始化新增行对象
 this.editRow = this.good.attrList.length-1;//设置当前编辑行为新增行Index
 this.isAddAttr = true;//标记为新增行
 }else if(flag==1){
 //判断是否已选择规格
 if(this.curAttrName==''){
 this.nzMessage.warning("请先选择规格");
 return;
 }
 //当前属性值列表长度+1
 this.curAttrValueList.push({});
 console.log(this.curAttrValueList);
 //当前属性值编辑对象初始化
 this.editObj={};
 //设置当前选中行
 this.editValueRow = this.curAttrValueList.length-1;
 //标记为新增属性值
 this.isAddAttrValue=true;
 //
 }
 }
 /!**
 * *修改规格
 * @param i 行号
 * @param data 该行对象
 * @param flag 0:编辑规格 1:编辑规格值
 *!/
 editAttr(i,data,flag){
 if(flag==0){
 console.log(i==this.editRow&&this.isAddAttrValue)
 this.editRow = i;//获取当前行
 this.editValueRow=-1;
 this.editObj =Object.assign({},data);//获取当前行编辑对象
 }else if(flag==1){
 this.editValueRow=i;
 this.editRow=-1;
 this.editObj =Object.assign({},data);
 }

 }

 /!**
 * 保存规格修改内容
 * @param id 规格id
 * @param flag 0:编辑规格 1:编辑规格值 2:保存新增规格 3.保存新增规格值
 *!/
 saveAttr(id ,flag){
 for(let key in this.editObj){
 if(this.editObj[key]==''||isUndefined(this.editObj[key])){
 console.log(key)
 if(key=='attrValueList'){continue;}//跳过attrValueList校验
 this.nzMessage.warning("请将输入框中的值填写完整");
 return ;
 }
 }
 if(flag==0){
 //Todo:修改属性接口
 this.good.attrList[this.editRow] = this.editObj;
 this.cancAttr(flag);
 }else if(flag==1){
 //Todo:修改属性值接口
 this.good.attrList[this.selectRow].attrValueList[this.editValueRow] = this.editObj;
 this.cancAttr(flag);
 }else if(flag==2){
 this.isAddAttr =false;
 this.editRow=-1;
 this.editObj={};
 //Todo:新增属性接口
 }else {
 //Todo:新增属性值接口
 //新增成功,将最新的当前属性值对象赋值给good对象中的属性值列表对应项
 }
 }

 /!**
 * 取消保存attr修改内容
 * @param flag 0:编辑规格 1:编辑规格值 2:取消规格 3.取消规格值
 *!/
 cancAttr(flag){
 if(flag==0){
 this.editObj={};
 this.editRow = -1;
 }else if(flag==1){
 this.editObj={};
 this.editValueRow = -1;
 }else if(flag==2){
 this.editObj={};
 this.editRow=-1;
 this.isAddAttr =false;
 this.good.attrList.pop();
 }else {
 this.isAddAttrValue=false;
 this.editValueRow=-1;
 this.editObj={};
 this.curAttrValueList.pop();
 }
 }
 /!**
 * 删除规格
 * @param i 当前规格在attrList中的索引
 * @param flag 0:编辑规格 1:编辑规格值
 *!/
 delAttr(i,flag){
 if(flag==0){
 //Todo:删除属性接口
 }else {
 //Todo:删除属性值接口
 }
 console.log(i);
 }
 */

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
