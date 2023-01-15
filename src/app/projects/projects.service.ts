import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IdGen } from '../common/common.service';
import { HttpService } from '../common/http.service';

const PROJECTS_EP = environment.api+"/icapp"

export class Project{
  id = IdGen.uuid();
  ver!: number;
  name!: string;
  des!: string;
  state!: string;
  created!: string;
  updated!: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  static projects: Project [];
  prjRestSvc: HttpService<Project>;

  constructor(protected http: HttpClient) { 
    this.prjRestSvc = new HttpService(http, PROJECTS_EP);
  }

  ///Rest
  find(): Observable<Project[]> {
    console.log('getProjects')
    if(ProjectService.projects?.length > 0) {
      console.log(ProjectService.projects);
      return of(ProjectService.projects);
    }
    return this.prjRestSvc.find()
      .pipe(
        tap({
            next: (icapps: Project []) => {
              ProjectService.projects = icapps;
              console.log(icapps);
            },
            error: error => console.log(error)
        })
      );
  }

  read(id: string): Observable<Project> {
    if(ProjectService.projects?.length > 0) {
      console.log('size', ProjectService.projects.length)
      let icapp = ProjectService.projects.find(elm => elm.id = id);
      if(icapp) return of(icapp);
    }
    return this.prjRestSvc.read(id);
  }

  delete(id: string): Observable<any> {
    if(ProjectService.projects?.length > 0) {
      console.log('size', ProjectService.projects.length)
      let idx = ProjectService.projects.findIndex(elm => elm.id = id);
      if(idx < 0) throw `Invalid Project`;
      ProjectService.projects.splice(idx, 1);
    }
    return this.prjRestSvc.delete(id);
  }
}
