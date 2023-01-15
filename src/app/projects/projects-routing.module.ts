import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageProjectComponent } from './manage-project/manage-project.component';
import { ProjectsComponent } from './projects.component';
import { TasksComponent } from './tasks/tasks.component';

const routes: Routes = [
  { path: '', component: ProjectsComponent },
  { path: 'project', component: ManageProjectComponent  },
  { path: ':id', component: ManageProjectComponent  },
  { path: ':id/tasks', component: TasksComponent  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
