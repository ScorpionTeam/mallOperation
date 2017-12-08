import {Component, Input} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
@Component({
  selector:'h-menu',
  templateUrl:'HMenu.html',
  styleUrls:['HMenu.css']
})

export class HMenu{
  @Input() dataList:any[];
  constructor(private router:Router,private route:ActivatedRoute){}

  /**
   * 选一级菜单
   * @param index
   */
  selectMenu(index:number){
    let el = document.getElementsByClassName("menu_item");
    if(el[index].className.indexOf("menu_item_open")!=-1){
      el[index].className=el[index].className.replace('menu_item_open', 'menu_item_close');
    }else{
      for(let i =0;i<el.length;i++){
        if(i==index){
          el[i].className =el[i].className.replace('menu_item_close','menu_item_open');
        }else {
          el[i].className = el[i].className.replace('menu_item_open','menu_item_close');
        }
      }
    }
  }

  /**
   * 选取二级菜单
   */
  selectSubMenu(event:any,url:string){
    //partOne:样式控制
    let el = event.srcElement;
    let nowVal = el.parentElement.previousElementSibling.className;
    let allSubEl=document.getElementsByClassName("sub_menu_item");
    let allParEl = document.getElementsByClassName("menu_item_warp");
    console.log(nowVal);
    //给所有子目录去除样式
    for(let i =0;i<allSubEl.length;i++){
      allSubEl[i].className = allSubEl[i].className.replace("sub_menu_item_selected","");
    }
    //给当前选中的加上sub_menu_item_selected
    el.className+= " sub_menu_item_selected";

    //给所有一级目录去除样式
    for(let i =0;i<allParEl.length;i++){
      allParEl[i].className = allParEl[i].className.replace("menu_item_selected","");
    }
    //判断是否已经存在menu_item_selected样式
      el.parentElement.previousElementSibling.className+=" menu_item_selected";
    //partTwo:路由跳转
    this.router.navigate([url],{relativeTo:this.route});
  }


}
