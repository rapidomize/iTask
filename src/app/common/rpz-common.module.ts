import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonComponent, Alert, ChipSelectComponent, Drawer, ItemList, ChipsComponent, EditableDivComponent, DialogComponent, FileSelectComponent, ErrMsg } from './common.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

const RPZ_COMMON_COM=[
  CommonComponent,
  Alert,
  Drawer,
  ItemList,
  ChipsComponent,
  ChipSelectComponent,
  EditableDivComponent,
  DialogComponent,
  FileSelectComponent,
  ErrMsg
]

@NgModule({
  declarations: RPZ_COMMON_COM,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule
  ],
  exports: RPZ_COMMON_COM
})
export class RpzCommonModule { }
