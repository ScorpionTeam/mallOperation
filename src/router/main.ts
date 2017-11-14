import {Routes, RouterModule} from "@angular/router";
import {LoginComponent} from "../componet/login/Login.component";
import {NgModule} from "@angular/core";
import {IndexComponent} from "../componet/index/Index.component";
import {GoodListComponent} from "../componet/good/goodlist/GoodList.component";
import {GoodComponent} from "../componet/good/gooddetail/Good.component";
import {OrderListComponent} from "../componet/order/orderlist/OrderList.component";
import {OrderComponent} from "../componet/order/orderdetail/Order.component";
import {UserListComponent} from "../componet/user/userlist/UserList.component";
import {UserComponent} from "../componet/user/userdetail/User.component";
import {ActivityListComponent} from "../componet/active/list/ActivityList.component";
import {ActivityComponent} from "../componet/active/detail/Activity.component";
import {BrandListComponent} from "../componet/brand/list/BrandList.component";
import {BrandDetailComponent} from "../componet/brand/detail/Brand.component";

 const appRoute :Routes = [
  {path:'',redirectTo:'/index',pathMatch: 'full'},
   {path:'index',component:IndexComponent,children:[
     {path:'good-list',component:GoodListComponent},
     {path:'good-detail/:id',component:GoodComponent},
     {path:'good-add',component:GoodComponent},
     {path:'order-list',component:OrderListComponent},
     {path:'order-detail/:id',component:OrderComponent},
     {path:'user-list',component:UserListComponent},
     {path:'user-add',component:UserComponent},
     {path:'user-detail/:id',component:UserComponent},
     {path:'activity-list',component:ActivityListComponent},
     {path:'activity-add',component:ActivityComponent},
     {path:'brand-list',component:BrandListComponent},
     {path:'brand-detail/:id',component:BrandDetailComponent},
     {path:'brand-add',component:BrandDetailComponent},
   ]},
  {path:'login',component:LoginComponent}
]

@NgModule({
  imports:[RouterModule.forRoot(appRoute)],
  exports:[RouterModule]
})

export class AppRouteModule{

}
