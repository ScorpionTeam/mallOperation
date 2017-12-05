import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
@Component({
  selector:'hk-editor',
  template:`<ckeditor
    [(ngModel)]="ckeditorContent"
    [config]="config"
    [readonly]="false"
    (change)="changeHandler()"
    debounce="500">
  </ckeditor>`
})

export class HKeditor implements OnInit{
  @Input() ckeditorContent:any;
  @Output() change = new EventEmitter();
  toobarConfig:any=[
    { name: 'document', items : [ 'Source','-','NewPage','DocProps','Preview','Print','-','Templates' ] },
    { name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
    { name: 'editing', items : [ 'Find','Replace','-','SelectAll','-','SpellChecker', 'Scayt' ] },
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
  config:any={
    uiColor:"#f1f1f1",
    toobar:'full',
    toobar_full:this.toobarConfig,
    toolbarCanCollapse:true,
    extraPlugins: 'divarea'
  };
  constructor(){
  }

  ngOnInit(){}

  changeHandler(){
    this.change.emit(this.ckeditorContent);
  }
}
