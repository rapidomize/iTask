import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { RpzCommonModule } from '../common/rpz-common.module';
import { TasksComponent } from './tasks/tasks.component';
import { ManageProjectComponent } from './manage-project/manage-project.component';
import { QUIL_MODULES } from '../app.module';


@NgModule({
  declarations: [
    ProjectsComponent,
    TasksComponent,
    ManageProjectComponent
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RpzCommonModule,

    QuillModule.forRoot()
  ]
})
export class ProjectsModule { }
