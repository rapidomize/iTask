import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonComponent, Alert, ChipSelectComponent, Drawer, ItemList, ChipsComponent, EditableDivComponent, DialogComponent, FileSelectComponent } from './common.component';
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
  FileSelectComponent
]

@NgModule({
  declarations: RPZ_COMMON_COM,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot()
  ],
  exports: RPZ_COMMON_COM
})
export class RpzCommonModule { }
