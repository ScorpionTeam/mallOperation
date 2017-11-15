import {Component, Input, Output, EventEmitter} from "@angular/core";
@Component({
  selector:'hk-editor',
  template:`<ckeditor
    [(ngModel)]="ckeditorContent"
    [config]="config"
    [readonly]="false"
    (blur)="blurHandler()"
    debounce="500">
  </ckeditor>`
})

export class HKeditor{
  @Input() ckeditorContent:any;
  @Output() blur = new EventEmitter();
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
    toolbarCanCollapse:true
  };
  constructor(){
  }

  blurHandler(){
    this.blur.emit(this.ckeditorContent);
  }
}
