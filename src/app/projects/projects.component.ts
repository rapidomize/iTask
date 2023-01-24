import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonComponent, DialogComponent, Drawer } from '../common/common.component';
import { Context } from '../common/context.service';
import { HttpService } from '../common/http.service';
import { Project, PROJECTS_EP } from './project';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent extends CommonComponent implements OnInit {

  @ViewChild('drawer') drawer!: Drawer;
  @ViewChild('dialog') dialog!: DialogComponent;
  projects!:Project [];
  project!:Project;
  filterValue!:string;

  headers: string [] = ['Name', 'Description', 'Created', 'Updated'];
  table: boolean = false;

  constructor(protected override ctx: Context, protected http: HttpClient, protected override router: Router) {
    super(ctx, router);
    this.service = new HttpService<Project>(http, PROJECTS_EP);
    this.path = '/projects/mgt';
  }

  /* get projects():Observable<Project []> {
    return this.service.find();
  } */

  ngOnInit(): void {
    this.service.find().subscribe({
        next: (projects: Project []) => {
          this.projects = projects;
          //console.log(icapps);
        },
        error: error => console.log(error)
    });
  }

  override edit(ev:any, item:any){
    console.log('edit');
    
    ev.stopPropagation();
    this.router.navigate(['/projects', item.id, 'tasks']);
  }

  settings(ev:any, project:Project){
    ev.stopPropagation();
    this.project = project;
    if(project)
        this.drawer.open();  
  }

  override remove(ev:any, item:any){
    this.dialog.show(DialogComponent.QUESTION, `Delete Project '${item.name}'?`, item);
    this.dialog.onClose().subscribe(ret => {
      if(ret){
        this.service.delete(item.id, undefined, 'cascade=true').subscribe({
          next: (ret: any) => {
            console.log(ret);
            const idx = this.projects.findIndex(prj => prj.id == item.id);
            this.projects.splice(idx, 1);
          },
          error: (error:any) => console.log(error)
        });    
      }
    });
  }

  update(ev:any){
    if(ev.stopPropagation) ev.stopPropagation();
    console.log('update');
    this.service.update(this.project).subscribe(project => {
      console.log(project);          
      this.project = project; 
    })
  }

  /* saveOrUpdate(ev:any, project: Project){
    if(ev.stopPropagation) ev.stopPropagation();
    if(!project.state){
      console.log('create');
      this.service.create(project).subscribe(ret => {
        console.log(ret);       
        this.ctx.put(project);
        this.router.navigate(['/projects', project.id, 'tasks']);   
      })
    }else{
      console.log('update');
      this.service.update(project).subscribe(ret => {
        console.log(ret);          
        this.ctx.put(project);
        this.router.navigate(['/projects', project.id, 'tasks']);
      })
    }
  } */
}
