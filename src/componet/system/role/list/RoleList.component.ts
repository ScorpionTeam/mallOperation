import {Component, OnInit} from "@angular/core";
import {RoleService} from "../../../../service/role/Role.service";
import {RouterTool} from "../../../../common/routertool/RouterTool";
import {ActivatedRoute} from "@angular/router";
import {NzModalService, NzMessageService} from "ng-zorro-antd";
import {DataTool} from "../../../../common/data/DataTool";
import {MenuService} from "../../../../service/menu/Menu.service";
import {it} from "selenium-webdriver/testing";
@Component({
  selector: 'role-list',
  templateUrl: 'RoleList.component.html',
  styleUrls: ['RoleList.component.css'],
  providers: [RoleService, MenuService]
})

export class RoleListComponent implements OnInit {
  constructor(private roleService: RoleService, private routerTool: RouterTool, private dataTool: DataTool,
              private route: ActivatedRoute, private nzModal: NzModalService, private menuService: MenuService,
              private nzMessage: NzMessageService) {
  }
  
  ngOnInit() {
    this.pageChangeHandler(1);
    this.getMenuList();
  }
  
  roleList: any = [];//角色列表
  page: any = {
    pageNo: 1,
    pageSize: 10,
    total: 0
  };
  searchKey: string; //关键字
  menuList: any = []; //菜单列表
  menuIdList: any = [];
  
  /**
   * 跳转
   * @param url
   * @param val
   */
  skipToPage(url: string, val?: any) {
    this.routerTool.skipToPage(url, this.route, val);
  }
  
  /**
   * 改变页码
   * @param val
   */
  pageChangeHandler(val: any) {
    this.page.pageNo = val;
    this.roleService.pageList(this.page.pageNo, this.page.pageSize, {searchKey: this.searchKey}).subscribe(
      res=> {
        this.roleList = res["list"];
        this.page.total = res["total"];
      }
    )
  }
  
  /**
   * 改变每页展现条数
   * @param val
   */
  pageSizeChangeHandler(val: any) {
    this.page.pageSize = val;
    this.roleService.pageList(this.page.pageNo, this.page.pageSize, {searchKey: this.searchKey}).subscribe(
      res=> {
        this.roleList = res["list"];
        this.page.total = res["total"];
      }
    )
  }
  
  /**
   * 搜索
   */
  search() {
    this.page.pageNo = 1;
    this.roleService.pageList(this.page.pageNo, this.page.pageSize, {searchKey: this.searchKey}).subscribe(
      res=> {
        this.roleList = res["list"];
        this.page.total = res["total"];
      }
    )
  }
  
  /**
   * 根据Id删除
   * @param id
   */
  delConfirm(id: number) {
    this.nzModal.warning({
      title: "提示",
      content: "确认删除?",
      onOk: ()=> {
        this.delById(id);
      }
    })
  }
  
  delById(id: number) {
    this.roleService.delRoleById(id).subscribe(
      res=> {
        if (res["result"] == 1) {
          this.nzModal.success({
            content: "删除成功"
          });
        } else {
          this.nzModal.error(res["error"].message);
        }
      }
    );
  }
  
  /**
   * 打开模态
   * @param id
   * @param body
   */
  openModal(id: number, body: any) {
    this.nzModal.confirm({
      title: "分配权限",
      content: body,
      maskClosable: false,
      onOk: ()=> {
        this.roleService.assignMenuToRole(id, this.menuIdList).subscribe(
          res=> {
            if (res["result"] == 1) {
              this.nzMessage.success("分配成功");
            }
          }
        );
      }
    });
  }
  
  /**
   * 获取菜单列表
   */
  getMenuList() {
    this.menuService.getAllMenuList().subscribe(
      res=> {
        this.menuList = res["data"];
        this.menuList.forEach(
          (item: any)=> {
            item.leaf.forEach(
              (subItem:any)=> {
                subItem.checked = false;
              }
            )
          });
      }
    )
  }
  
  /**
   * 获取菜单IdList
   */
  getMenuIdList(idList: any) {
    let arry: number[] = [];
    this.menuList.forEach(
      (item:any)=> {
        item.leaf.forEach(
          (subItem:any)=> {
            if (subItem.checked) {
              arry.push(subItem.id);
            }
          }
        )
      }
    );
    this.menuIdList = arry;
  }
  
  /**
   * 初始化角色权限
   * @param id:角色id
   */
  initRoleMenu(id: number, body: any) {
    this.roleService.findMenuListByRoleId(id).subscribe(
      res=> {
        let curIdList:any = [];
        res["data"].forEach(
          (item:any)=> {
            curIdList = curIdList.concat(item.leaf.map(
              (subItem:any)=> {
                return subItem.id;
              }
            ));
          });
        this.menuList.forEach(
          (item:any)=> {
            item.leaf.forEach(
              (subItem:any)=> {
                if (curIdList.includes(subItem.id)) {
                  subItem.checked = true;
                } else {
                  subItem.checked = false;
                }
              }
            )
          });
        this.openModal(id, body);
      }
    );
  }
}
