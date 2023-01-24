import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QUILL_MODULES } from 'src/app/app.module';
import { Context } from 'src/app/common/context.service';
import { HttpService } from 'src/app/common/http.service';
import { CommonComponent, DialogComponent, Drawer } from '../../common/common.component';
import { Project, PROJECTS_EP, Task, Status, Comment, Label, TASK_EP } from '../project';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent extends CommonComponent implements OnInit {

  @ViewChild('drawer') drawer!: Drawer;
  @ViewChild('dialog') dialog!: DialogComponent;
  comment!: string;
  qmodules = QUILL_MODULES;
  
  tasks!: Task [];
  task!: Task;

  headers: string [] = ['Name', 'Description', 'Status', 'Labels/Attachments/Comments'];
  table: boolean = false;

  lcnt: number = 1;
  tcnt: number = 1;
  canDrag = true;

  project!: Project;
  prjService: HttpService<Project>

  constructor(protected override ctx: Context, protected http: HttpClient, protected override router: Router,
              private route: ActivatedRoute) {
    super(ctx, router);
    this.prjService = new HttpService<Project>(http, PROJECTS_EP);
    this.path = '/projects/mgt';
  }

  ngOnInit(): void {
    let id = this.route.snapshot.params['id'];
    console.log('id', id);    
    if(id){ 
      this.prjService.read(id).subscribe({
          next: (project: Project) => {
            this.project = project;
            console.log(project);
            this.init();
          },
          error: error => console.log(error)
      });
    }else
      console.log('error');      
  }

  init(){
    this.service = new HttpService<Task>(this.http, `${TASK_EP}/${this.project.id}/task`);//this.project.id+':task',
    this.service.find(`project=${this.project.id}`).subscribe({
        next: (tasks: Task []) => {
          console.log('init', tasks);
          this.tasks = tasks?tasks: [];
          this.lcnt = this.statuses?.length + 1;
          this.tcnt = this.tasks?.length + 1;
          this.show();
        },
        error: error => console.log(error)
    })
  }

  get statuses(){
    return this.project?.statuses;
  }
 
  get labels(){
    return this.project?.labels;
  }
  
  lstName(idx:any){
    // console.log('status', idx, this.statuses[idx]);
    return this.project?.statuses.find(status => status.id == idx)?.name;
  }

  onDrag(ev:any, tid: string){
    console.log('onDrag', tid, ev);
    if(ev.type == 'touchend' ){
      let touch = ev.touches[0] || ev.changedTouches[0];
      ev.tid = tid;
      ev.x = touch.pageX - 120;
      if(ev.x < 10) ev.x = 10;
      ev.y = touch.pageY;
    }else
      ev.dataTransfer.setData('tid', tid);
  }
  
  onDrop(ev: any) {
    console.log("onDrop", ev, ev.target.id, ev.target.className);
    if(ev.preventDefault) ev.preventDefault();
    let target: any = ev.target;
    let toTask!: Task;
    while(target.className?.indexOf('list') < 0){
      if(target.className?.indexOf('task') >= 0) toTask = target;
      target = target.parentElement;
      console.info(target);
    }
    let tolst: Status | undefined = this.statuses.find(status => status.id == target.id);
    if(!tolst) return;
    // console.info(ev);
    let tid: string;
    if(ev.type == 'touchend') 
      tid = ev.tid;
    else
      tid = ev.dataTransfer.getData('tid');
    console.log("onDrop", tid, ' => ', tolst, toTask?.id);

    let idx = this.tasks.findIndex(t => t.id == tid);
    if(idx >= 0) {
      let task = this.tasks[idx];
      if(task.status == tolst.id && toTask && toTask.id != task.id){//same list
        console.log("move", tid, task);
        this.tasks.splice(idx, 1);
        idx = this.tasks.findIndex(t => t.id == toTask?.id);
        if(idx >= 0)
          this.tasks.splice(idx, 0, task);
      }else {
        task.status = tolst.id;
        this.service.update(task).subscribe(ret => console.log(ret));
      }
    }

    for(let i=0;i<this.tasks.length; i++){
      let task = this.tasks[i];
      if(task.id == tid) {
        if(tolst.id == toTask?.status){
          console.log("move", tid, task);
          this.tasks.splice(i, 0, toTask);
        }else{
          task.status = tolst.id;
          this.service.update(task).subscribe(ret => console.log(ret));
        }
        console.log("onDrop", tid, task);
        break;
      }
    }
  }

  allowDrop(ev: any) {
    if(ev.preventDefault) ev.preventDefault();
  }

  onEditState(ev: any){
    console.log('canDrag', ev);    
    this.canDrag = !ev;
  }

  updateProject(ev:any, item: any){
    console.log('updateProject', ev, item, typeof item);
    if(ev.stopPropagation) ev.stopPropagation();
    this.prjService.update(this.project).subscribe(ret => this.show(ev));
  }

  updateTask(ev:any, task:Task){
    console.log('updateTask', ev, task);
    if(ev.stopPropagation) ev.stopPropagation();
    this.createOrUpdateTask(task);
  }

  onEditTask(ev:any, task:Task){
    this.comment = '';
    if(ev.stopPropagation) ev.stopPropagation();
    this.task = task;
    if(task)
        this.drawer.open();  
  }

  rmTask(ev:any, task:Task){
    if(ev.stopPropagation) ev.stopPropagation();
    this.dialog.show(DialogComponent.QUESTION, `Delete Task '${task.name}'?`, task);
    this.dialog.onClose().subscribe(ret => {
      if(ret){
        //console.log('done', ret);        
        let idx = this.tasks.findIndex(t => t.id == task.id);
        if(idx >= 0){
          this.service.delete(task.id).subscribe(ret => this.tasks.splice(idx, 1));
        }
      }
    });
  }

  addComment(ev:any){
    console.log('addComment', ev);  
    if(!this.task.comments) this.task.comments = [];
    this.task.comments.push(new Comment(ev, ''));  
    this.comment = '';
    this.createOrUpdateTask(this.task);
  }

  rmComment(idx: number){
    this.task.comments.splice(idx, 1);
    this.createOrUpdateTask(this.task);
  }

  addTask(ev: any, status?: Status){
    if(ev.stopPropagation) ev.stopPropagation();
    if(ev.preventDefault) ev.preventDefault();
    let stId: any = status? status.id: '';
    const task = new Task(`Untitled-${this.tcnt++}`, stId, this.project.id);
    console.log('add', task);
    //just create a dummy one
    if(!status) {
      this.onEditTask(ev, task);
      return;
    }
    this.createOrUpdateTask(task);
  }

  createOrUpdateTask(task: Task){
    if(!task.state){
      this.service.create(task).subscribe(ret =>{
        console.log('add', ret);     
        this.service.read(ret.id).subscribe({
            next: (task: Task) => {
              console.log('add', task);
              this.tasks.push(task);
              if(this.drawer?.isOpened()) this.task = task;
            },
            error: error => console.log(error)
        });
      });
    }else
      this.service.update(task).subscribe({
          next: (task: Task) => {
            console.log('update', task);
            for(let i=0; i < this.tasks.length; i++){
              if(task.id == this.tasks[i].id){
                this.tasks[i] = task;
                break;
              }
            }
          },
          error: error => console.log(error)
      }
      );
  }

  addLst(ev:any){
    if(ev.stopPropagation) ev.stopPropagation();
    this.statuses.push(new Status(`Untitled-${this.lcnt++}`));
    this.prjService.update(this.project).subscribe(ret => this.show(ev));
  }

  //FIXME: removing list must remove or move all the task to another list
  rmLst(ev: any, status: Status){
    this.dialog.show(DialogComponent.QUESTION, `Delete Task List '${status.name}'?`, status);
    this.dialog.onClose().subscribe(ret => {
      if(ret){
        //console.log('done', ret);        
        let idx = this.statuses.findIndex(l => l.id == status.id);
        if(idx >= 0){
          this.statuses.splice(idx, 1);
          this.prjService.update(this.project).subscribe(ret => this.show(ev));
        }
      }
    });
  }

  show(ev?: any){
    console.log('statuses', this.statuses);
    console.log('tasks', this.tasks);
  }

  close(ev: MouseEvent){
    // if(ev.stopPropagation) ev.stopPropagation();
    if(this.drawer?.isOpened())
      this.drawer.close();
  }

  tagInput(ev:any){
    console.log('tagInput', ev);
    if(ev.preventDefault) ev.preventDefault();
    if(ev.stopPropagation) ev.stopPropagation();
  }
}
