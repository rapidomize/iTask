import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonComponent } from '../common/common.component';
import { Context } from '../common/common.service';
import { Project, ProjectService } from './projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent extends CommonComponent implements OnInit {

  projects!:Project [];
  filterValue!:string;
  
  constructor(protected override ctx: Context, protected override router: Router, 
              private prjService: ProjectService) {
    super(ctx, router);
    this.service = prjService;
    this.path = '/projects/project';
  }

  override ngOnInit(): void {
    this.prjService.find().subscribe({
        next: (projects: Project []) => {
          this.projects = projects;
          //console.log(icapps);
        },
        error: error => console.log(error)
    });
  }
}
