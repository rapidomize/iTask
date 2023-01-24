import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonComponent, ErrMsg } from 'src/app/common/common.component';
import { Context } from 'src/app/common/context.service';
import { HttpService } from 'src/app/common/http.service';
import { Project, PROJECTS_EP} from '../project';

@Component({
  selector: 'app-manage-project',
  templateUrl: './manage-project.component.html',
  styleUrls: ['./manage-project.component.css']
})
export class ManageProjectComponent extends CommonComponent  implements OnInit {

  project!: Project;
  newEntity = false;
  
  constructor(protected override ctx: Context, protected http: HttpClient, protected override router: Router,
              private route: ActivatedRoute) {
    super(ctx, router);
    this.service = new HttpService<Project>(http, PROJECTS_EP);
    this.path = '/projects/mgt';
  }

  ngOnInit(): void {
    let id = this.route.snapshot.params['id'];
    if(id){ 
      this.service.read(id).subscribe({
          next: (project: Project) => {
            this.project = project;
            console.log(project);
          },
          error: error => console.log(error)
      });
    }else{
      this.project = new Project();
      this.newEntity = true;
    }
  }

  cancel(ev: any){
    ev.stopPropagation();
    this.router.navigate(['/projects']);
  }

  manage(ev:any){
    ev.stopPropagation();
    if(this.project){
      if(!this.project.state){
        console.log('create');
        this.service.create(this.project).subscribe(ret => {
          console.log(ret);       
          this.ctx.put(this.project);
          this.router.navigate(['/projects', this.project.id, 'tasks']);   
        })
      }else{
        console.log('update');
        this.service.update(this.project).subscribe(ret => {
          console.log(ret);          
          this.ctx.put(this.project);
          this.router.navigate(['/projects', this.project.id, 'tasks']);
        })
      }
      
    }
  }

  hasErrors(ref: any){
    return ErrMsg.hasErrors(ref);
  }

}
