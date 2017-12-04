import {Component, OnInit} from "@angular/core";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {HttpData} from "../../../http/HttpData";
import {PictureServe} from "../../../service/Picture.serve";
@Component({
  selector:'picture-list',
  templateUrl:'PictureList.component.html'
  ,
  providers:[PictureServe]
})

export class PictureListComponent implements OnInit{
  constructor(private nzMessage:NzMessageService,private httpData:HttpData,
              private picServe:PictureServe,private nzModal:NzModalService){}
  ngOnInit(){
    this.pageChangeHandler(1);
  }
  picList:any=[];//图片列表
  page:any={
    pageNo:1,
    pageSize:10,
    total:0
  };
  searchKey:string='';//关键字
  detailUrl:string;//图片地址

  /**
   * 改变页码
   * @param val
   */
  pageChangeHandler(val:number){
    this.page.pageNo= val;
    this.picServe.list(this.page.pageNo,this.page.pageSize).subscribe(
      res=>{
        console.log(res);
        this.picList = res["list"];
        this.page.total = res["total"];
      }
    )
  }

  /**
   * 改变每页数量
   * @param val
   */
  pageSizeChangeHandler(val:number){
    this.page.pageSize = val;
    this.picServe.list(this.page.pageNo,this.page.pageSize).subscribe(
      res=>{
        this.picList = res["list"];
        this.page.total = res["total"];
        console.log(res);
      }
    )
  }

  /**
   * 查看图片
   * @param url
   * @param body
   */
  scan(url:string,body:any){
    this.detailUrl = this.httpData.PicUrl+url;
    this.nzModal.info({
      title:"图片详情",
      content:body
    });
  }

  /**
   * 新增图片
   * @param body
   */
  openModal(body:any){
    this.nzModal.confirm({
      title:"新增图片",
      content:body
    });
  }

  /**
   * 删除图片
   * @param url
   * @returns {Observable<R|T>}
   */
  delPic(url:string){
    return this.picServe.delPic(url).subscribe(
      res=>{
        if(res["result"]==1){
          this.nzMessage.success("删除成功");
          this.pageChangeHandler(this.page.pageNo);
        }
      }
    )
  }

  /**
   * 图片上传成功回调
   * @param val
   */
  uploadSuccess(val:any){
    console.log(val);
    this.nzMessage.success("上传成功");
    this.pageChangeHandler(this.page.pageNo);
  }

  /**
   * 图片删除成功回调
   * @param val
   */
  delSuccess(val:any){
    this.nzMessage.success("删除成功");
    this.pageChangeHandler(this.page.pageNo);
  }
}
