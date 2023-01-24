import { environment } from 'src/environments/environment';
import { IdGen } from '../common/common.service';

export const PROJECTS_EP = environment.api+"/prj"
export const TASK_EP = environment.api+"/prj"
export let LST_CNT: number=3;

export class Status{
  id:string = IdGen.strId();
  name!:string;
  constructor(name:string){
    this.name = name;
  }
}

export class Label{
  name!:string;
  color!:string;
  constructor(name:string, color:string){
    this.name = name;
    this.color = color;
  }
}

export class Comment{
  id:string = IdGen.strId();
  des!: string; //task comment
  by!: string;  //by whom
  constructor(des:string, by:string){
    this.des = des;
    this.by = by;
  }
}

export class Task{
  id:string = IdGen.strId();
  name:string = '';
  des:string = '';
  labels!: Label [];
  attachments!:any [];
  comments!:Comment [];
  status:string;   //id
  project!:string;  //id
  state!: string;   //lifecycle
  created!: string;
  updated!: string;

  constructor(name:string, status:string, project:string){
    this.name = name;
    this.status = status;
    this.project = project;
  }
}

export class Project{
  id = IdGen.uuid();
  ver!: number;
  name!: string;
  des!: string;
  statuses: Status [] = [
    {id: '1', name:'To Do'},
    {id: '2', name:'In Progress'},
    {id: '3', name:'Done'}
  ];
  labels: Label [] = [
    {name: 'bug', color:'green'}, 
    {name: 'enhancement', color:'#a2eeef'}, 
    {name: 'duplicate', color:'#cfd3d7'}, 
    {name: 'documentation', color:'#0075ca'}, 
    {name: 'question', color:'#d876e3'}, 
    {name: 'invalid', color:'#e4e669'},
    {name: 'wontfix', color:'#f1f1f1'}
  ];
  state!: string; //lifecycle
  created!: string;
  updated!: string;
}
