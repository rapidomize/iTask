import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Context } from 'src/app/common/common.service';
import { Project, ProjectService } from '../projects.service';

@Component({
  selector: 'app-manage-project',
  templateUrl: './manage-project.component.html',
  styleUrls: ['./manage-project.component.css']
})
export class ManageProjectComponent implements OnInit {

  project!: Project | undefined;
  
  constructor(private ctx: Context, private router: Router,
              private route: ActivatedRoute, 
              private prjService: ProjectService) {

  }

  ngOnInit(): void {
    let id = this.route.snapshot.params['id'];
    if(id){ 
      this.prjService.read(id).subscribe({
          next: (project: Project) => {
            this.project = project;
            console.log(project);
          },
          error: error => console.log(error)
      });
    }else{
      this.project = new Project();
    }
  }

  cancel(ev: any){
    ev.stopPropagation();
    this.router.navigate(['/projects']);
  }

  manage(ev:any){
    ev.stopPropagation();
    if(this.project){
      this.ctx.put(this.project);
      this.router.navigate(['/projects', this.project.id, 'tasks']);
    }
  }

}
