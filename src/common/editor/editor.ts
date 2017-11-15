import {Component} from "@angular/core";
@Component({
  selector:'editor',
  template:`<ckeditor
    [(ngModel)]="ckeditorContent"
    [config]="config"
    [readonly]="false"
    debounce="500">
  </ckeditor>`
})

export class HKeditor{
  ckeditorContent:any;
  config:any={
    uiColor:"#f1f1f1",
    toobar:"Hk",
    toobar_Hk:this.toobarConfig
  };
  toobarConfig:any=[
    { name: 'document', items : [ 'Source','-','Save','NewPage','DocProps','Preview','-','Templates' ] },
    { name: 'clipboard', items : [ '-','Undo','Redo' ] },
    { name: 'forms', items : [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton',
      'HiddenField' ] },
    '/',
    { name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
    { name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv',
      '-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ] },
    { name: 'links', items : [ 'Link','Unlink','Anchor' ] },
    { name: 'insert', items : [ 'Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak','Iframe' ] },
    '/',
    { name: 'styles', items : [ 'Styles','Format','Font','FontSize' ] },
    { name: 'colors', items : [ 'TextColor','BGColor' ] },
    { name: 'tools', items : [ 'Maximize', 'ShowBlocks' ] }
  ];
  constructor(){

  }
}
