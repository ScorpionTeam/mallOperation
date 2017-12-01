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
import {TicketListComponent} from "../componet/ticket/list/TicketList.component";
import {TicketComponent} from "../componet/ticket/detail/Ticket.component";
import {ConcatGoodComponent} from "../componet/active/withgood/ConcatGood.component";
import {OutGoodComponent} from "../componet/active/outgood/OutGood.component";
import {MenuListComponent} from "../componet/system/menu/list/MenuList.component";
import {RouteGuard} from "../service/guard/RouteGuard";
import {AdvertisementListComonent} from "../componet/advertisement/list/AdvertisementList.component";
import {AdvertisementComponent} from "../componet/advertisement/detail/Advertisement.component";
import { PersonalComponent} from "../componet/user/person/PersonDetail.component";
import {MenuComponent} from "../componet/system/menu/detail/Menu.component";
import {CategoryListComponent} from "../componet/category/list/CategoryList.component";
import {CategoryComponent} from "../componet/category/detail/Category.component";
import {RoleListComponent} from "../componet/system/role/list/RoleList.component";
import {RoleComponent} from "../componet/system/role/detail/Role.component";

const appRoute :Routes = [
  {path:'',redirectTo:'/index',pathMatch: 'full',},
  {path:'index',component:IndexComponent,canActivate:[RouteGuard],canActivateChild:[RouteGuard],
    children:[
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
      {path:'activity-detail/:id',component:ActivityComponent},
      {path:'activity-good-concat',component:ConcatGoodComponent},
      {path:'activity-good-action',component:OutGoodComponent},
      {path:'brand-list',component:BrandListComponent},
      {path:'brand-detail/:id',component:BrandDetailComponent},
      {path:'brand-add',component:BrandDetailComponent},
      {path:'ticket-list',component:TicketListComponent},
      {path:'ticket-add',component:TicketComponent},
      {path:'ticket-detail/:id',component:TicketComponent},
      {path:'banner-list',component:AdvertisementListComonent},
      {path:'banner-add',component:AdvertisementComponent},
      {path:'banner-detail/:id',component:AdvertisementComponent},
        {path:'menu-list',component:MenuListComponent},
      {path:'menu-add',component:MenuComponent},
      {path:'menu-detail/:id',component:MenuComponent},
      {path:'personal',component:PersonalComponent},
      {path:'category-list',component:CategoryListComponent},
      {path:'category-add',component:CategoryComponent},
      {path:'category-detail/:id',component:CategoryComponent},
      {path:'role-list',component:RoleListComponent},
      {path:'role-add',component:RoleComponent},
      {path:'role-detail/:id',component:RoleComponent}
    ]},
  {path:'login',component:LoginComponent}
]

@NgModule({
  imports:[RouterModule.forRoot(appRoute,{ useHash: true })],
  exports:[RouterModule]
})

export class AppRouteModule{

}
