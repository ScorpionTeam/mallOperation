import {Component, Input, Output, EventEmitter, OnInit, AfterViewInit, OnChanges, SimpleChanges} from "@angular/core";
import {Http} from "../http/Http";
import {DataTool} from "../data/DataTool";
import {NzMessageService} from "ng-zorro-antd";
import {isUndefined} from "util";
@Component({
  selector:"upload-pic",
  templateUrl:"ImgUpload.html",
  styleUrls:["ImgUpload.css"]
})
export class ImgUpload implements OnInit,OnChanges{
  @Input() type;//图片类型
  @Input() initUrl:any;//初始化地址
  @Output() uploadSuccess = new EventEmitter();//上传成功回调
  @Output() delSuccess = new EventEmitter();//删除图片成功回调

  publicUrl:string='';//图片公共地址
  imgPreview:any;
  isUpload:boolean=false;//是否上传标志
  imgObj:any={
    cutSizeList:[]
  };//上传图片容器
  imgSizeList:any=[
    { label: '商品列表(小:30*30)', value:{height:30,width:30}, checked: false },
    { label: '商品详情(小:40*40)', value:{height:40,width:40}, checked: false },
    { label: '商品详情(:小60*60)', value:{height:60,width:60}, checked: false },
    { label: '商品列表(大:220*220)', value:{height:220,width:220}, checked: false },
    { label: '商品详情(大:400*400)', value:{height:400,width:400}, checked: false }
  ];//图片尺寸列表
  constructor(private https : Http,private dataTool:DataTool,private nzMessage:NzMessageService){}

  ngOnInit(){

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.init();
    console.log(changes);
  }

  init(){
    this.imgObj.imageType=this.type;
    //图片有初始值进行初始化
    if(!isUndefined(this.initUrl)){
      this.previewPic(this.initUrl);
    }else if(this.initUrl==''||isUndefined(this.initUrl)){
      this.imgPreview='';
    }
    console.log(this.isUpload);
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
    if(this.imgObj.watermark&&this.imgObj.cut&&this.imgObj.cutSizeList.length==0){
      this.nzMessage.warning("添加水印必须选择裁剪尺寸!");
      return;
    }
    let formData= new FormData();
    console.log(this.imgObj)
    //图片上传部分代码
    this.imgObj.watermark=this.dataTool.boolTransStr(this.imgObj.watermark)
    this.imgObj.cut=this.dataTool.boolTransStr(this.imgObj.cut);
    formData.append("jsonContent",JSON.stringify(this.imgObj));
    formData.append("file",val.target.files[0]);
    this.https.postImg('file/uploadImage',formData).subscribe(
      res=>{
        if(res["result"]==1){
          this.uploadSuccess.emit(res["data"]);
          this.previewPic(res["data"][0].url);
        }
        this.imgObj.watermark = this.dataTool.strTransBool(this.imgObj.watermark);
        this.imgObj.cut = this.dataTool.strTransBool(this.imgObj.cut);
      },
      err=>{
        this.imgObj.watermark = this.dataTool.strTransBool(this.imgObj.watermark);
        this.imgObj.cut = this.dataTool.strTransBool(this.imgObj.cut);
        console.log(err);
      }
    )
  };

  /**
   * 图片预览函数
   * @param url
   */
  previewPic(url){
    console.log(url);
    this.isUpload = !this.isUpload;
    this.imgPreview ="http://4d3ih8.natappfree.cc"+ url;
  }

  /**
   * 删除图片
   */
  delPic(){
    let delName = this.imgPreview.substring(27);
    console.log(delName);
    this.https.get("file/deleteImage?imageName="+delName).subscribe(
      res=>{
        if(res["result"]==1){
          this.isUpload=!this.isUpload;
          this.imgPreview = "";
          this.delSuccess.emit("1");
        }else{
          this.nzMessage.error("删除失败")
        }
      },
      err=>{
        console.log(err);
      }
    )
  }
}
