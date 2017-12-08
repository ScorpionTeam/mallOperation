import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoginComponent} from "../componet/login/Login.component";
import {AppRouteModule} from "../router/main";
import {IndexComponent} from "../componet/index/Index.component";
import {GoodComponent} from "../componet/good/gooddetail/Good.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgZorroAntdModule, NZ_MESSAGE_CONFIG} from 'ng-zorro-antd';
import {GoodListComponent} from "../componet/good/goodlist/GoodList.component";
import {PageService} from "../service/page/Page.service";
import {HttpClientModule} from "@angular/common/http";
import {OrderComponent} from "../componet/order/orderdetail/Order.component";
import {OrderListComponent} from "../componet/order/orderlist/OrderList.component";
import {HttpData} from "../http/HttpData";
import {UserListComponent} from "../componet/user/userlist/UserList.component";
import {UserComponent} from "../componet/user/userdetail/User.component";
import {Http} from "../common/http/Http";
import {DataTool} from "../common/data/DataTool";
import {ActivityListComponent} from "../componet/active/list/ActivityList.component";
import {ActivityComponent} from "../componet/active/detail/Activity.component";
import {BrandListComponent} from "../componet/brand/list/BrandList.component";
import {BrandDetailComponent} from "../componet/brand/detail/Brand.component";
import {ImgUpload} from "../common/imgupload/ImgUpload";
import { CKEditorModule } from 'ng2-ckeditor';
import {HKeditor} from "../common/editor/editor";
import {TicketListComponent} from "../componet/ticket/list/TicketList.component";
import {TicketComponent} from "../componet/ticket/detail/Ticket.component";
import {Interceptor} from "../common/interceptor/interceptor";
import {ConcatGoodComponent} from "../componet/active/withgood/ConcatGood.component";
import {OutGoodComponent} from "../componet/active/outgood/OutGood.component";
import {MenuListComponent} from "../componet/system/menu/list/MenuList.component";
import {RouteGuard} from "../service/guard/RouteGuard";
import {AdvertisementListComonent} from "../componet/advertisement/list/AdvertisementList.component";
import {AdvertisementComponent} from "../componet/advertisement/detail/Advertisement.component";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import { PersonalComponent} from "../componet/user/person/PersonDetail.component";
import {RouterTool} from "../common/routertool/RouterTool";
import {MenuComponent} from "../componet/system/menu/detail/Menu.component";
import {StoreModule} from "@ngrx/store";
import {reducer}from"../state/reducer/index/StateApplaction"
import {CategoryListComponent} from "../componet/category/list/CategoryList.component";
import {CategoryComponent} from "../componet/category/detail/Category.component";
import {TimePick} from "../common/data/TimePick";
import {RoleListComponent} from "../componet/system/role/list/RoleList.component";
import {RoleComponent} from "../componet/system/role/detail/Role.component";
import {CheckBoxGroup} from "../common/checkbox/CheckBoxGroup";
import {PictureListComponent} from "../componet/picture/list/PictureList.component";
import {HMenu} from "../common/menu/HMenu";
@NgModule({
  declarations: [
    HMenu,
    HKeditor,
    ImgUpload,
    CheckBoxGroup,
    AppComponent,
    LoginComponent,
    IndexComponent,
    GoodComponent,
    GoodListComponent,
    OrderComponent,
    OrderListComponent,
    UserListComponent,
    UserComponent,
    ActivityListComponent,
    ActivityComponent,
    ConcatGoodComponent,
    OutGoodComponent,
    BrandListComponent,
    BrandDetailComponent,
    TicketListComponent,
    TicketComponent,
    MenuListComponent,
    MenuComponent,
    AdvertisementListComonent,
    AdvertisementComponent,
    PersonalComponent,
    CategoryListComponent,
    CategoryComponent,
    RoleListComponent,
    RoleComponent,
    PictureListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRouteModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot(),
    StoreModule.forRoot({
      loadFlag:reducer
    }),
    CKEditorModule
  ],
  providers: [PageService,
               HttpData,
               Http,
               RouteGuard,
               RouterTool,
              Interceptor,
               DataTool,
              TimePick,
              { provide: NZ_MESSAGE_CONFIG, useValue: { nzMaxStack:1 }} ],
  bootstrap: [AppComponent]
})
export class AppModule { }
