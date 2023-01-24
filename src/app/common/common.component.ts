import { Component, Directive, ElementRef, EventEmitter, Injectable, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { QUILL_MODULES } from '../app.module';
import { Context } from './context.service';
import { HttpService } from './http.service';
import Quill from 'quill'
/* import ImageResize from 'quill-image-resize-module';
Quill.register('modules/imageResize', ImageResize) */


@Directive({
  selector: '[]'
})
export class CommonComponent {

  alert = new Alert();
  protected path!: string;
  protected service!: HttpService<any>;

  constructor(protected ctx: Context, protected router: Router) { }

  /* cancel(ev: any){
    ev.stopPropagation();
    if(this.path)
      this.router.navigate([`${this.path}s`]); //just the path without 's'
  }
 */
  //used with list components
  create(ev: any){
    ev.stopPropagation();
    if(this.path)
      this.router.navigate([this.path]); //just the path without 's'
  }

  edit(ev:any, item:any){
    ev.stopPropagation();
    if(this.path)
      this.router.navigate([this.path, item.id]);
  }

  remove(ev:any, item:any){
    if(this.service){
      this.service.delete(item.id, undefined, 'cascade=true').subscribe({
        next: (ret: any) => {
          console.log(ret);
        },
        error: (error:any) => console.log(error)
      })    
    }
  }
  //end - used with list components

  fvs(obj: any, headers:any[]){
    let fv: any [] = [];
    for(let i=0; i < headers.length; i++){
      fv.push(obj[headers[i].toLowerCase()])
    }
    return fv;
  }
}

const SUCCESS='success';
const WARN='warn';
const INFO='info';
const ERR='err';

@Component({
  selector: 'alert',
  template: `
    <div *ngFor="let alert of alerts" [ngClass]="['alert', alert.status]" role="alert"> <!-- [ngClass]="{cssClass: 'alert '+alert.status}" -->
      {{alert.msg}}
    </div>
  `,
  styleUrls: ['./common.component.css']
})
export class Alert {

  alerts:any [] = [];

  success(msg:string){
    this.show(msg, SUCCESS);
  }

  warn(msg:string){
    this.show(msg, WARN);
  }

  info(msg:string){
    this.show(msg, INFO);
  }

  err(msg:string){
    this.show(msg, ERR);
  }
  
  show(msg:string, status:string){
    this.alerts.push({msg: msg, status:status});
    const idx = this.alerts.length;//??
    console.log('idx: ', idx);
    //setInterval
    setTimeout(() =>{ this.alerts.splice(idx, 1) }, 1200);
  }
}



@Component({
  selector: 'drawer',
  template: `
    <div class="drawer" [ngStyle]="navStyle"><ng-content></ng-content></div>
  `,
  styleUrls: ['./common.component.css']
})
export class Drawer {
  @Input() min:any = '50%';
  @Input() max:any = '60%';

  ZERO_SZ = {'min-width':'0px', 'max-width':'0px', padding: '0px'};
  FULL_SZ = {'min-width': this.min, 'max-width': this.max, padding: '10px'};

  navStyle = this.ZERO_SZ;

  constructor(){
  }

  toggle(){
    this.navStyle = !this.isOpened()? this.FULL_SZ : this.ZERO_SZ; //{visibility: 'visible'} 
  }

  open(){
    this.navStyle = this.FULL_SZ;  //{visibility: 'visible'}
  }

  close(){
    this.navStyle = this.ZERO_SZ;  //{visibility: 'hidden'}
  }

  isOpened(){
    return this.navStyle && this.navStyle['min-width'] != '0px';
  }
}


@Component({
  selector: 'item-list',
  template: `
    <div class="col brd p-10">
        <div class="row">
            <span class="fx-g px-5"></span> 
            <button type="button" (click)="addOne()" class="btn-medium rounded">
                <span class="material-icons">add</span>
            </button> 
        </div>
        <div *ngFor="let item of items;let i=index;" (item)="item" class="row-res py-5 grd g-5x">
            <ng-content></ng-content>
            <button type="button" (click)="clsOne(i)" class="btn-medium rounded fx-g"><span class="material-icons">delete</span></button>
        </div>
      </div>
  `,
  styleUrls: ['./common.component.css']
})
export class ItemList {
  @Input() items!: any [];
  @Output() item!: any;
  dirty: boolean = false;

  /* constructor(){
    console.log(this.items.length);
  } */

  addOne() {
    if(this.items.length > 0){
      this.items[0]
      this.items.push({});
      this.dirty = true;
    }
  }

  rmOne(idx: number) {
    this.items.splice(idx, 1);
    this.dirty = true;
  }

  clsOne(idx: number){
    if(this.items.length > 1){
      return this.rmOne(idx);
    }else
      this.items.splice(0, 1, {});
  }

  onEvent(ev:any){
    console.info('onEvent', ev.node);
  }
}

@Component({
  selector: 'chips',
  template: `
  <div class="row fx-wrap">
      <div *ngFor="let chip of chips" class="chip py-0 pl-10 mr-2 mb-1" [ngClass]="allowRemove?'pr-5':'pr-10'" 
            [ngStyle]="{'background-color': chip.color?chip.color:'var(--rpz-gray-400)'}">
        {{name(chip)}}
        <span *ngIf="allowRemove" (click)="rm(chip)" class="btn-icon fnt material-icons ml-1">clear</span>
      </div>
  </div>
  `,
  styleUrls: ['./common.component.css']
})
export class ChipsComponent {
  @Input() chips!: any [];
  @Input() allowRemove: boolean = false;
  @Output() onRemove = new EventEmitter<any>(); 


  value(item: any){
    return item.value?item.value:item.name?item.name:item;
  }

  name(item: any){
    // console.log('chips',item);
    return item.name?item.name:item.value?item.value:item;
  }

  rm(ev:any){
    this.onRemove.emit(ev);
  }
}

@Component({
  selector: 'chip-select',
  template: `
  <div class="chips">
      <chips [chips]="chips" [allowRemove]="true" (onRemove)="rm($event)"></chips>
      <div class="dropdown">
        <span class="btn-icon material-icons primary">settings</span>
        <div class="dropdown-content p-3 bg-gray">
            <div *ngFor="let item of list" (click)="add(item)" class="brdr-2 py-0 px-10 mb-3" 
              [ngStyle]="{'background-color': item.color}">{{name(item)}}</div>
        </div>
      </div>
  </div>
  `,
  styleUrls: ['./common.component.css']
})
export class ChipSelectComponent implements OnInit, OnChanges {
  @Input() chips!: any [];
  @Output() chipsChange = new EventEmitter<any>(); 
  @Input() items!: any [];

  list!: any [];

  ngOnInit(): void {
    this.setLst();
  }

  ngOnChanges(changes: SimpleChanges): void { 
    this.setLst();    
  }

  setLst(){
    if(this.chips)
      this.list = this.items.filter(elm => this.chips.find(ch => ch.name == elm.name) == undefined);
    else this.list = this.items
  }

  add(ev:any){
    console.log('add', ev);    
    if(!this.chips) this.chips = [];
    const idx = this.list.indexOf(ev);
    this.list.splice(idx, 1);
    this.chips.push(ev);
    this.chipsChange.emit(this.chips);
  }

  rm(ev:any){
    const idx = this.chips.indexOf(ev);
    this.chips.splice(idx, 1);
    this.list.push(ev);
    this.chipsChange.emit(this.chips);
  }

  value(item: any){
    return item.value?item.value:item.name?item.name:item;
  }

  name(item: any){
    return item.name?item.name:item.name?item.name:item;
  }
}

@Component({
  selector: 'file-select',
  template: `
  <div class="chips white">
      <chips [chips]="files" [allowRemove]="true" (onRemove)="rm($event)"></chips>
      <input #dialog type="file" style="display: none;" (change)="attach()" name="attachements">
      <span class="btn-icon material-icons primary" (click)="open()">attach_file</span>
  </div>
  `,
  styleUrls: ['./common.component.css']
})
export class FileSelectComponent {
  @Input() files!: any [];
  @Output() filesChange = new EventEmitter<any>(); 
  @ViewChild('dialog') dialog!: ElementRef<HTMLInputElement>;  

  open(){
    this.dialog.nativeElement.click();  
  }

  attach(){
    console.log('attach', this.dialog.nativeElement.files);    
    if(!this.files) this.files = [];
    const len = this.dialog.nativeElement.files?.length || 0;
    for(let i=0; i< len; i++){
      let f = this.dialog.nativeElement.files?.item(i);
      if(f) this.files.push({name: f.name, size:f.size});
    }
    console.log('attach', this.files);
    
    this.filesChange.emit(this.files);
  }

  rm(ev:any){
    const idx = this.files.indexOf(ev);
    this.files.splice(idx, 1);
    this.filesChange.emit(this.files);
  }
}

// data?cssClass:'hint '+cssClass
/* <div *ngIf="!isEditable() && type=='editor'" [innerHtml]="data?data: '&nbsp;'" (dblclick)="enableEdit($event)" class="editable of-h" [ngClass]="cssClass"></div> --> */

@Component({
  selector: 'ediv',
  template: `
  <div  *ngIf="!isEditable() && type!='editor'" (dblclick)="enableEdit($event)" class="editable py-3 px-5 of-h" 
      [ngClass]="cssClass">{{data?data: placeholder}}&nbsp;</div>
  <input *ngIf="isEditable() && type=='input'" type="text" [ngModel]="data" (blur)="edit($event)" name="data">
  <textarea *ngIf="isEditable() && type=='textarea'" type="text" [ngModel]="data" (blur)="edit($event)" name="data" class="of-h"></textarea>
  <quill-view *ngIf="!isEditable() && type=='editor'" [content]="data" (dblclick)="enableEdit($event)" class="editable brdr" 
      [ngClass]="cssClass"></quill-view>
  <quill-editor *ngIf="isEditable() && type=='editor'" [(ngModel)]="data" (onBlur)="!toolbar && editEx($event)" 
      [sanitize]="true" [modules]="toolbar?qmodules:noqmodules" name="data"></quill-editor>
  <div *ngIf="isEditable() && btn" class="row">
    <span  (click)="editEx($event)" class="btn-icon material-icons primary mr-3">save</span>
    <span (click)="disableEdit($event)" *ngIf="isEditable()" class="btn-icon material-icons primary">close</span>
  </div>
  `,
  styleUrls: ['./common.component.css']
})
export class EditableDivComponent implements OnInit, OnChanges {

  @Input() data!: string;
  @Output() dataChange = new EventEmitter<any>(); 
  @Input() type: string = 'input';  
  @Input() toolbar: boolean = true;  
  @Input() cssClass!: string;
  @Input() placeholder!: string;
  @Input() btn!: boolean;
  @Output() onChange = new EventEmitter<any>(); 
  @Output() onEditState = new EventEmitter<any>(); 

  editable = false;
  qmodules = QUILL_MODULES;
  noqmodules = {toolbar: false};

  basic_modules = {
    imageResize: {},
    syntax: true,
    toolbar: [['formula'], ['image'], ['code-block']]
  }

  ngOnInit(): void {
    // if(!this.placeholder) this.placeholder = this.type == 'editor'? '': ''; 
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('data', this.data, changes);
  }

  
  isEditable(){
    return this.editable;
  }

  enableEdit(ev: MouseEvent){
    console.log('enableEdit');
    if(ev.preventDefault) ev.preventDefault();
    if(ev.stopPropagation) ev.stopPropagation();
    this.editable = true;
    this.onEditState.emit(this.editable);
  }

  disableEdit(ev: MouseEvent){
    console.log('disableEdit');
    if(ev.preventDefault) ev.preventDefault();
    if(ev.stopPropagation) ev.stopPropagation();
    this.editable = false;
    this.onEditState.emit(this.editable);
  }

  edit(ev:any){
    console.log('edit', ev, ev.target.value);
    if(ev.preventDefault) ev.preventDefault();
    if(ev.stopPropagation) ev.stopPropagation();
    this.disableEdit(ev);
    this.onChange.emit({value: ev.target.value, old: this.data});
    // this.data = ev.target.value;
    this.dataChange.emit(ev.target.value);
  }

  editEx(ev:any){
    let editor = (<Quill>ev.editor);
    /* console.log('edit', ev);
    console.log('edit-getContents', editor.getContents());
    console.log('edit-getLines', editor.getLines());
    console.log('edit-getText', editor.getText()); */
    if(ev.preventDefault) ev.preventDefault();
    if(ev.stopPropagation) ev.stopPropagation();
    this.disableEdit(ev);
    this.dataChange.emit(this.data);
    this.onChange.emit({value: this.data, old: this.data});
    //this.data = ev.editor.editor.delta.ops[0].insert;
  }
}

@Component({
  selector: 'adialog',
  template: `
  <dialog #dialog class="brdr" style="min-width:300px;min-height: 100px; border:0">
    <div class="row">
      <span class="material-icons mr-10">{{type}}</span>
      {{msg}}
    </div>
    <ng-content></ng-content>
  </dialog>
  `,
  styleUrls: ['./common.component.css']
})
export class DialogComponent {
  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;
  msg!: string;
  type!: string;
  data: any;
  status: any;
  subscriber: any;

  public static WARN="warning";
  public static INFO="info";
  public static QUESTION="help";

  show(type:string, msg: string, data: any){
    this.msg = msg;
    this.type = type;
    this.status = false;
    this.data = data;
    this.dialog.nativeElement.showModal();
  }

  cancel(){
    this.dialog.nativeElement.close();
    this.subscriber.next(this.status);
    this.subscriber.complete();
  }
  
  done(status: any){
    this.status = status;
    this.dialog.nativeElement.close();
    this.subscriber.next(status);
    this.subscriber.complete();
  }

  onClose(): Observable<any>{
    return new Observable((subscriber) => {
      this.subscriber = subscriber;
    });
  }
}

@Component({
  selector: 'err-msg',
  template: `
    <div class="hint invalid" *ngIf="hasErrors()">{{msg}}</div>
  `,
  styleUrls: ['./common.component.css']
})
export class ErrMsg {
  @Input() ref:any;
  @Input() msg!:string;

  hasErrors(){
    return ErrMsg.hasErrors(this.ref);
  }

  static hasErrors(ref: any){
    return ref.invalid && (ref.dirty || ref.touched);
  }
}