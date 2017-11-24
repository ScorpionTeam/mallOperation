import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Router, ActivatedRoute} from "@angular/router";
import {Http} from "../../../common/http/Http";
import {NzMessageService} from "ng-zorro-antd";
import {DataTool} from "../../../common/data/DataTool";
import {isUndefined} from "util";
@Component({
  selector:"ticket-detail",
  templateUrl:"Ticket.component.html",
  styleUrls:["Ticket.component.css"]
})

export class TicketComponent implements OnInit{
  ticket:any={};
  validateForm:FormGroup;
  isDetail:boolean=false;
  constructor(private fb:FormBuilder,private router:Router,private dataTool:DataTool,
              private route:ActivatedRoute,private http:Http,private nzMessage:NzMessageService){

  }

  ngOnInit(){
    if(this.route.params["value"].id){
      this.isDetail=!this.isDetail;
      this.detail();
    }
    this.creatValidate();
  }

  /**
   * 判断
   * @param flag 类型 0:优惠金额 1:总金额
   * @param val
   */
  justifyMoney(flag,val){
    console.log(val);
    if(flag==0){
      if(val<0||isUndefined(val)){
        this.ticket.reduceMoney=0
        this.nzMessage.warning("优惠金额不能小于0");
      }else if(val>this.ticket.money){
         this.ticket.reduceMoney=0;
         this.nzMessage.warning("优惠金额不能大于使用金额");
       }
    }else if(flag==1){
      if(val<0||isUndefined(val)){
        this.ticket.money=0;
        this.nzMessage.warning("优惠金额不能小于0");
      }if(val<this.ticket.reduceMoney){
         this.ticket.money=0;
         this.nzMessage.warning("使用金额不能小于优惠金额");
       }
    }
  }

  /**
   * 创建表单验证
   */
  creatValidate(){
    this.validateForm = this.fb.group({
      ticketNo:"",
      status:"",
      ticketName:["",[Validators.required]],
      type:["",[Validators.required]],
      content:["",[Validators.required]],
      money:["",[Validators.required]],
      reduce:["",[Validators.required]],
      num:["",[Validators.required]],
      startDate:["",[Validators.required]],
      endDate:["",[Validators.required]],
      numLimit:""
    });
  }

  /**
   * 禁止开始时间
   * @param startValue
   * @returns {boolean}
   */
  disabledStartDate=(startValue)=>{
    if(!startValue||!this.ticket.endDate){
      return false;
    }
    return startValue.getTime()>=this.ticket.endDate.getTime();
  };
  /**
   * 禁止结束时间
   * @param endValue
   * @returns {boolean}
   */
  disabledEndDate=(endValue)=>{
    if(!this.ticket.startDate||!endValue){
      console.log(1);
      return false
    }
    return endValue.getTime() <= this.ticket.startDate.getTime();
  };

  /**
   * 查找详情
   */
  detail(){
    this.http.get("backstage/ticket/findById?id="+this.route.params['value'].id).subscribe(
      res=>{
        console.log(res);
        if(res["result"]){
          this.ticket = res["data"];
          /*转换时间格式*/
          this.ticket.startDate = new Date(this.ticket.startDate);
          this.ticket.endDate = new Date(this.ticket.endDate);
          this.ticket.status = !this.dataTool.strTransBool(this.ticket.status);
          this.ticket.money = this.dataTool.fTransYuan(this.ticket.money);
          this.ticket.reduceMoney = this.dataTool.fTransYuan(this.ticket.reduceMoney);
          this.ticket.numLimit = !this.dataTool.strTransBool(this.ticket.numLimit);
        }
      },
      err=>{
        console.log(err);
      }
    );
  }
  /**
   * 保存
   */
  save(){
    console.log(this.validateForm);
    if(!this.validateForm.valid){
      this.nzMessage.warning("请将表单填写完整!");
      return;
    }
    if(this.route.params['value'].id){
      this.update();
    }else {
      this.add();
    }
  }

  /**
   * 返回
   */
  back(){
    if(this.route.params['value'].id){
      this.router.navigate(['../../ticket-list'],{relativeTo:this.route});
    }else {
      this.router.navigate(['../ticket-list'],{relativeTo:this.route});
    }
  }

  /**
   * 新增优惠券
   */
  add(){
    let curDate=new Date();
    if(this.ticket.endDate.getTime()<curDate.getTime()){
      this.nzMessage.error("结束时间早于当前时期,无法创建");
      return;
    }
    this.ticket.status = this.dataTool.boolTransStr(!this.ticket.status);
    this.ticket.numLimit = this.dataTool.boolTransStr(!this.ticket.numLimit);
    this.ticket.money = this.dataTool.yTransFen(this.ticket.money);
    this.ticket.reduceMoney = this.dataTool.yTransFen(this.ticket.reduceMoney);
    this.http.post('backstage/ticket/add',this.ticket).subscribe(
      res=>{
        if(res["result"]==1){
          this.validateForm.reset();
          this.nzMessage.success("新增成功");
        }else {
          this.nzMessage.warning(res['error'].message);
        }
        this.ticket.money = this.dataTool.fTransYuan(this.ticket.money);
        this.ticket.reduceMoney = this.dataTool.fTransYuan(this.ticket.reduceMoney);
        this.ticket.status = !this.dataTool.strTransBool(this.ticket.status);
        this.ticket.numLimit = !this.dataTool.strTransBool(this.ticket.numLimit);
      },
      err=>{
        console.log(err);
        this.ticket.money = this.dataTool.fTransYuan(this.ticket.money);
        this.ticket.reduceMoney = this.dataTool.fTransYuan(this.ticket.reduceMoney);
        this.ticket.status = !this.dataTool.strTransBool(this.ticket.status);
        this.ticket.numLimit = !this.dataTool.strTransBool(this.ticket.numLimit);
        this.nzMessage.error("新增失败");
      }
    );
  }

  /**
   * 修改优惠券
   */
  update(){
    this.ticket.numLimit = this.dataTool.boolTransStr(!this.ticket.numLimit);
    this.ticket.status = this.dataTool.boolTransStr(!this.ticket.status);
    this.ticket.money = this.dataTool.yTransFen(this.ticket.money);
    this.ticket.reduceMoney = this.dataTool.yTransFen(this.ticket.reduceMoney);
    this.http.post('backstage/ticket/modify',this.ticket).subscribe(
      res=>{
        if(res["result"]==1){
          this.nzMessage.success("修改成功");
        }else {
          this.nzMessage.warning(res['error'].message);
        }
        this.ticket.money = this.dataTool.fTransYuan(this.ticket.money);
        this.ticket.reduceMoney = this.dataTool.fTransYuan(this.ticket.reduceMoney);
        this.ticket.numLimit = !this.dataTool.strTransBool(this.ticket.numLimit);
        this.ticket.status = !this.dataTool.strTransBool(this.ticket.status);
      },
      err=>{
        this.ticket.money = this.dataTool.fTransYuan(this.ticket.money);
        this.ticket.reduceMoney = this.dataTool.fTransYuan(this.ticket.reduceMoney);
        this.ticket.numLimit = !this.dataTool.strTransBool(this.ticket.numLimit);
        this.ticket.status = !this.dataTool.strTransBool(this.ticket.status);
        this.nzMessage.error("修改失败");
      }
    )
  }
}
