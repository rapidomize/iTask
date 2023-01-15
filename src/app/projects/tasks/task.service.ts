import { Injectable } from '@angular/core';
import { IdGen } from '../../common/common.service';

export class TaskList{
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
  des!: string; //task comment
  by!: string; //by whom
}

export class Task{
  id:string = IdGen.strId();
  name:string = '';
  des:string = '';
  labels!:Label [];
  attachments!:any [];
  comments!:Comment [];
  status!:string;

  constructor(name:string, status:string){
    this.name = name;
    this.status = status;
  }
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor() { }
}
