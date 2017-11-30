import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup,FormControl,Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {HttpData} from "../../http/HttpData";
import {NzMessageService} from "ng-zorro-antd";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector:"login",
  templateUrl:"Login.component.html",
  styles:[`
   .login-form {
      max-width: 300px;
      margin: 0 auto;
      margin-top: 170px;
    }

    .login-form-forgot {
      float: right;
    }

    .login-form-button {
      width: 100%;
    }
  `]
})

export class LoginComponent implements  OnInit{
  userName:any;
  password:any;
  validateForm :FormGroup;

  constructor(private fb:FormBuilder,private http:HttpClient,
              private nzMessage : NzMessageService,private httpData:HttpData,
              private router:Router,private route:ActivatedRoute) {

  }

  ngOnInit() {
    this.createFormValidate();
  }

  /**
   * 创建校验函数
   */
  createFormValidate(){
    this.validateForm = this.fb.group({
      userName:['',Validators.required],
      password:['',[Validators.required,Validators.minLength(6)]]
    })
  }

  /**
   * 登录
   */
  login(){
    if(this.validateForm.valid){
      let url = this.httpData.Host+'backstage/user/login?mobile='+this.userName+'&password='+this.password;
      this.http.post(url,null).subscribe(res=>{
        if(res["result"]==1){
          this.router.navigate(['./index'])
          localStorage.setItem("token",res["data"].token);
          localStorage.setItem("name",res["data"].name);
          localStorage.setItem("mobile",this.userName);
          localStorage.setItem("id",res["data"].id);
          localStorage.setItem("city",res["data"].city);
        }else{
          this.nzMessage.error(res['error'].message)
        }
      },err=>{
        console.log("err"+err);
      })
    }else {
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[ i ].markAsDirty();
      }
      this.nzMessage.error("请将信息填写完整")
    }
  }
}
